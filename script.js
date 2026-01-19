'use strict';

// Navigation & pages
const navLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const targetPage = link.dataset.navLink;

    // Update active nav item
    navLinks.forEach(nav => nav.classList.remove('active'));
    link.classList.add('active');

    // Switch pages with smooth fade
    pages.forEach(page => {
      if (page.dataset.page === targetPage) {
        page.style.display = 'block';
        setTimeout(() => {
          page.style.opacity = '1';
          page.style.transform = 'translateY(0)';
        }, 50);
      } else {
        page.style.opacity = '0';
        page.style.transform = 'translateY(20px)';
        setTimeout(() => {
          page.style.display = 'none';
        }, 300);
      }
    });
  });
});
