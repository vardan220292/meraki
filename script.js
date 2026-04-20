const CONTACT_DATA_PATH = "data/contact.json";

async function readJson(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  } catch (error) {
    console.warn(error.message);
    return null;
  }
}

function normalizePhoneForWhatsApp(phoneNumber) {
  return phoneNumber.replace(/[^\d]/g, "");
}

function fillGlobalElements(contactData) {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const businessName = contactData.businessName || "Meraki Concepts & Decor";
  const nodes = [
    document.getElementById("brandName"),
    document.getElementById("footerBusiness"),
    document.getElementById("contactBrand"),
    document.getElementById("contactFooterBusiness"),
    document.getElementById("aboutBusiness")
  ];

  nodes.forEach((node) => {
    if (node) node.textContent = businessName;
  });
}

function fillHomePage(contactData) {
  const heroTagline = document.getElementById("heroTagline");
  if (heroTagline && contactData.tagline) heroTagline.textContent = contactData.tagline;

  const callBtn = document.getElementById("callBtn");
  if (callBtn && contactData.phone) {
    callBtn.href = `tel:${contactData.phone.replace(/\s+/g, "")}`;
  }

  const quickDetails = document.getElementById("quickDetails");
  if (quickDetails) {
    quickDetails.innerHTML = `
      <li><strong>Owner:</strong> ${contactData.owner || "-"}</li>
      <li><strong>Category:</strong> ${contactData.category || "-"}</li>
      <li><strong>Location:</strong> ${contactData.address || "-"}</li>
      <li><strong>Phone:</strong> ${contactData.phone || "-"}</li>
      <li><strong>Email:</strong> ${contactData.email || "-"}</li>
    `;
  }

  const contactStrip = document.getElementById("contactStrip");
  if (contactStrip) {
    contactStrip.innerHTML = `
      <span>📍 ${contactData.address || "Pune"}</span>
      <span>📞 ${contactData.phone || "NA"}</span>
      <span>✉️ ${contactData.email || "NA"}</span>
    `;
  }

  const driveFrame = document.getElementById("driveFrame");
  if (driveFrame && contactData.googleDriveFolderId) {
    driveFrame.src = `https://drive.google.com/embeddedfolderview?id=${contactData.googleDriveFolderId}#grid`;
  }

  const schemaNode = document.getElementById("schemaData");
  if (schemaNode) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "EventPlanner",
      name: contactData.businessName,
      email: contactData.email,
      telephone: contactData.phone,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Pune",
        addressCountry: "IN"
      },
      sameAs: [contactData.facebook].filter(Boolean)
    };
    schemaNode.textContent = JSON.stringify(schema);
  }
}

function formPayload(form) {
  const formData = new FormData(form);
  return {
    name: formData.get("name") || "",
    phone: formData.get("phone") || "",
    eventType: formData.get("eventType") || "",
    eventDate: formData.get("eventDate") || "",
    venue: formData.get("venue") || "",
    message: formData.get("message") || "",
    submittedAt: new Date().toISOString()
  };
}

function payloadToMessage(payload) {
  return [
    "Hello Meraki Concepts & Decor,",
    "I would like to inquire about an upcoming event.",
    "",
    `Name: ${payload.name}`,
    `Phone: ${payload.phone}`,
    `Event Type: ${payload.eventType}`,
    `Event Date: ${payload.eventDate}`,
    `Venue: ${payload.venue}`,
    `Message: ${payload.message}`
  ].join("\n");
}

async function sendInquiryToWebhook(webhookUrl, payload) {
  const response = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("Webhook request failed");
  }
}

function fillContactPage(contactData) {
  const contactList = document.getElementById("forumContactList");
  if (contactList) {
    contactList.innerHTML = `
      <li><strong>Phone:</strong> ${contactData.phone || "-"}</li>
      <li><strong>Email:</strong> ${contactData.email || "-"}</li>
      <li><strong>Address:</strong> ${contactData.address || "-"}</li>
      <li><strong>Facebook:</strong> <a href="${contactData.facebook || "#"}" target="_blank" rel="noopener noreferrer">Open Page</a></li>
    `;
  }

  const hint = document.getElementById("forumHint");
  if (hint) {
    const webhookConfigured = contactData.inquiryWebhookUrl && contactData.inquiryWebhookUrl.startsWith("http");
    hint.textContent = webhookConfigured
      ? "Inquiry submit button is connected to webhook mode. You will receive details without opening visitor WhatsApp UI."
      : `Webhook is not configured. WhatsApp button uses ${contactData.whatsappTestNumber || contactData.phone || "your default number"}.`;
  }

  const form = document.getElementById("inquiryForm");
  const sendWhatsApp = document.getElementById("sendWhatsApp");
  const sendEmail = document.getElementById("sendEmail");
  const submitInquiry = document.getElementById("submitInquiry");

  if (!form || !sendWhatsApp || !sendEmail) return;

  sendWhatsApp.addEventListener("click", () => {
    const payload = formPayload(form);
    const number = normalizePhoneForWhatsApp(contactData.whatsappTestNumber || contactData.phone || "");
    const message = encodeURIComponent(payloadToMessage(payload));
    window.open(`https://wa.me/${number}?text=${message}`, "_blank");
  });

  sendEmail.addEventListener("click", () => {
    const payload = formPayload(form);
    const subject = encodeURIComponent("Event Inquiry - Meraki Concepts & Decor");
    const body = encodeURIComponent(payloadToMessage(payload));
    window.location.href = `mailto:${contactData.email || "merakieventsndecor@gmail.com"}?subject=${subject}&body=${body}`;
  });

  if (submitInquiry) {
    submitInquiry.addEventListener("click", async () => {
      const payload = formPayload(form);
      const webhookUrl = contactData.inquiryWebhookUrl || "";

      if (!webhookUrl.startsWith("http")) {
        alert("Please configure inquiryWebhookUrl in data/contact.json to receive direct notifications.");
        return;
      }

      submitInquiry.disabled = true;
      submitInquiry.textContent = "Submitting...";

      try {
        await sendInquiryToWebhook(webhookUrl, {
          source: "meraki-website",
          business: contactData.businessName || "Meraki Concepts & Decor",
          inquiry: payload
        });
        alert("Inquiry submitted successfully. Team has been notified.");
        form.reset();
      } catch (error) {
        alert("Could not submit inquiry. Please try WhatsApp or Email options.");
      } finally {
        submitInquiry.disabled = false;
        submitInquiry.textContent = "Submit Inquiry";
      }
    });
  }
}

function bindMenu() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  if (!menuToggle || !mainNav) return;

  menuToggle.addEventListener("click", () => {
    mainNav.classList.toggle("open");
  });
}

async function init() {
  bindMenu();
  const contactData = (await readJson(CONTACT_DATA_PATH)) || {};
  fillGlobalElements(contactData);
  fillHomePage(contactData);
  fillContactPage(contactData);
}

init();
