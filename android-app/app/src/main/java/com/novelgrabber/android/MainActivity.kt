package com.novelgrabber.android

import android.annotation.SuppressLint
import android.app.DownloadManager
import android.content.ContentValues
import android.content.Context
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.os.Looper
import android.util.Base64
import android.provider.MediaStore
import android.webkit.CookieManager
import android.webkit.JavascriptInterface
import android.webkit.URLUtil
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.novelgrabber.android.databinding.ActivityMainBinding
import java.io.File
import java.io.FileOutputStream

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupWebView(binding.webView)
        binding.webView.loadUrl("file:///android_asset/www/main.html")
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebView(webView: WebView) {
        with(webView.settings) {
            javaScriptEnabled = true
            domStorageEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            builtInZoomControls = false
            displayZoomControls = false

            // Needed so local file-based UI can fetch remote chapter pages.
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
        }

        webView.addJavascriptInterface(AndroidBridge(this), "AndroidBridge")
        webView.webViewClient = WebViewClient()
        webView.webChromeClient = WebChromeClient()

        webView.setDownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            if (url.startsWith("blob:")) {
                toast("Blob downloads are handled inside the app")
                return@setDownloadListener
            }

            val request = DownloadManager.Request(Uri.parse(url)).apply {
                val guessedName = URLUtil.guessFileName(url, contentDisposition, mimeType)
                setTitle(guessedName)
                setDescription("Downloading file")
                setMimeType(mimeType)
                setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, guessedName)

                CookieManager.getInstance().getCookie(url)?.let { cookie ->
                    addRequestHeader("Cookie", cookie)
                }
                addRequestHeader("User-Agent", userAgent)
            }

            val dm = getSystemService(DOWNLOAD_SERVICE) as DownloadManager
            dm.enqueue(request)
            toast("Download started")
        }
    }

    override fun onBackPressed() {
        if (binding.webView.canGoBack()) {
            binding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    private fun toast(msg: String) {
        Toast.makeText(this, msg, Toast.LENGTH_SHORT).show()
    }
}

class AndroidBridge(private val context: Context) {
    @JavascriptInterface
    fun saveBase64File(filename: String, mimeType: String, base64Content: String) {
        Thread {
            try {
                val sanitized = filename.replace(Regex("[\\\\/:*?\"<>|]"), "_")
                val bytes = Base64.decode(base64Content, Base64.DEFAULT)
                val savedName = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    saveWithMediaStore(sanitized, mimeType, bytes)
                } else {
                    saveInAppExternalDownloads(sanitized, bytes)
                }

                if (Looper.myLooper() == Looper.getMainLooper()) {
                    Toast.makeText(context, "Saved: $savedName", Toast.LENGTH_LONG).show()
                } else {
                    android.os.Handler(Looper.getMainLooper()).post {
                        Toast.makeText(context, "Saved: $savedName", Toast.LENGTH_LONG).show()
                    }
                }
            } catch (e: Exception) {
                android.os.Handler(Looper.getMainLooper()).post {
                    Toast.makeText(context, "Save failed: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
        }.start()
    }

    private fun saveWithMediaStore(fileName: String, mimeType: String, bytes: ByteArray): String {
        val resolver = context.contentResolver
        val uniqueName = uniqueDisplayNameForMediaStore(fileName)

        val values = ContentValues().apply {
            put(MediaStore.Downloads.DISPLAY_NAME, uniqueName)
            put(MediaStore.Downloads.MIME_TYPE, mimeType)
            put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS)
            put(MediaStore.Downloads.IS_PENDING, 1)
        }

        val uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values)
            ?: throw IllegalStateException("Could not create download entry")

        resolver.openOutputStream(uri)?.use { stream ->
            stream.write(bytes)
        } ?: throw IllegalStateException("Could not open output stream")

        values.clear()
        values.put(MediaStore.Downloads.IS_PENDING, 0)
        resolver.update(uri, values, null, null)

        return uniqueName
    }

    private fun uniqueDisplayNameForMediaStore(fileName: String): String {
        val resolver = context.contentResolver
        val projection = arrayOf(MediaStore.Downloads.DISPLAY_NAME)
        val dot = fileName.lastIndexOf('.')
        val base = if (dot > 0) fileName.substring(0, dot) else fileName
        val ext = if (dot > 0) fileName.substring(dot) else ""

        var index = 0
        while (true) {
            val candidate = if (index == 0) fileName else "$base ($index)$ext"
            val selection = "${MediaStore.Downloads.DISPLAY_NAME} = ?"
            val args = arrayOf(candidate)

            resolver.query(
                MediaStore.Downloads.EXTERNAL_CONTENT_URI,
                projection,
                selection,
                args,
                null
            )?.use { cursor ->
                if (cursor.count == 0) {
                    return candidate
                }
            }
            index++
        }
    }

    private fun saveInAppExternalDownloads(fileName: String, bytes: ByteArray): String {
        val downloads = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS)
            ?: throw IllegalStateException("No external files directory")
        if (!downloads.exists()) {
            downloads.mkdirs()
        }

        val targetFile = uniqueFile(downloads, fileName)
        FileOutputStream(targetFile).use { it.write(bytes) }
        return targetFile.name
    }

    private fun uniqueFile(dir: File, fileName: String): File {
        var candidate = File(dir, fileName)
        if (!candidate.exists()) return candidate

        val dot = fileName.lastIndexOf('.')
        val base = if (dot > 0) fileName.substring(0, dot) else fileName
        val ext = if (dot > 0) fileName.substring(dot) else ""

        var index = 1
        while (candidate.exists()) {
            candidate = File(dir, "$base ($index)$ext")
            index++
        }
        return candidate
    }
}
