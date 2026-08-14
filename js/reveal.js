/* =========================================================
   Reveal — scroll-triggered fade/slide animations.
   init() is idempotent, so it can be called again after
   sections are rendered dynamically.
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});

  const observed = new WeakSet();
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  function init() {
    Portfolio.core.$$('.reveal:not(.is-visible)').forEach((el) => {
      if (observed.has(el)) return;
      observed.add(el);
      observer.observe(el);
    });
  }

  Portfolio.reveal = { init };
})(window);
