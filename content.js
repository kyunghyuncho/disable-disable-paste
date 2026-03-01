let isEnabled = true;

// Fetch initial state
chrome.storage.sync.get(["isEnabled"], (result) => {
    if (result.isEnabled !== undefined) {
        isEnabled = result.isEnabled;
    }
});

// Update state when it changes
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "sync" && changes.isEnabled) {
        isEnabled = changes.isEnabled.newValue;
    }
});

// Update state on message from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "stateChanged") {
        isEnabled = request.isEnabled;
    }
});

// 1. Intercept the paste event in the capturing phase
document.addEventListener(
    "paste",
    function (event) {
        if (isEnabled) {
            // Prevent other anti-paste event listeners from firing
            event.stopImmediatePropagation();
        }
    },
    true // Use capturing phase
);

// 2. Remove inline onpaste attributes dynamically
const observer = new MutationObserver((mutations) => {
    if (!isEnabled) return;

    for (const mutation of mutations) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const inputs = node.querySelectorAll ? node.querySelectorAll('input, textarea') : [];
                    const items = [node, ...inputs];

                    items.forEach(el => {
                        if (el.matches && el.matches('input, textarea')) {
                            if (el.hasAttribute('onpaste')) {
                                el.removeAttribute('onpaste');
                            }
                        }
                    });
                }
            });
        } else if (mutation.type === 'attributes' && mutation.attributeName === 'onpaste') {
            const target = mutation.target;
            if (target.matches && target.matches('input, textarea') && target.hasAttribute('onpaste')) {
                target.removeAttribute('onpaste');
            }
        }
    }
});

observer.observe(document.documentElement || document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['onpaste']
});

// Also clear existing elements on document start/load
document.addEventListener('DOMContentLoaded', () => {
    if (isEnabled) {
        document.querySelectorAll('input[onpaste], textarea[onpaste]').forEach(el => {
            el.removeAttribute('onpaste');
        });
    }
});
