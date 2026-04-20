# Meraki Concepts & Decor Website

Production-ready static website for **Meraki Concepts & Decor**.

## Included Pages
- `index.html` – modern homepage with services, portfolio, process, and Google Drive recent-work embed.
- `contact.html` – event inquiry page with three actions:
  - Submit Inquiry (direct notification workflow via webhook)
  - Send on WhatsApp
  - Send via Email

## Configuration
Business/contact values are managed in:

- `data/contact.json`

Key fields:
- `phone`
- `email`
- `facebook`
- `googleDriveFolderId`
- `whatsappTestNumber`
- `inquiryWebhookUrl`

### Direct notification flow (without opening WhatsApp UI)
Set `inquiryWebhookUrl` to your backend/webhook endpoint.
When visitors click **Submit Inquiry**, the form sends JSON to this endpoint.
From there you can trigger:
- WhatsApp Cloud API message to your business number
- Slack/Email/SMS notification
- CRM lead creation

## Run Locally
Use a local web server (required because site loads JSON via `fetch`).

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


## Testing defaults
- Email: `gupta.vardan@gmail.com`
- Phone / WhatsApp: `+61450062206`
