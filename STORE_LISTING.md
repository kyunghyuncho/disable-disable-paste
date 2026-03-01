# Store Listing Metadata

## Product Details

**Extension Name:** Force Paste
**Version:** 1.0.0
**Category:** Productivity
**Search Terms:** force paste, enable paste, copy paste, password paste, unblock paste

## Description

**Short Description:**
Prevents websites from maliciously blocking your ability to paste text into password, email, and confirmation fields.

**Long Description:**
Have you ever tried to paste a secure, auto-generated password into a website only to find that the site has blocked pasting? 

"Force Paste" is a lightweight, easy-to-use Microsoft Edge extension that permanently solves this problem. It works quietly in the background to neutralize the scripts that websites use to maliciously disable pasting in password, email, and confirmation fields. 

**Features:**
* **Instant Unblocking:** Intercepts and stops websites from capturing and canceling your paste events.
* **Dynamic Protection:** Actively watches the page to strip out restrictive `onpaste` attributes even if the website loads them dynamically after the page has started.
* **Simple Toggle:** Includes a clean, minimalistic popup to easily toggle the extension on or off without needing to navigate to Edge's extension management page.
* **Privacy First:** Requires no internet connection to function. It only requires the permissions necessary to ensure you can always paste your own text.

**Why is this important?**
Blocking pasted text forces users to manually type complex passwords, which actively degrades security and discourages the use of password managers. Force Paste ensures you remain in control of your clipboard and your security.

---

## Required Permissions Justification

**`<all_urls>` (Read and change all your data on the websites you visit):**
This permission is strictly required because the extension's core functionality is to inject a lightweight content script (`content.js`) into every webpage the user visits. This script is necessary to intercept the browser's `paste` event before the website's own restrictive scripts can block it. It also uses a `MutationObserver` to remove `onpaste="return false;"` attributes from input fields across any domain. Without this broad permission, the extension cannot guarantee that pasting will be unblocked on whatever site the user happens to be visiting.

**`storage`:**
Required to save the user's preference for whether the extension is currently toggled "Enabled" or "Disabled" so the state persists across browser sessions.

**`scripting`:**
Required to support the dynamic execution of scripts if needed for advanced unblocking techniques in the future, and to support the core manifest V3 architecture.

---

## Notes for Certification

**Test Instructions:**
To test this extension, you can navigate to any website with an input field and observe the behavior when pasting text. 

Testing steps:
1. Ensure the extension is installed and the "Force Paste" switch is toggled to "Enabled" in the extension popup.
2. Go to a test webpage that blocks pasting (e.g., a simple HTML page with `<input type="password" onpaste="return false;">`).
3. Attempt to paste text into the input field. The text should paste successfully, demonstrating that the extension intercepts the paste-blocking scripts.
4. Toggle the extension to "Disabled" via the popup, and observe that pasting is once again blocked by the page's scripts (if testing on a blocking page).

**Additional Notes:**
- The extension operates entirely locally and does not require any test accounts or logins.
- It injects a minimal content script (`content.js`) at `document_start` to ensure it can intercept the `paste` event before the website's own restrictive scripts.
- No personal data or clipboard contents are collected, stored, or transmitted by this extension.
