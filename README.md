# my_portfolio

Live site: https://aditi-sharma21.netlify.app/

## Overview

A modern, professional, fully responsive portfolio website for **Aditi Sharma**. The site showcases her background, skills, projects, education, and experience, and provides a way for visitors to get in touch.

The application is **data-driven**: every piece of portfolio content lives in structured JSON files under `data/`, and all sections are rendered at runtime by modular JavaScript. No content is hardcoded in the HTML.

## Features

- **Fully responsive** — adapts cleanly to mobile, tablet, and desktop (breakpoints at 900px, 768px, 480px).
- **Dark / light mode toggle** — persists the user's preference in `localStorage` and respects the system `prefers-color-scheme` setting on first visit.
- **Sticky navigation bar** — smooth-scroll section links with a scroll-spy that highlights the active section, a mobile hamburger drawer, and a back-to-top button.
- **Scroll animations** — content fades/slides in as it enters the viewport via `IntersectionObserver`, with staggered project and skill cards.
- **Visual skill indicators** — animated progress bars that fill as the Skills section scrolls into view.
- **Advanced project filtering** — multi-select technology filters (click multiple chips), live search as you type, sorting (default / newest-first / alphabetical), and URL persistence (filters and search are preserved in the URL and restored on page refresh).
- **Contact form with client-side validation** — inline error messages, live validation on blur, and success/error status feedback.
- **Robust error handling** — a missing or malformed data file shows a friendly fallback message in only that section; the rest of the page keeps working. Optional sections with empty data (e.g. no certifications yet) are hidden cleanly along with their nav links.
- **Accessibility** — semantic HTML5 landmarks, a skip-to-content link, ARIA labels/roles, keyboard-navigable menu, visible focus states, and `prefers-reduced-motion` support.
- **Maintainable modules** — a single global `Portfolio` namespace with focused modules, HTML-escaped template rendering, and no build step or runtime dependencies.

## Architecture

```
index.html           Page shell (static chrome + empty section containers)
style.css            Styling (design tokens, themes, responsive, animations)
data/
  profile.json       Name, hero, resume link, about paragraphs, site metadata
  skills.json        Skill groups and proficiency levels
  education.json     Education entries
  certifications.json  Certification entries
  experience.json    Work experience entries
  projects.json      Project entries (used for filter/search/sort)
  contact.json       Contact links and coding profiles
  data.js            Embedded mirror of the JSON (file:// fallback only)
js/
  core.js            DOM helpers + HTML escaping
  api.js             JSON loading with robust error handling
  theme.js           Dark/light theme toggle + persistence
  navigation.js      Mobile menu, scroll-spy, back-to-top
  reveal.js          Scroll-triggered reveal animations
  forms.js           Contact form validation
  projects.js        Project filtering / search / sorting + rendering
  renderers.js       One render function per section
  app.js             Boot: loads all data and renders sections
avatar-2.png         Profile photo
aditisharmaa.pdf     Resume (linked from the Hero section)
```

### How it works

1. `app.js` loads every JSON file independently (each file failing only affects its own section).
2. Each section's renderer in `renderers.js` (and `projects.js`) builds the HTML from the JSON and injects it into an empty container in `index.html`.
3. `api.js` treats fetch/network failures, HTTP errors (missing files), and malformed JSON as distinct cases:
   - **Network failure** (e.g. opening `index.html` via `file://`) — falls back to the embedded copy in `data/data.js` so the site still works offline.
   - **Missing file / HTTP error** — the section shows a "could not be loaded" fallback card.
   - **Malformed JSON** — the section shows a fallback card pointing to the broken file (no silent fallback, so the problem is visible).
4. Sections whose data is valid but empty are removed along with their navigation links.

### Adding or editing content

All content is plain JSON. Edit the matching file under `data/` and refresh — no code changes needed.

**Add a project** — add an object to `projects.json`:

```json
{
  "title": "My New Project",
  "icon": "🚀",
  "technologies": ["React", "Node.js"],
  "description": "Short description shown on the card.",
  "date": "2025-06-01"
}
```

- `icon` — any short text/emoji displayed in the card header.
- `technologies` — used for the multi-select filter chips, the tags on the card, and search. Users can select multiple technologies simultaneously to see projects matching any of them.
- `date` — used by the "Newest first" sort. Omit it and the project is treated as oldest.

**Project filtering** supports:
- **Multi-select technology filters** — click multiple technology chips to filter projects. A project is shown if it matches *any* of the selected technologies.
- **Live search** — filters as you type across title, description, and technologies.
- **Sorting** — default order, newest first (by date), or alphabetical (A-Z by title).
- **URL persistence** — selected filters, search query, and sort order are saved in the URL. Share the URL or refresh the page to restore the exact filter state.
- **Clear all button** — appears when filters are active, showing the count of selected technologies. Click to reset all filters at once.

**Add a skill** — add an item to any group in `skills.json`:

```json
{ "name": "TypeScript", "level": 65 }
```

`level` is a number from 0–100 used for both the bar width and the `aria-valuenow` label.

**Other sections** follow the same pattern: `education.json` items use `institution`, `degree`, `period`, and an optional `badge`; `experience.json` items use `company`, `role`, `period`, and `highlights` (array of bullet points); `certifications.json` items use `title` and an optional `issuer`; `contact.json` holds `email`, `phone`, `links`, and `codingProfiles`.

> **Keep `data/data.js` in sync** — it is only a fallback for the `file://` protocol, but if you add content to a JSON file, mirror the change there so offline previews stay up to date.

### Adding a whole new section

1. Add a container `<div id="my-section-content"></div>` and a heading inside a new `<section id="my-section">` in `index.html` (optionally add a nav link).
2. Create `data/my-section.json`.
3. Add a renderer function in `js/renderers.js` that writes into `#my-section-content` and returns `true` when content was rendered.
4. Register the file and section in `js/app.js` (`FILES` and `ENTRIES`).

## Running locally

Because the app fetches JSON at runtime, serve the folder over HTTP:

```bash
python3 -m http.server 8000
# or: npx serve .
```

Then open http://localhost:8000. Opening `index.html` directly via `file://` also works thanks to the embedded data mirror, but content updates require keeping `data/data.js` in sync.

## Development

- Theme colors are controlled by CSS custom properties in `:root` (light) and `[data-theme='dark']` (dark).
- Every JS file is a classic script that attaches to `window.Portfolio`, so no bundler is required.
- All user content is HTML-escaped before injection (`Portfolio.core.escapeHtml`).
- The site has no external assets or dependencies, so it works fully offline.
