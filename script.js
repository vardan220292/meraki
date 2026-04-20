const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const inquiryBtn = document.getElementById("inquiryBtn");

document.getElementById("year").textContent = new Date().getFullYear();

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

inquiryBtn.addEventListener("click", () => {
  const message = encodeURIComponent(
    "Hi Meraki Concepts & Decor, I would like to inquire about your wedding/event planning services."
  );
  window.open(`https://wa.me/919930807711?text=${message}`, "_blank");
});
