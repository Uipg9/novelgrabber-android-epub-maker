# Android App (APK) - Novel to EPUB

This folder contains a native Android WebView wrapper for your existing extension UI.

## What this Android app does

- Loads the existing web UI from `src/ui/main.html`
- Ships UI files from `android-app/app/src/main/assets/www/`
- Enables JavaScript + DOM storage in WebView
- Allows cross-origin fetch from local UI (required for chapter scraping)
- Supports EPUB save via an Android bridge (`AndroidBridge.saveBase64File`)
- Uses system DownloadManager for normal non-blob downloads

## Open in Android Studio

1. Open Android Studio
2. Choose **Open** and select this folder:
   - `android-app`
3. Let Gradle sync complete

## Build Debug APK

1. In Android Studio, open **Build > Build Bundle(s) / APK(s) > Build APK(s)**
2. APK output path:
   - `android-app/app/build/outputs/apk/debug/app-debug.apk`

## Install on phone

1. Enable developer mode + USB debugging on your phone
2. Connect device
3. Run in terminal from `android-app`:

```powershell
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

## Notes

- For Android 10+ files are saved to the public Downloads folder via MediaStore.
- For Android 9 and lower files are saved in app external downloads.
- This is a wrapper around your existing UI logic, so future UI edits in `src/ui` are automatically included on next Android build.
- If you update files in `src/ui`, copy them into Android assets before building:

```powershell
Copy-Item -Path ..\src\ui\* -Destination .\app\src\main\assets\www -Recurse -Force
```
