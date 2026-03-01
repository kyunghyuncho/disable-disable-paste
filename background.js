// Handle installation
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["isEnabled"], (result) => {
        if (result.isEnabled === undefined) {
            chrome.storage.sync.set({ isEnabled: true });
        }
    });
});

// Optionally handle messages to broadcast state changes
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "toggleState") {
        const newState = request.isEnabled;
        // Broadcast to all active tabs
        chrome.tabs.query({}, (tabs) => {
            for (let tab of tabs) {
                chrome.tabs.sendMessage(tab.id, {
                    type: "stateChanged",
                    isEnabled: newState
                }).catch(() => {
                    // Ignore errors for tabs that don't have our content script running
                });
            }
        });
        sendResponse({ success: true });
    }
    return true;
});
