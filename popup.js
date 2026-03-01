document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggle-switch');
    const statusText = document.getElementById('status-text');

    // Load initial state
    chrome.storage.sync.get(['isEnabled'], (result) => {
        const isEnabled = result.isEnabled !== false; // Default true
        toggleSwitch.checked = isEnabled;
        updateUI(isEnabled);
    });

    // Handle toggle click
    toggleSwitch.addEventListener('change', (e) => {
        const isEnabled = e.target.checked;

        // Save state
        chrome.storage.sync.set({ isEnabled: isEnabled }, () => {
            updateUI(isEnabled);

            // Send message to active tab to update state dynamically
            chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                if (tabs[0]) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        type: "stateChanged",
                        isEnabled: isEnabled
                    }).catch(err => {
                        console.log("Could not drop message onto tab", err);
                    });
                }
            });
        });
    });

    function updateUI(isEnabled) {
        if (isEnabled) {
            statusText.textContent = "Enabled";
            statusText.className = "";
        } else {
            statusText.textContent = "Disabled";
            statusText.className = "disabled";
        }
    }
});
