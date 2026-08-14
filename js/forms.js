/* =========================================================
   Forms — client-side validation for the contact form.
   ========================================================= */
'use strict';

(function (global) {
  const Portfolio = (global.Portfolio = global.Portfolio || {});

  const validators = {
    name: (value) => value.trim().length >= 2 || 'Please enter your name (at least 2 characters).',
    email: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) || 'Please enter a valid email address.',
    message: (value) => value.trim().length >= 10 || 'Your message must be at least 10 characters.'
  };

  function validateField(field) {
    const errorEl = document.getElementById(`${field.id}-error`);
    const group = field.closest('.form-group');
    const error = validators[field.id](field.value);

    const valid = error === true;
    group.classList.toggle('invalid', !valid);
    if (errorEl) errorEl.textContent = valid ? '' : error;
    return valid;
  }

  function init() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const results = ['name', 'email', 'message'].map((id) =>
        validateField(document.getElementById(id))
      );
      const status = document.getElementById('form-status');
      if (!status) return;

      if (results.every(Boolean)) {
        form.reset();
        status.classList.remove('error');
        status.textContent = 'Thank you! Your message has been prepared. I will get back to you soon.';
        setTimeout(() => {
          status.textContent = '';
        }, 6000);
      } else {
        status.classList.add('error');
        status.textContent = 'Please fix the highlighted fields and try again.';
        const firstInvalid = document.querySelector('.form-group.invalid input, .form-group.invalid textarea');
        if (firstInvalid) firstInvalid.focus();
      }
    });

    ['name', 'email', 'message'].forEach((id) => {
      const field = document.getElementById(id);
      if (!field) return;
      field.addEventListener('blur', () => validateField(field));
    });
  }

  Portfolio.forms = { init };
})(window);
