# PLAN.md: "Force Paste" Edge Extension

## 1. Project Overview
**Goal:** Create a Manifest V3 browser extension for Microsoft Edge that prevents websites from blocking the user's ability to paste text (e.g., in password, email, or confirmation fields).
**Architecture:**
* `manifest.json`: Defines Manifest V3 configuration, permissions, and script injections.
* `content.js`: Injected into all pages to intercept and neutralize paste-blocking scripts.
* `popup.html` / `popup.js`: A simple UI to toggle the extension on or off.
* `background.js` (Service Worker): Manages the extension's toggle state across tabs.
* `scripts/generate_icons.js`: A utility script to auto-generate required icon sizes.

## 2. Implementation Steps

### Phase 1: Extension Manifest & Boilerplate
1.  **Create `manifest.json`:**
    * Set `manifest_version` to 3.
    * Define `name`, `version`, and `description`.
    * Request permissions: `storage` (to save the toggle state) and `scripting`.
    * Define `host_permissions` as `["<all_urls>"]`.
    * Register `background.js` as a service worker.
    * Register `content.js` to run on `<all_urls>`. Crucially, set `"run_at": "document_start"` so our script executes before the site's own JavaScript loads.
    * Register `popup.html` under `action`.
    * Reference icons: 16, 32, 48, and 128 sizes.

### Phase 2: Core Logic (Content Script)
1.  **Create `content.js`:**
    * Implement an initialization check to see if the extension is currently enabled via `chrome.storage.sync`.
    * **Event Interception:** Add an event listener to the `document` for the `paste` event.
    * **Use the Capturing Phase:** Pass `true` as the third argument to `addEventListener`. This ensures the extension catches the paste event on its way down the DOM tree, *before* it reaches the target input field where the site's restrictive scripts are listening. 
    
    * **Neutralize Blockers:** Inside the event listener, call `event.stopImmediatePropagation()`. This prevents any subsequent event listeners (the website's blocking scripts) from firing, allowing the browser's default paste behavior to succeed.
    * **DOM Mutation Observer:** Set up a `MutationObserver` to actively strip inline `onpaste="return false;"` attributes from input fields as they are dynamically added to the DOM.

### Phase 3: State Management (Background Script)
1.  **Create `background.js`:**
    * Initialize a default state (e.g., `isEnabled: true`) in `chrome.storage.sync` when the extension is first installed using `chrome.runtime.onInstalled`.
    * Listen for messages from the popup or content scripts to update or broadcast state changes across all open tabs.

### Phase 4: User Interface (Popup)
1.  **Create `popup.html`:**
    * Build a minimal HTML interface with a toggle switch or button (e.g., "Force Paste: ON/OFF").
    * Link to `popup.js` and a basic CSS file for styling.
2.  **Create `popup.js`:**
    * On load, fetch the current state from `chrome.storage.sync` and update the UI accordingly.
    * Add a click listener to the toggle button that updates the state in storage.
    * Send a message to the active tab to dynamically enable/disable the `content.js` event listeners without requiring a page reload.

### Phase 5: Icon Automation and Packaging
1.  **Setup Base Icon:** Save the provided 128x128 icon image to the workspace as `assets/icon128.png`.
2.  **Create Automation Script:** * Write a Node.js script (`scripts/generate_icons.js`) utilizing the `sharp` library (or a Python script using `Pillow`, depending on the workspace environment).
    * Program the script to read `assets/icon128.png` and automatically resize/export it to `assets/icon16.png`, `assets/icon32.png`, and `assets/icon48.png`.
3.  **Execute Script:** Run the script to generate the missing assets before finalizing the extension folder.
4.  **Testing Instructions:** Document the steps to test locally in Edge (`edge://extensions/` -> Enable Developer Mode -> Load Unpacked).