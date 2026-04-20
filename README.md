# Meraki Events n Decor Website

Elegant static website with:
- `index.html` (home, services, gallery, CTA)
- `contact.html` (direct contact actions + inquiry form)

## Contact flow
Customers can reach directly through:
- Call button
- WhatsApp chat button
- Email button
- Inquiry form (FormSubmit email delivery)

> Form action is currently configured to `gupta.vardan@gmail.com`.

## Configuration
Edit `data/contact.json` for business details and social links.

## Run locally
```bash
python3 -m http.server 8080
```
Open `http://localhost:8080`.
