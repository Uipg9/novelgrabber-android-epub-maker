# CG EPUB Creator

A browser extension for creating EPUB files from ChrysanthemumGarden web novels with integrated font-based text decryption.

## Features

- 📖 Convert ChrysanthemumGarden chapters to EPUB format
- 🔓 Automatic decryption of font-encrypted text (190+ cipher tables included)
- 🖼️ Optional image downloading
- 🔐 Password support for locked chapters
- ⚡ Rate-limited downloading to avoid bans
- 🎨 Clean, dark-themed UI
- 📱 Works like WebToEpub - opens full UI in new tab

## Installation

### Development / Unpacked

1. Clone or download this repository
2. Open Chrome/Edge and go to `chrome://extensions/` or `edge://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the `WebExtension` folder
5. The extension icon will appear in your toolbar

## Usage

### Creating EPUBs from Web Novels

1. Navigate to a ChrysanthemumGarden novel page (table of contents or any chapter)
2. **Click the extension icon** in your toolbar
3. A new tab opens with the full EPUB Creator interface
4. The URL from your original tab is automatically filled in
5. Click **"Fetch"** to load the novel info and chapter list
6. Configure options:
   - **Chapter Range**: Select which chapters to include
   - **Include Images**: Toggle image downloading
   - **Password**: Enter Discord password for locked chapters  
   - **Download Delay**: Adjust rate limiting (default 1000ms)
7. Use "Select All" / "Select None" to manage chapters
8. Click **"Create EPUB"**
9. Watch the progress as chapters are downloaded and decrypted
10. The EPUB automatically downloads when complete

### Decrypting Existing EPUBs

If you have EPUB files (from WebToEpub or other tools) with encrypted text:

1. Open the standalone decryptor: `src/tools/decryptor.html`
   - Just double-click the file to open in browser
   - Or access via extension: right-click extension → "Open decryptor"
2. Drag and drop your EPUB file (or click to browse)
3. The tool processes all HTML files in the EPUB
4. Download the decrypted EPUB

**Note**: The decryptor uses JSZip from CDN, so you need internet connection.

## How It Works

ChrysanthemumGarden uses font-based encryption where certain text is displayed using custom fonts that map characters differently. This extension:

1. Identifies encrypted `<span>` elements by their CSS selectors
2. Applies the correct cipher table (190+ tables included) to decode the text
3. Removes the encryption markers while preserving the readable content

## Project Structure

```
WebExtension/
├── manifest.json           # Extension manifest (MV3)
├── src/
│   ├── background/         # Service worker
│   │   └── background.js   # Opens UI on icon click
│   ├── content/            # Content scripts
│   │   └── content.js      # Page decryption (injected on CG pages)
│   ├── ui/                 # Main UI (opens in new tab)
│   │   ├── main.html       # Full EPUB creator interface
│   │   ├── main.css
│   │   └── main.js         # All logic: fetch, decrypt, build EPUB
│   ├── tools/              # Standalone tools
│   │   └── decryptor.html  # EPUB decryption tool
│   ├── core/               # EPUB building modules
│   ├── decryption/         # Cipher tables and engine
│   ├── parsers/            # Site-specific parsers
│   └── utils/              # Utility functions
│   │   ├── http-client.js
│   │   ├── sanitizer.js
│   │   └── zip-handler.js
│   └── tools/              # Standalone tools
│       ├── epub-decryptor.js
│       └── decryptor.html
└── README.md
```

## Android App (APK)

This repository now includes an Android wrapper project at `android-app/`.

- It packages the existing `src/ui` app inside a native WebView.
- It supports saving generated EPUB files directly on Android.
- Build instructions are in `android-app/README.md`.

## How Font Encryption Works

ChrysanthemumGarden uses custom web fonts to encrypt text:

1. Text is stored with substituted characters (e.g., "a" → "t", "b" → "o")
2. A custom font renders the substituted characters as the original text
3. Copying text results in scrambled characters

### Decryption Process

The extension uses known cipher tables to reverse the substitution:

```javascript
// Example cipher for span.jum class
const cipherKey = "tonquerzlawicvfjpsyhgdmkbxJKABRUDQZCTHFVLIWNEYPSXGOM";
// 'a' maps to 't', 'b' maps to 'o', etc.
```

Each CSS selector has its own cipher table. The extension includes 190+ known cipher/selector combinations.

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **EPUB Version**: 3.0 with EPUB 2 NCX compatibility
- **ZIP Format**: Custom implementation with proper mimetype handling
- **Rate Limiting**: Configurable delays between requests (default 1s)

## Adding New Sites

To add support for additional sites:

1. Create a new parser in `src/parsers/`
2. Extend `ParserBase` class
3. Implement required methods:
   - `getNovelInfo(dom)`
   - `getChapterList(dom)`
   - `extractChapter(dom, chapterInfo)`
4. Register in `src/parsers/index.js`

## Troubleshooting

### Extension doesn't detect the site
- Make sure you're on chrysanthemumgarden.com
- Try refreshing the page
- Check that the extension is enabled

### Encrypted text in EPUB
- The cipher table might be new/unknown
- Use the standalone decryptor tool to try processing
- Report the issue with the cipher selector

### Rate limiting / blocked
- Increase the download delay in options
- Wait before trying again
- Consider using a VPN

## Credits

- Cipher tables sourced from [EpubEditor](https://github.com/nicoleahmed/EpubEditor)
- Inspired by [WebToEpub](https://github.com/dteviot/WebToEpub)

## License

MIT License - See LICENSE file for details

## Disclaimer

This tool is for personal use only. Please respect content creators and support official releases when available.
