# Meraki Concepts & Decor Website

Production-ready static website for **Meraki Concepts & Decor**.

## Included Pages
- `index.html` – modern homepage with services, portfolio, process, and Google Drive recent-work embed.
- `contact.html` – event inquiry page with direct WhatsApp and email actions.

## Configuration
Business/contact values are managed in one file:

- `data/contact.json`

You can update:
- business name
- owner name
- phone
- email
- Facebook URL
- Google Drive folder ID
- WhatsApp test number

## Run Locally
Use a local web server (important because the site loads JSON via `fetch`).

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Deploy to GitHub Pages
1. Push repository to GitHub.
2. Open **Settings → Pages**.
3. Select branch and root folder.
4. Save and wait for deployment.
