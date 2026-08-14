/* =========================================================
   Navigation — mobile menu, scroll-spy, back to top.
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});

  function initMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!menuToggle || !navLinks) return;

    function setMenu(open) {
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      navLinks.classList.toggle('open', open);
    }

    menuToggle.addEventListener('click', () => {
      setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    navLinks.addEventListener('click', (event) => {
      if (event.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        menuToggle.focus();
      }
    });
  }

  function initScrollSpy() {
    const sections = Portfolio.core.$$('section[id]');
    const links = Portfolio.core.$$('.nav-link');
    if (!sections.length || !links.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${entry.target.id}`;
            if (isActive) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  }

  function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
      const show = window.scrollY > 480;
      backToTop.classList.toggle('visible', show);
      backToTop.setAttribute('aria-hidden', String(!show));
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function init() {
    initMenu();
    initScrollSpy();
    initBackToTop();
  }

  Portfolio.navigation = { init };
})(window);
