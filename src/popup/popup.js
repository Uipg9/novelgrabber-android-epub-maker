/**
 * Popup Script - Simple launcher for main UI
 */

const statusEl = document.getElementById('status');
const btnOpenUI = document.getElementById('btn-open-ui');
const btnDecrypt = document.getElementById('btn-decrypt');

// Check current tab
async function init() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const url = tab.url || '';
        const isCG = url.includes('chrysanthemumgarden');
        
        if (isCG) {
            statusEl.className = 'status supported';
            statusEl.textContent = '✓ ChrysanthemumGarden Detected';
        } else {
            statusEl.className = 'status unsupported';
            statusEl.textContent = 'Any site - Open UI to begin';
        }

        // Store tab info for the UI page
        await chrome.storage.local.set({
            sourceTab: {
                id: tab.id,
                url: tab.url,
                title: tab.title
            }
        });

    } catch (e) {
        statusEl.textContent = 'Ready';
    }
}

// Open the main UI in a new tab
btnOpenUI.addEventListener('click', async () => {
    const uiUrl = chrome.runtime.getURL('src/ui/main.html');
    await chrome.tabs.create({ url: uiUrl });
    window.close();
});

// Decrypt current page
btnDecrypt.addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Inject and run decryption
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: decryptPageContent
        });
        
        statusEl.textContent = '✓ Decryption attempted!';
        statusEl.className = 'status supported';
    } catch (e) {
        statusEl.textContent = 'Could not decrypt: ' + e.message;
    }
});

// Function to inject for decryption
function decryptPageContent() {
    const STANDARD = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const CIPHERS = [
        { key: "tonquerzlawicvfjpsyhgdmkbxJKABRUDQZCTHFVLIWNEYPSXGOM", sel: "span.jum" },
        { key: "vDxtzobGrXESwLWypAkZOMBYQNsdPUTVcFhnHajgRmiKfeuCIJlq", sel: "span[style*='EjUwPEOFVm']" },
    ];
    
    let count = 0;
    for (const { key, sel } of CIPHERS) {
        const table = new Map();
        for (let i = 0; i < 52; i++) table.set(STANDARD[i], key[i]);
        
        document.querySelectorAll(sel).forEach(el => {
            const orig = el.textContent;
            el.textContent = orig.split('').map(c => table.get(c) || c).join('');
            el.removeAttribute('style');
            count++;
        });
    }
    
    if (count > 0) alert(`Decrypted ${count} elements!`);
    else alert('No encrypted content found on this page.');
}

init();
