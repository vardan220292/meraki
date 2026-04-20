# Meraki Concepts & Decor Website

Modern multi-page static website for **Meraki Concepts & Decor** with:
- Homepage (`index.html`)
- Contact Forum page (`contact.html`) for WhatsApp + Email inquiries
- JSON-based contact/profile configuration
- Manual image gallery folder support
- Embedded Google Drive gallery on homepage

## Project Structure

- `index.html` → homepage
- `contact.html` → forum/contact page
- `styles.css` → shared website styling
- `script.js` → dynamic data loading + form actions
- `data/contact.json` → edit contact details once, reflected across pages
- `images/manual/manifest.json` → list images to auto-display in homepage gallery
- `images/manual/` → folder to store your own image files
- `assets/` → starter placeholders

## 1) Update Contact Details (single file)

Edit:

```json
/data/contact.json
```

Important fields:
- `phone` → displayed business number
- `email` → email inquiry destination
- `whatsappTestNumber` → currently set to `+61450062206` for testing
- `googleDriveFolderId` → controls homepage Drive embed

## 2) Add More Images Manually (auto-display)

1. Copy your images to:

```text
images/manual/
```

2. Add entries in:

```json
images/manual/manifest.json
```

Example:

```json
{
  "images": [
    { "src": "images/manual/haldi-setup.jpg", "alt": "Haldi setup" },
    { "src": "images/manual/stage-night.jpg", "alt": "Reception stage" }
  ]
}
```

The homepage gallery reads this file and displays all listed images automatically.

## 3) Google Drive Photos on Homepage

Homepage includes a live Google Drive embed:

```text
https://drive.google.com/embeddedfolderview?id=YOUR_FOLDER_ID#grid
```

Set `googleDriveFolderId` in `data/contact.json` to your Drive folder ID.

## 4) Run Locally

Because the site loads local JSON files (`fetch`), use a local server (not opening HTML directly).

### Option A (Python)

```bash
python3 -m http.server 8080
```

Open:

```text
http://localhost:8080
```

### Option B (Node)

```bash
npx serve .
```

Then open the URL shown in terminal.

## 5) Deploy to GitHub Pages

1. Push all files to your GitHub repository.
2. Open **Settings → Pages**.
3. Select deployment source as your branch root.
4. Save and wait for the live URL.
