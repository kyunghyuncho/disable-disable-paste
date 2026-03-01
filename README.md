# Force Paste (disable-disable-paste)

A Manifest V3 browser extension for Microsoft Edge that prevents websites from blocking your ability to paste text (e.g., in password, email, or confirmation fields).

## Features
- **Intercepts Paste Events:** Catches `paste` events in the capturing phase and stops propagation to prevent site-specific blocking scripts from intercepting them.
- **Dynamic Attribute Stripping:** Uses a `MutationObserver` to watch the DOM and actively strip inline `onpaste="return false;"` attributes from input fields and text areas, even if they are loaded dynamically.
- **Easy Toggle:** Includes a simple popup interface to toggle the extension on or off without needing to disable it from the extensions page.
- **State Synchronization:** The toggle state is synchronized across all tabs and persists via `chrome.storage.sync`.

## File Structure
- `manifest.json`: Defines Manifest V3 configuration, permissions, and script injections.
- `content.js`: The core logic that runs on all web pages to neutralize paste blockers.
- `background.js`: Service worker managing the extension's default state on installation.
- `popup.html`, `popup.css`, `popup.js`: The user interface for the toggle switch.
- `assets/`: Contains the extension icons in various sizes.
- `scripts/generate_icons.py`: A Python utility script to auto-generate the required icon sizes using the Pillow library.

## Installation for Testing (Local / Unpacked)

Since this extension is not published to the Edge Add-ons store, you can install it locally for testing:

1. Open Microsoft Edge.
2. Navigate to `edge://extensions/`.
3. Locate the **Developer mode** toggle (usually in the bottom-left sidebar or top-right) and turn it **ON**.
4. Click the **Load unpacked** button.
5. Select the directory containing this project (`disable-disable-paste`).
6. The "Force Paste" extension will now appear in your list of extensions and in the toolbar. 

## Development

If you need to regenerate the icons from the base `assets/icon128.png`, you can use the provided Python script:

```bash
uv venv
source .venv/bin/activate
uv pip install pillow
python scripts/generate_icons.py
```