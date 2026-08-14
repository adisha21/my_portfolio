/* =========================================================
   Data API — loads JSON with robust error handling.
   - Network / fetch failure  -> uses embedded data mirror if
     available (file:// protocol), otherwise throws a message.
   - HTTP error (missing file) -> throws a message.
   - Malformed JSON            -> throws a message (never falls
     back silently, so problems surface in the UI).
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});

  const DATA_DIR = 'data';

  function embeddedData(path) {
    return global.PortfolioData && global.PortfolioData[path];
  }

  async function loadJSON(file) {
    const path = `${DATA_DIR}/${file}`;

    let response;
    try {
      response = await fetch(path);
    } catch (error) {
      // Network failure (e.g. file:// protocol) -> embedded mirror.
      const embedded = embeddedData(path);
      if (embedded !== undefined) {
        console.warn(`[portfolio] Could not fetch ${path}, using embedded data.`, error);
        return embedded;
      }
      throw new Error(`Could not load "${path}". ${error.message}`);
    }

    // HTTP error (missing / unavailable file) -> surfacing fallback message.
    if (!response.ok) {
      throw new Error(`Could not load "${path}". HTTP ${response.status}.`);
    }

    let text;
    try {
      text = await response.text();
    } catch (error) {
      throw new Error(`Could not read "${path}". ${error.message}`);
    }

    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`"${path}" is not valid JSON. Please fix or replace the file.`);
    }
  }

  Portfolio.api = { loadJSON };
})(window);
