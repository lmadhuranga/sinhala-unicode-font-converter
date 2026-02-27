# Chrome Web Store Submission Pack

## 1) Store listing fields (copy/paste)

### Extension name
Sinhala Selection Converter

### Short description (132 chars max)
Convert selected Singlish text into Sinhala Unicode instantly from the right-click menu.

### Detailed description
Sinhala Selection Converter helps you convert Singlish text into proper Sinhala Unicode directly in your browser.

How it works:
- Select Singlish text on any page.
- Right-click and choose "Convert to Sinhala (Unicode)".
- The extension opens a converter panel, shows Sinhala Unicode output, and lets you copy it quickly.

Key features:
- Fast conversion from Singlish to Sinhala Unicode.
- Right-click context menu support.
- Toolbar click support.
- Keyboard shortcut support (`Shift+Alt+S`).
- Works only when you interact with the extension.

No account is required, and no personal data is collected, sold, or transferred.

### Category
Productivity

### Language
English

## 2) Graphics to upload
Use these files from this repo:

- App icon (required): `assets/icons/icon128.png`
- Small promo tile (optional): `assets/store/logo-440x280.png`
- Marquee promo tile (optional): `assets/store/logo-1400x560.png`
- Screenshot (required): `assets/store/screenshot-1280x800.png`

## 3) Privacy practices tab (required text)

### Single purpose description (required)
This extension converts user-selected Singlish text into Sinhala Unicode on the active page when the user clicks the context menu, toolbar button, or keyboard shortcut.

### Permission justification: `activeTab`
`activeTab` is used to run the converter only in the currently active tab after a direct user action (toolbar click, keyboard shortcut, or context menu click).

### Permission justification: `contextMenus`
`contextMenus` is used to add the "Convert to Sinhala (Unicode)" right-click option so users can convert selected text quickly.

### Permission justification: `scripting`
`scripting` is used to inject local converter scripts into the active tab at the time of user interaction so conversion can run on that page.

### Host permission use justification
This extension does not request persistent host permissions. It only runs on the active tab after explicit user action.

### Remote code use justification
This extension does not use remote code. All executable code is packaged inside the extension and reviewed at upload time.

### Data usage disclosure
- Not sold to third parties.
- Not used for personalized ads.
- Not used for creditworthiness/lending.
- Not collecting personal or sensitive user data.
- Processing is local in-browser for the conversion feature.

## 4) Required account steps (outside code)
You must complete these in Chrome Web Store dashboard:

1. Add a contact email in `Account` tab.
2. Verify that contact email from the verification email.
3. On `Privacy practices`, complete all required fields and certify compliance.
4. Re-upload package and publish.

## 5) Package upload checklist

1. Rebuild zip from current extension folder so new icons are included.
2. Upload the new zip in Developer Dashboard.
3. Upload icon and screenshot assets listed above.
4. Paste the privacy justifications above.
5. Submit for review.
