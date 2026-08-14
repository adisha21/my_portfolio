/* =========================================================
   Core helpers & shared namespace.
   Every module attaches itself to window.Portfolio so the
   classic script tags load cleanly in any order.
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});

  Portfolio.core = {
    /** Query a single element. */
    $(selector, context) {
      return (context || document).querySelector(selector);
    },

    /** Query a list of elements as an array. */
    $$(selector, context) {
      return [...(context || document).querySelectorAll(selector)];
    },

    /** Escape a value for safe insertion into HTML. */
    escapeHtml(value) {
      return String(value == null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    },

    /** Normalize an array value, falling back to []. */
    array(value) {
      return Array.isArray(value) ? value : [];
    },

    /** True when a value is an object with no meaningful data. */
    isEmpty(value) {
      if (value == null) return true;
      if (Array.isArray(value)) return value.length === 0;
      if (typeof value === 'object') return Object.keys(value).length === 0;
      return String(value).trim() === '';
    }
  };
})(window);
