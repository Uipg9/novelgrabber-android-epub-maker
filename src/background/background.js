/**
 * Background Service Worker
 * Handles extension coordination (no ES modules)
 */

// Handle extension icon click - open main UI
chrome.action.onClicked.addListener(async (tab) => {
    // Store the source tab info
    await chrome.storage.local.set({
        sourceTab: {
            id: tab.id,
            url: tab.url,
            title: tab.title
        }
    });
    
    // Open main UI in new tab
    chrome.tabs.create({
        url: chrome.runtime.getURL('src/ui/main.html')
    });
});

// Message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openMainUI') {
        chrome.tabs.create({
            url: chrome.runtime.getURL('src/ui/main.html')
        });
        sendResponse({ success: true });
        return true;
    }
    
    if (message.action === 'getSourceTab') {
        chrome.storage.local.get('sourceTab', (data) => {
            sendResponse({ success: true, data: data.sourceTab });
        });
        return true;
    }
    
    if (message.action === 'downloadEpub') {
        const { blob, filename } = message;
        chrome.downloads.download({
            url: blob,
            filename: filename,
            saveAs: true
        }, (downloadId) => {
            sendResponse({ success: true, downloadId });
        });
        return true;
    }
    
    return false;
});

// Handle install/update
chrome.runtime.onInstalled.addListener((details) => {
    console.log('CG EPUB Creator installed:', details.reason);
});

// Log startup
console.log('[CG EPUB] Background service worker started');
