const CONTACT_DATA_PATH = "data/contact.json";
const MANUAL_GALLERY_PATH = "images/manual/manifest.json";

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
  const brandNode = document.getElementById("brandName");
  const footerNode = document.getElementById("footerBusiness");
  const contactBrand = document.getElementById("contactBrand");
  const contactFooterBusiness = document.getElementById("contactFooterBusiness");
  const aboutBusiness = document.getElementById("aboutBusiness");

  [brandNode, footerNode, contactBrand, contactFooterBusiness, aboutBusiness].forEach((node) => {
    if (node) node.textContent = businessName;
  });
}

function fillHomePage(contactData) {
  const heroTagline = document.getElementById("heroTagline");
  if (heroTagline && contactData.tagline) heroTagline.textContent = contactData.tagline;

  const callBtn = document.getElementById("callBtn");
  if (callBtn && contactData.phone) callBtn.href = `tel:${contactData.phone.replace(/\s+/g, "")}`;

  const quickDetails = document.getElementById("quickDetails");
  if (quickDetails) {
    quickDetails.innerHTML = `
      <li><strong>Owner:</strong> ${contactData.owner || "-"}</li>
      <li><strong>Category:</strong> ${contactData.category || "-"}</li>
      <li><strong>Address:</strong> ${contactData.address || "-"}</li>
      <li><strong>Phone:</strong> ${contactData.phone || "-"}</li>
      <li><strong>Email:</strong> ${contactData.email || "-"}</li>
    `;
  }

  const strip = document.getElementById("contactStrip");
  if (strip) {
    strip.innerHTML = `
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
        streetAddress: contactData.address,
        addressCountry: "IN"
      },
      sameAs: [contactData.facebook].filter(Boolean)
    };
    schemaNode.textContent = JSON.stringify(schema);
  }
}

function fillContactForum(contactData) {
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
  if (hint && contactData.whatsappTestNumber) {
    hint.innerHTML = `WhatsApp testing number is set to ${contactData.whatsappTestNumber}. You can change it in <code>data/contact.json</code>.`;
  }

  const form = document.getElementById("inquiryForm");
  const sendWhatsApp = document.getElementById("sendWhatsApp");
  const sendEmail = document.getElementById("sendEmail");

  if (!form || !sendWhatsApp || !sendEmail) return;

  const getMessage = () => {
    const formData = new FormData(form);
    const lines = [
      "Hello Meraki Concepts & Decor,",
      "I would like to inquire about event planning/decor.",
      "",
      `Name: ${formData.get("name") || ""}`,
      `Phone: ${formData.get("phone") || ""}`,
      `Event Type: ${formData.get("eventType") || ""}`,
      `Event Date: ${formData.get("eventDate") || ""}`,
      `Venue: ${formData.get("venue") || ""}`,
      `Message: ${formData.get("message") || ""}`
    ];
    return lines.join("\n");
  };

  sendWhatsApp.addEventListener("click", () => {
    const rawNumber = contactData.whatsappTestNumber || contactData.phone || "";
    const number = normalizePhoneForWhatsApp(rawNumber);
    const msg = encodeURIComponent(getMessage());
    window.open(`https://wa.me/${number}?text=${msg}`, "_blank");
  });

  sendEmail.addEventListener("click", () => {
    const subject = encodeURIComponent("Event Inquiry - Meraki Website Form");
    const body = encodeURIComponent(getMessage());
    window.location.href = `mailto:${contactData.email || "merakieventsndecor@gmail.com"}?subject=${subject}&body=${body}`;
  });
}

async function fillManualGallery() {
  const gallery = document.getElementById("manualGallery");
  if (!gallery) return;

  const data = await readJson(MANUAL_GALLERY_PATH);
  const images = data?.images || [];

  if (!images.length) {
    gallery.innerHTML = "<p>Add files to <code>images/manual/manifest.json</code> to show them here.</p>";
    return;
  }

  gallery.innerHTML = images
    .map((img) => `<img src="${img.src}" alt="${img.alt || "Meraki decor image"}" loading="lazy" />`)
    .join("");
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
  fillContactForum(contactData);
  await fillManualGallery();
}

init();
