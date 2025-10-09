'use strict';

// Page Navigation
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const targetPage = link.getAttribute("data-nav-link");

    // Hide all pages smoothly
    pages.forEach(page => {
      page.style.opacity = "0";
      setTimeout(() => {
        page.style.display = page.getAttribute("data-page") === targetPage ? "block" : "none";
        if (page.style.display === "block") {
          setTimeout(() => (page.style.opacity = "1"), 50);
        }
      }, 200);
    });

    // Update active link styling
    navLinks.forEach(nav => nav.classList.remove("active"));
    link.classList.add("active");
  });
});
