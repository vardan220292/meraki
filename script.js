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

function fillGlobalElements(contactData) {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const businessName = contactData.businessName || "Meraki Events n Decor";
  const nodes = [
    document.getElementById("brandText") || document.getElementById("brandName"),
    document.getElementById("footerBusiness"),
    document.getElementById("contactBrandText") || document.getElementById("contactBrand"),
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
    callBtn.textContent = `Call ${contactData.phone}`;
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

function fillContactPage(contactData) {
  const contactList = document.getElementById("forumContactList");
  if (!contactList) return;

  contactList.innerHTML = `
    <li><strong>Phone:</strong> <a href="tel:${(contactData.phone || "").replace(/\s+/g, "")}">${contactData.phone || "-"}</a></li>
    <li><strong>Email:</strong> <a href="mailto:${contactData.email || ""}">${contactData.email || "-"}</a></li>
    <li><strong>Address:</strong> ${contactData.address || "-"}</li>
    <li><strong>Facebook:</strong> <a href="${contactData.facebook || "#"}" target="_blank" rel="noopener noreferrer">Open Page</a></li>
  `;
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
