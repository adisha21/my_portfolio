'use strict';

// Page Navigation
const navLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const targetPage = link.getAttribute("data-nav-link");

    // Show the selected page and hide others
    pages.forEach(page => {
      page.style.display = page.getAttribute("data-page") === targetPage ? "block" : "none";
    });

    // Update active link styling
    navLinks.forEach(nav => nav.classList.remove("active"));
    link.classList.add("active");
  });
});
