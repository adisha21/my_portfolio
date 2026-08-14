/* =========================================================
   Renderers — one function per section. Each receives the
   JSON data and returns true when content was rendered, or
   false when there was nothing to render (the caller then
   hides the section).
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});
  const { $, $$, escapeHtml: esc, array } = Portfolio.core;

  /* ---------------- Profile (hero + site chrome) ---------------- */
  function profile(data) {
    if (Portfolio.core.isEmpty(data) || !data.name) return false;

    // Document metadata
    if (data.meta) {
      document.title = data.meta.title || document.title;
      const meta = $('meta[name="description"]');
      if (meta && data.meta.description) meta.setAttribute('content', data.meta.description);
    }

    // Navbar brand + footer name
    const brandName = $('#brand-name');
    if (brandName) brandName.textContent = data.name;
    const footerName = $('#footer-name');
    if (footerName) footerName.textContent = data.name;

    // Hero
    const heroTarget = $('#hero-content');
    if (heroTarget) {
      heroTarget.innerHTML = `
        <div class="hero-inner reveal">
          <figure class="hero-avatar">
            <img src="${esc(data.avatar)}" alt="${esc(data.avatarAlt)}" width="160" height="160">
          </figure>
          <p class="hero-greeting">${esc(data.greeting)}</p>
          <h1 class="hero-name">${esc(data.name)}</h1>
          <p class="hero-title">${esc(data.role)}</p>
          <p class="hero-text">${esc(data.tagline)}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${esc(data.resume.file)}" target="_blank" rel="noopener">${esc(data.resume.label)}</a>
            <a class="btn btn-secondary" href="#contact">Get in Touch</a>
          </div>
        </div>`;
    }

    return true;
  }

  /* ---------------- About ---------------- */
  function about(data) {
    const paragraphs = array(data && data.about && data.about.paragraphs);
    if (!paragraphs.length) return false;

    const target = $('#about-content');
    if (!target) return true;

    target.innerHTML = `
      <article class="card about-card reveal">
        ${paragraphs.map((p) => `<p>${esc(p)}</p>`).join('')}
      </article>`;

    return true;
  }

  /* ---------------- Skills ---------------- */
  function skills(data) {
    const groups = array(data.groups).filter((g) => array(g.items).length);
    if (!groups.length) return false;

    const target = $('#skills-content');
    if (!target) return true;

    target.innerHTML = `
      <div class="skills-grid">
        ${groups.map((group) => `
          <article class="card skill-card reveal">
            <h3>${esc(group.title)}</h3>
            ${array(group.items).map((item) => `
              <div class="skill">
                <div class="skill-meta"><span>${esc(item.name)}</span><span class="skill-value">${esc(item.level)}%</span></div>
                <div class="skill-bar" role="progressbar" aria-valuenow="${Number(item.level)}" aria-valuemin="0" aria-valuemax="100" aria-label="${esc(item.name)} proficiency">
                  <span class="skill-fill" style="--level: ${Number(item.level)}%"></span>
                </div>
              </div>`).join('')}
          </article>`).join('')}
      </div>`;

    return true;
  }

  /* ---------------- Education ---------------- */
  function education(data) {
    const items = array(data.items);
    if (!items.length) return false;

    const target = $('#education-content');
    if (!target) return true;

    target.innerHTML = items.map((item) => `
      <article class="card edu-card reveal">
        <h3>${esc(item.institution)}</h3>
        <p class="edu-meta">${esc(item.degree)}</p>
        <p class="edu-period">${esc(item.period)}${item.badge ? `<span class="edu-cgpa">${esc(item.badge)}</span>` : ''}</p>
      </article>`).join('');

    return true;
  }

 /* ---------------- Certifications ---------------- */
function certifications(data) {
  const items = array(data.items);
  if (!items.length) return false;

  const target = $('#certifications-content');
  if (!target) return true;

  target.innerHTML = `
    <div class="cert-list">
      ${items.map((item) => `
        <article class="cert-item reveal">
          <span class="cert-badge" aria-hidden="true">&#10003;</span>
          <div class="cert-content">
            <p>${esc(item.title)}${item.issuer ? ` – ${esc(item.issuer)}` : ''}</p>
            ${item.period ? `<small>${esc(item.period)}</small>` : ''}
            ${item.certificate ? `
              <a
                class="btn btn-secondary cert-button"
                href="${esc(item.certificate)}"
                target="_blank"
                rel="noopener noreferrer">
                View Certificate
              </a>
            ` : ''}
          </div>
        </article>`).join('')}
    </div>`;

  return true;
}
  /* ---------------- Experience ---------------- */
  function experience(data) {
    const items = array(data.items);
    if (!items.length) return false;

    const target = $('#experience-content');
    if (!target) return true;

    target.innerHTML = items.map((item) => `
      <article class="card exp-card reveal">
        <h3>${esc(item.company)}</h3>
        <p class="exp-role">${esc(item.role)}</p>
        <p class="exp-period">${esc(item.period)}</p>
        <ul class="exp-list">
          ${array(item.highlights).map((highlight) => `<li>${esc(highlight)}</li>`).join('')}
        </ul>
      </article>`).join('');

    return true;
  }

  /* ---------------- Projects ---------------- */
  function projects(data) {
    const items = array(data.items);
    if (!items.length) return false;
    Portfolio.projects.render(data, true);
    return true;
  }

  /* ---------------- Contact ---------------- */
  function contact(data) {
    const target = $('#contact-info');
    if (!target || data == null || typeof data !== 'object') return false;

    const hasAny =
      data.email || data.phone || array(data.links).length ||
      (data.codingProfiles && array(data.codingProfiles.items).length);
    if (!hasAny) return false;

    const contactLink = (item) => `
      <li>
        <a class="contact-link" href="${esc(item.href)}"${item.external ? ' target="_blank" rel="noopener"' : ''}>
          <span class="contact-icon" aria-hidden="true">${esc(item.icon)}</span>
          <span>${esc(item.label)}</span>
        </a>
      </li>`;

    const codingProfiles = data.codingProfiles && array(data.codingProfiles.items).length
      ? `
        <h3 class="coding-profiles-title">${esc(data.codingProfiles.title || 'Coding Profiles')}</h3>
        <ul class="coding-profiles">
          ${array(data.codingProfiles.items).map((item) => `
            <li><a href="${esc(item.href)}" target="_blank" rel="noopener">${esc(item.label)}</a></li>`).join('')}
        </ul>`
      : '';

    target.innerHTML = `
      ${data.intro ? `<p class="contact-intro">${esc(data.intro)}</p>` : ''}
      <ul class="contact-list">
        ${data.email ? contactLink({ ...data.email, label: data.email.label }) : ''}
        ${data.phone ? contactLink({ ...data.phone, label: data.phone.label }) : ''}
        ${array(data.links).map(contactLink).join('')}
      </ul>
      ${codingProfiles}`;

    return true;
  }

  /* ---------------- Footer ---------------- */
  function footer(data) {
    const year = $('#footer-year');
    if (year) year.textContent = new Date().getFullYear();
    return true;
  }

  Portfolio.renderers = { profile, about, skills, education, certifications, experience, projects, contact, footer };
})(window);
