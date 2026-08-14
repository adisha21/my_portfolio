/* =========================================================
   App — boot loader. Loads every data file independently so a
   single broken file can never take down the whole page.
     - File missing / malformed  -> friendly fallback message.
     - Valid but empty section   -> section (and nav link) hidden.
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});
  const { $, $$, escapeHtml: esc } = Portfolio.core;

  const FILES = [
    'profile.json',
    'skills.json',
    'education.json',
    'certifications.json',
    'experience.json',
    'projects.json',
    'contact.json'
  ];

  // Each entry maps a data file to a section shell.
  const ENTRIES = [
    { id: 'home', file: 'profile.json', renderer: 'profile', containers: ['#hero-content'] },
    { id: 'about', file: 'profile.json', renderer: 'about', containers: ['#about-content'] },
    { id: 'skills', file: 'skills.json', renderer: 'skills', containers: ['#skills-content'] },
    { id: 'education', file: 'education.json', renderer: 'education', containers: ['#education-content'] },
    { id: 'certifications', file: 'certifications.json', renderer: 'certifications', containers: ['#certifications-content'] },
    { id: 'experience', file: 'experience.json', renderer: 'experience', containers: ['#experience-content'] },
    { id: 'projects', file: 'projects.json', renderer: 'projects', containers: ['#projects-content'] },
    { id: 'contact', file: 'contact.json', renderer: 'contact', containers: ['#contact-info'] }
  ];

  function showFallback(targetSelector, message) {
    const target = $(targetSelector);
    if (!target) return;
    target.innerHTML = `
      <div class="data-fallback" role="status">
        <p class="data-fallback-title">This section could not be loaded.</p>
        <p class="data-fallback-message">${esc(message)}</p>
      </div>`;
  }

  /** Remove an empty section and its navigation link. */
  function hideSection(id) {
    const section = document.getElementById(id);
    if (section) section.remove();
    const link = $(`.nav-link[href="#${id}"]`);
    if (link) link.parentElement.remove();
  }

  async function loadData() {
    const dataMap = {};
    await Promise.all(
      FILES.map(async (file) => {
        try {
          dataMap[file] = await Portfolio.api.loadJSON(file);
        } catch (error) {
          dataMap[file] = { error: error.message };
        }
      })
    );
    return dataMap;
  }

  function renderSections(dataMap) {
    ENTRIES.forEach((entry) => {
      const data = dataMap[entry.file];

      // File missing or malformed -> fallback message, keep section.
      if (data && data.error) {
        entry.containers.forEach((selector) => showFallback(selector, data.error));
        return;
      }

      // Valid data but nothing to show -> hide section + nav link.
      let rendered;
      try {
        rendered = Portfolio.renderers[entry.renderer](data);
      } catch (error) {
        // A malformed data shape must never break the rest of the page.
        console.error(`[portfolio] Failed to render section "${entry.id}".`, error);
        entry.containers.forEach((selector) =>
          showFallback(selector, `The data for this section is invalid or incomplete. Please fix the data file.`));
        return;
      }
      if (!rendered) hideSection(entry.id);
    });
  }

  async function init() {
    Portfolio.theme.init();
    Portfolio.navigation.init();
    Portfolio.forms.init();
    Portfolio.renderers.footer();

    const dataMap = await loadData();
    renderSections(dataMap);

    // Observe all dynamically rendered content.
    Portfolio.reveal.init();
  }

  Portfolio.app = { init };

  // Scripts are loaded at the end of <body>; the DOM is ready.
  Portfolio.app.init();
})(window);
