/**
 * Content Script (Non-module version for injection)
 * Runs on supported pages to extract content
 */

(function() {
    'use strict';

    // Standard alphabet for cipher mapping
    const STANDARD_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    // Cipher tables for ChrysanthemumGarden (subset - full list in background)
    const CIPHER_DATA = [
        { key: "tonquerzlawicvfjpsyhgdmkbxJKABRUDQZCTHFVLIWNEYPSXGOM", selector: "span.jum" },
        { key: "qVTPNEAHbykpxiYtlWdOzUGnsMcZXBQuSaRKICJwgFLDefrvhmjo", selector: "span[style*='ZxXoTeIptL']" },
        { key: "PwyUBVTYqAXxZMfEjrSeDazCkWoivHJbKltNdLOhupgImQscnFRG", selector: "span[style*='ijqXQijeiD']" },
        { key: "vDxtzobGrXESwLWypAkZOMBYQNsdPUTVcFhnHajgRmiKfeuCIJlq", selector: "span[style*='EjUwPEOFVm']" },
        { key: "dTKbCMwpkGWJrJOUiFVesPoXRfQSmuvqglEyDBLnzIYHAZcaxthN", selector: "span[style*='WTKNOkuWha']" },
        { key: "JznCuUZtTgKGAkvwBSOYLHsihaNEPpMVefWRoqlymbjcIXrdQDFx", selector: "span[style*='rnlfJtfRCW']" },
        { key: "cHMZtWYfaEipjXbRPLogAFSBDVrOmUNxIlkeCszTuwKhdJnGqQyv", selector: "span[style*='LPJMfkmHKG']" },
        { key: "iKhDSORsAbqBtGNYpecfHQEwklxJlWCmTLjFdzrPXuvVonMygUZa", selector: "span[style*='PWJEddcfVv']" },
        { key: "gjkChAdlBJYOVIxTXnisWLvmyEMtuGzPpaebFDcZoRHSwUrNfqKQ", selector: "span[style*='ofcUGYMWCy']" },
        { key: "FGqNYQLTPUHecErxRuCjBkDXbMaKyfzOhJdipolAgWItZVsnmSvw", selector: "span[style*='hffmcMyCbf']" },
        { key: "upTZVvjGaMwRBUXelqJACQfFkybrEnmoWcgHxYPztSshDOIdLiKN", selector: "span[style*='ktlmWRazmy']" },
        { key: "RWOVtgzYjNfXMPQqscdZKwrLlFBCevhHSAEDIpnoGTukibyxamJU", selector: "span[style*='UxneBYgsjE']" },
    ];

    // Build cipher tables - map FROM cipher TO standard (for decryption)
    const cipherTables = new Map();
    for (const { key, selector } of CIPHER_DATA) {
        const table = new Map();
        for (let i = 0; i < STANDARD_ALPHABET.length; i++) {
            // key[i] is the cipher char, STANDARD_ALPHABET[i] is what it decrypts to
            table.set(key[i], STANDARD_ALPHABET[i]);
        }
        cipherTables.set(selector, table);
    }

    /**
     * Decrypt text using cipher table
     */
    function decryptText(text, table) {
        return text.split('').map(char => table.get(char) || char).join('');
    }

    /**
     * Decrypt content in DOM
     */
    function decryptContent(root) {
        let count = 0;
        for (const [selector, table] of cipherTables) {
            try {
                const elements = root.querySelectorAll(selector);
                for (const el of elements) {
                    const original = el.textContent;
                    const decrypted = decryptText(original, table);
                    if (original !== decrypted) {
                        el.textContent = decrypted;
                        el.removeAttribute('style');
                        count++;
                    }
                }
            } catch (e) { /* ignore selector errors */ }
        }
        return count;
    }

    /**
     * Clean text
     */
    function cleanText(text) {
        return (text || '').replace(/\s+/g, ' ').trim();
    }

    /**
     * Get novel info from page
     */
    function getNovelInfo() {
        const info = {
            title: '',
            author: '',
            description: '',
            coverUrl: '',
            url: window.location.href,
            totalChapters: 0
        };

        // Title - try multiple selectors
        const titleSelectors = ['.novel-title', 'h1.entry-title', '.entry-title', 'h1', '.title'];
        for (const sel of titleSelectors) {
            const el = document.querySelector(sel);
            if (el && el.textContent.trim()) {
                info.title = cleanText(el.textContent);
                break;
            }
        }

        // Author
        const authorSelectors = ['.novel-author a', '.author a', 'a[href*="/author/"]', '.author'];
        for (const sel of authorSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                info.author = cleanText(el.textContent);
                break;
            }
        }

        // Cover
        const coverSelectors = ['.novel-cover img', '.cover img', '.entry-content img', 'article img'];
        for (const sel of coverSelectors) {
            const el = document.querySelector(sel);
            if (el && el.src) {
                info.coverUrl = el.src;
                break;
            }
        }

        // Description
        const descSelectors = ['.novel-description', '.summary', '.novel-content p'];
        for (const sel of descSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const clone = el.cloneNode(true);
                decryptContent(clone);
                info.description = cleanText(clone.textContent).substring(0, 500);
                break;
            }
        }

        // Get chapter count
        const chapters = getChapterList();
        info.totalChapters = chapters.length;

        return info;
    }

    /**
     * Get chapter list
     */
    function getChapterList() {
        const chapters = [];
        const seen = new Set();
        
        // Find chapter links
        const links = document.querySelectorAll('a[href*="chapter"], a[href*="/novel/"]');
        
        for (const link of links) {
            const url = link.href;
            const title = cleanText(link.textContent);
            
            // Skip non-chapter links
            if (!title || seen.has(url)) continue;
            if (url.includes('/tag/') || url.includes('/category/')) continue;
            if (title.length < 2 || title.length > 200) continue;
            
            seen.add(url);
            chapters.push({
                index: chapters.length,
                title: title,
                url: url
            });
        }

        return chapters;
    }

    /**
     * Extract chapter content from current page
     */
    function extractChapter() {
        const result = {
            title: '',
            content: '',
            url: window.location.href
        };

        // Title
        const titleSelectors = ['.chapter-title', 'h1.entry-title', 'h1', '.entry-title'];
        for (const sel of titleSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                result.title = cleanText(el.textContent);
                break;
            }
        }

        // Content
        const contentSelectors = ['#novel-content', '.novel-content', '.chapter-content', '.entry-content', 'article'];
        for (const sel of contentSelectors) {
            const el = document.querySelector(sel);
            if (el) {
                const clone = el.cloneNode(true);
                
                // Remove unwanted elements
                const remove = ['script', 'style', 'iframe', '.ads', '.ad', '.navigation', '.nav', '.comments', '.share', '.social'];
                for (const r of remove) {
                    clone.querySelectorAll(r).forEach(e => e.remove());
                }
                
                // Decrypt using cipher tables (for any spans that match)
                decryptContent(clone);
                
                result.content = clone.innerHTML;
                
                // Also get the VISUAL text (what user sees after font rendering)
                // This is key for font-based encryption like ChrysanthemumGarden
                result.visualText = el.innerText;
                
                break;
            }
        }

        return result;
    }

    /**
     * Get full page HTML
     */
    function getPageHtml() {
        return {
            html: document.documentElement.outerHTML,
            url: window.location.href,
            title: document.title
        };
    }

    // Message handler
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        try {
            switch (message.action) {
                case 'ping':
                    sendResponse({ success: true });
                    break;
                case 'getNovelInfo':
                    sendResponse({ success: true, data: getNovelInfo() });
                    break;
                case 'getChapterList':
                    sendResponse({ success: true, data: getChapterList() });
                    break;
                case 'extractChapter':
                    sendResponse({ success: true, data: extractChapter() });
                    break;
                case 'getPageHtml':
                    sendResponse({ success: true, data: getPageHtml() });
                    break;
                case 'decryptPage':
                    const count = decryptContent(document);
                    sendResponse({ success: true, data: { decrypted: count } });
                    break;
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
        return true;
    });

    // Notify ready
    console.log('[CG EPUB] Content script loaded on', window.location.hostname);
})();
