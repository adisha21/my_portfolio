/* =========================================================
   Projects — render + filter (by technology) + live search
   + sort (default / newest-first / alphabetical).
   Supports multiple technology filters and URL persistence.
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});

  const state = {
    items: [],
    filterTech: new Set(),
    search: '',
    sort: 'default',
    initialized: false,
    viewMode: 'grid',
    currentProject: null
  };

  function technologies() {
    const set = new Set();
    state.items.forEach((project) => {
      Portfolio.core.array(project.technologies).forEach((tech) => set.add(tech));
    });
    return [...set].sort((a, b) => a.localeCompare(b));
  }

  function matchesSearch(project) {
    const term = state.search.trim().toLowerCase();
    if (!term) return true;
    const haystack = [
      project.title,
      project.description,
      ...Portfolio.core.array(project.technologies)
    ].join(' ').toLowerCase();
    return haystack.includes(term);
  }

  function filteredProjects() {
    const visible = state.items.filter((project) => {
      const techMatch =
        state.filterTech.size === 0 ||
        Portfolio.core.array(project.technologies).some((tech) => state.filterTech.has(tech));
      return techMatch && matchesSearch(project);
    });

    if (state.sort === 'newest') {
      return [...visible].sort((a, b) => {
        const da = new Date(a.date || 0).getTime();
        const db = new Date(b.date || 0).getTime();
        return db - da;
      });
    }
    if (state.sort === 'oldest') {
      return [...visible].sort((a, b) => {
        const da = new Date(a.date || 0).getTime();
        const db = new Date(b.date || 0).getTime();
        return da - db;
      });
    }
    if (state.sort === 'az') {
      return [...visible].sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
    }
    if (state.sort === 'za') {
      return [...visible].sort((a, b) => b.title.localeCompare(a.title, undefined, { sensitivity: 'base' }));
    }
    return visible;
  }

  function createSlug(title) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function getProjectById(id) {
    return state.items.find((p) => (p.id || createSlug(p.title)) === id);
  }

  function cardHTML(project, animate) {
    const esc = Portfolio.core.escapeHtml;
    const projectId = project.id || createSlug(project.title);
    const imageSrc = project.image || 'https://via.placeholder.com/800x450/00b894/ffffff?text=Project';
    
    return `
      <article class="project-card ${animate ? 'reveal' : 'is-visible'}">
        ${project.image ? `<img class="project-image lazy" data-src="${esc(imageSrc)}" alt="${esc(project.title)}" loading="lazy">` : ''}
        <div class="project-content">
          <div class="project-icon" aria-hidden="true">${esc(project.icon)}</div>
          <h3>${esc(project.title)}</h3>
          <p class="project-tags">${esc(Portfolio.core.array(project.technologies).join(' • '))}</p>
          <p>${esc(project.description)}</p>
          <a href="#project/${esc(projectId)}" class="btn btn-secondary btn-sm">View Details</a>
        </div>
      </article>`;
  }

  function updateURL(replace = true) {
    const params = new URLSearchParams();
    if (state.search) params.set('search', state.search);
    if (state.filterTech.size > 0) params.set('tech', [...state.filterTech].join(','));
    if (state.sort !== 'default') params.set('sort', state.sort);
    const query = params.toString();
    const url = query ? `${location.pathname}?${query}#projects` : `${location.pathname}#projects`;
    
    const method = replace ? 'replaceState' : 'pushState';
    history[method]({ filters: { search: state.search, tech: [...state.filterTech], sort: state.sort } }, '', url);
  }

  function loadFromURL() {
    const hash = location.hash;
    
    if (hash.startsWith('#project/')) {
      const projectId = hash.substring(9);
      state.viewMode = 'detail';
      state.currentProject = projectId;
      return;
    }
    
    state.viewMode = 'grid';
    state.currentProject = null;
    
    const params = new URLSearchParams(location.search);
    if (params.has('search')) state.search = params.get('search');
    if (params.has('tech')) {
      state.filterTech = new Set(params.get('tech').split(',').filter(Boolean));
    }
    if (params.has('sort') && ['default', 'newest', 'oldest', 'az', 'za'].includes(params.get('sort'))) {
      state.sort = params.get('sort');
    }
  }

  function lazyLoadImages() {
    const images = Portfolio.core.$$('img.lazy');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;
          
          img.src = src;
          img.classList.remove('lazy');
          img.classList.add('lazy-loading');
          
          img.onload = () => {
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-loaded');
          };
          
          img.onerror = () => {
            img.src = 'https://via.placeholder.com/800x450/cccccc/666666?text=Image+Not+Available';
            img.classList.remove('lazy-loading');
            img.classList.add('lazy-error');
          };
          
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach((img) => imageObserver.observe(img));
  }

  function renderGrid(animate, skipURL = false) {
    const grid = Portfolio.core.$('#projects-grid');
    if (!grid) return;
    const projects = filteredProjects();

    if (projects.length === 0) {
      const hasFilters = state.filterTech.size > 0 || state.search.trim();
      const message = hasFilters
        ? 'No projects match your filters. Try adjusting your search or selected technologies.'
        : 'No projects available.';
      grid.innerHTML = `<p class="projects-empty" role="status">${Portfolio.core.escapeHtml(message)}</p>`;
    } else {
      grid.innerHTML = projects.map((project) => cardHTML(project, animate)).join('');
      lazyLoadImages();
    }

    if (animate) Portfolio.reveal.init();
    if (!skipURL) updateURL();
  }

  function renderProjectDetail(projectId) {
    const project = getProjectById(projectId);
    const target = Portfolio.core.$('#projects-content');
    if (!target) return;

    if (!project) {
      target.innerHTML = `
        <div class="project-detail">
          <div class="project-detail-header">
            <a href="#projects" class="btn btn-secondary">← Back to Projects</a>
          </div>
          <div class="project-404">
            <h2>Project Not Found</h2>
            <p>The project you're looking for doesn't exist or has been removed.</p>
            <a href="#projects" class="btn btn-primary">Browse All Projects</a>
          </div>
        </div>`;
      return;
    }

    const esc = Portfolio.core.escapeHtml;
    const imageSrc = project.image || 'https://via.placeholder.com/800x450/00b894/ffffff?text=Project';
    
    target.innerHTML = `
      <div class="project-detail">
        <div class="project-detail-header">
          <a href="#projects" class="btn btn-secondary">← Back to Projects</a>
        </div>
        <article class="project-detail-content card">
          <img class="project-detail-image lazy" data-src="${esc(imageSrc)}" alt="${esc(project.title)}" loading="lazy">
          <div class="project-detail-body">
            <div class="project-icon-large" aria-hidden="true">${esc(project.icon)}</div>
            <h2>${esc(project.title)}</h2>
            <p class="project-tags">${esc(Portfolio.core.array(project.technologies).join(' • '))}</p>
            <p class="project-description">${esc(project.description)}</p>
            ${project.details ? `<div class="project-details-section"><h3>About This Project</h3><p>${esc(project.details)}</p></div>` : ''}
            ${project.date ? `<p class="project-date"><strong>Date:</strong> ${esc(new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' }))}</p>` : ''}
          </div>
        </article>
      </div>`;
    
    lazyLoadImages();
    state.viewMode = 'detail';
    state.currentProject = projectId;
  }

  function renderControls() {
    const container = Portfolio.core.$('#projects-controls');
    if (!container) return;

    const allTechs = technologies();
    const chips = allTechs.map((tech) => {
      const active = state.filterTech.has(tech) ? ' active' : '';
      return `<button type="button" class="chip${active}" data-tech="${Portfolio.core.escapeHtml(tech)}" aria-pressed="${state.filterTech.has(tech)}">${Portfolio.core.escapeHtml(tech)}</button>`;
    });

    const clearButton = state.filterTech.size > 0
      ? `<button type="button" class="chip chip-clear" id="clear-filters">Clear all (${state.filterTech.size})</button>`
      : '';

    container.innerHTML = `
      <div class="projects-toolbar">
        <input type="search" id="project-search" class="project-search"
               placeholder="Search projects..." aria-label="Search projects" autocomplete="off" value="${Portfolio.core.escapeHtml(state.search)}">
        <select id="project-sort" class="project-sort" aria-label="Sort projects">
          <option value="default" ${state.sort === 'default' ? 'selected' : ''}>Default order</option>
          <option value="newest" ${state.sort === 'newest' ? 'selected' : ''}>Newest first</option>
          <option value="oldest" ${state.sort === 'oldest' ? 'selected' : ''}>Oldest first</option>
          <option value="az" ${state.sort === 'az' ? 'selected' : ''}>Alphabetical (A-Z)</option>
          <option value="za" ${state.sort === 'za' ? 'selected' : ''}>Alphabetical (Z-A)</option>
        </select>
      </div>
      <div class="filter-chips" role="group" aria-label="Filter projects by technology">
        ${clearButton}
        ${chips.join('')}
      </div>`;

    // Live search
    const search = Portfolio.core.$('#project-search', container);
    search.addEventListener('input', (event) => {
      state.search = event.target.value;
      renderGrid(false, true);
      updateURL(false);
    });

    // Sort
    const sort = Portfolio.core.$('#project-sort', container);
    sort.addEventListener('change', (event) => {
      state.sort = event.target.value;
      renderGrid(false, true);
      updateURL(false);
    });

    // Technology chips (multi-select)
    container.addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;

      if (chip.id === 'clear-filters') {
        state.filterTech.clear();
        renderControls();
        renderGrid(false, true);
        updateURL(false);
        return;
      }

      const tech = chip.dataset.tech;
      if (!tech) return;

      if (state.filterTech.has(tech)) {
        state.filterTech.delete(tech);
      } else {
        state.filterTech.add(tech);
      }

      chip.classList.toggle('active');
      chip.setAttribute('aria-pressed', String(state.filterTech.has(tech)));

      // Update or remove clear button
      const chipsContainer = Portfolio.core.$('.filter-chips', container);
      const clearBtn = Portfolio.core.$('#clear-filters', chipsContainer);
      
      if (state.filterTech.size > 0) {
        if (clearBtn) {
          clearBtn.textContent = `Clear all (${state.filterTech.size})`;
        } else {
          const newClearBtn = document.createElement('button');
          newClearBtn.type = 'button';
          newClearBtn.className = 'chip chip-clear';
          newClearBtn.id = 'clear-filters';
          newClearBtn.textContent = `Clear all (${state.filterTech.size})`;
          chipsContainer.insertBefore(newClearBtn, chipsContainer.firstChild);
        }
      } else if (clearBtn) {
        clearBtn.remove();
      }

      renderGrid(false, true);
      updateURL(false);
    });
  }

  function handleHashChange() {
    if (!state.initialized) return;
    loadFromURL();
    renderView();
  }

  function handlePopState(event) {
    if (!state.initialized) return;
    
    if (event.state && event.state.filters) {
      state.search = event.state.filters.search || '';
      state.filterTech = new Set(event.state.filters.tech || []);
      state.sort = event.state.filters.sort || 'default';
    } else {
      loadFromURL();
    }
    
    renderView();
  }

  function renderView() {
    if (state.viewMode === 'detail' && state.currentProject) {
      renderProjectDetail(state.currentProject);
    } else {
      const target = Portfolio.core.$('#projects-content');
      if (!target) return;
      
      target.innerHTML = `
        <div id="projects-controls" class="projects-controls reveal"></div>
        <div id="projects-grid" class="projects-grid"></div>`;
      
      renderControls();
      renderGrid(false);
    }
  }

  /** Render the whole projects section from JSON data. */
  function render(data, animate) {
    state.items = Portfolio.core.array(data.items);
    state.filterTech = new Set();
    state.search = '';
    state.sort = 'default';

    loadFromURL();

    if (state.viewMode === 'detail' && state.currentProject) {
      renderProjectDetail(state.currentProject);
    } else {
      const target = Portfolio.core.$('#projects-content');
      if (!target) return;

      target.innerHTML = `
        <div id="projects-controls" class="projects-controls reveal"></div>
        <div id="projects-grid" class="projects-grid"></div>`;

      renderControls();
      renderGrid(animate === undefined ? true : animate);
    }
    
    if (!state.initialized) {
      window.addEventListener('popstate', handlePopState);
      window.addEventListener('hashchange', handleHashChange);
      state.initialized = true;
    }
  }

  Portfolio.projects = { render };
})(window);
