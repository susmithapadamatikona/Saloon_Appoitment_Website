/* ==========================================================================
   validation.js — form validation + password tooling + input helpers
   Declarative: add data-validate to a <form>; rules via data-rules on fields.
   Rules: required | email | phone | min:N | max:N | match:#id | name
   ========================================================================== */
(function (global) {
  'use strict';

  var RE = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
    phone: /^[+]?[\d\s()-]{10,15}$/,
    name: /^[A-Za-z][A-Za-z\s.'-]{1,49}$/
  };

  function fieldWrap(input) { return input.closest('.field') || input.parentElement; }

  function setError(input, msg) {
    var w = fieldWrap(input);
    w.classList.add('is-invalid');
    w.classList.remove('is-valid');
    var err = w.querySelector('.field__error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field__error';
      w.appendChild(err);
    }
    err.innerHTML = Icon.get('alert-circle') + msg;
    input.setAttribute('aria-invalid', 'true');
  }

  function setValid(input) {
    var w = fieldWrap(input);
    w.classList.remove('is-invalid');
    if (input.value.trim()) w.classList.add('is-valid');
    input.removeAttribute('aria-invalid');
  }

  function label(input) {
    var w = fieldWrap(input);
    var l = w.querySelector('.field__label');
    return l ? l.textContent.replace('*', '').trim() : 'This field';
  }

  function checkField(input) {
    var rules = (input.dataset.rules || '').split('|').filter(Boolean);
    var v = input.value.trim();

    for (var i = 0; i < rules.length; i++) {
      var rule = rules[i];
      var arg = null;
      if (rule.indexOf(':') > -1) {
        var parts = rule.split(':');
        rule = parts[0];
        arg = parts[1];
      }
      switch (rule) {
        case 'required':
          if (input.type === 'checkbox') {
            if (!input.checked) { setError(input, 'Please tick this box to continue.'); return false; }
          } else if (!v) { setError(input, label(input) + ' is required.'); return false; }
          break;
        case 'email':
          if (v && !RE.email.test(v)) { setError(input, 'That doesn\'t look like a valid email address.'); return false; }
          break;
        case 'phone':
          if (v && !RE.phone.test(v)) { setError(input, 'Enter a valid phone number (10–15 digits).'); return false; }
          break;
        case 'name':
          if (v && !RE.name.test(v)) { setError(input, 'Use letters and spaces only (2–50 characters).'); return false; }
          break;
        case 'min':
          if (v && v.length < parseInt(arg, 10)) { setError(input, label(input) + ' must be at least ' + arg + ' characters.'); return false; }
          break;
        case 'max':
          if (v.length > parseInt(arg, 10)) { setError(input, label(input) + ' must be under ' + arg + ' characters.'); return false; }
          break;
        case 'match':
          var other = document.querySelector(arg);
          if (other && v !== other.value) { setError(input, 'Passwords don\'t match.'); return false; }
          break;
      }
    }
    setValid(input);
    return true;
  }

  function checkForm(form) {
    var ok = true;
    var first = null;
    form.querySelectorAll('[data-rules]').forEach(function (input) {
      if (!checkField(input)) {
        ok = false;
        if (!first) first = input;
      }
    });
    if (first) {
      first.focus();
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  /* live re-validation once a field has been touched */
  document.addEventListener('input', function (e) {
    var input = e.target;
    if (input.dataset && input.dataset.rules && fieldWrap(input).classList.contains('is-invalid')) {
      checkField(input);
    }
  });
  document.addEventListener('blur', function (e) {
    var input = e.target;
    if (input.dataset && input.dataset.rules && input.value.trim()) checkField(input);
  }, true);

  /* ----------------------------------------------------- password toggle */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-pw-toggle]');
    if (!btn) return;
    var input = document.querySelector(btn.dataset.pwToggle);
    if (!input) return;
    var show = input.type === 'password';
    input.type = show ? 'text' : 'password';
    btn.innerHTML = Icon.get(show ? 'eye-off' : 'eye');
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  });

  /* --------------------------------------------------- password strength */
  function scorePassword(v) {
    var score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v) && v.length >= 10) score++;
    return score;
  }
  var LEVELS = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong'];

  function bindStrengthMeter(input, meter) {
    var rules = document.querySelectorAll('[data-pw-rule]');
    input.addEventListener('input', function () {
      var v = input.value;
      var s = v ? scorePassword(v) : 0;
      meter.setAttribute('data-level', s);
      var lbl = meter.querySelector('.pw-strength__label');
      if (lbl) lbl.textContent = v ? 'Strength: ' + LEVELS[s] : 'Use 8+ characters with a mix of types';
      rules.forEach(function (r) {
        var kind = r.dataset.pwRule;
        var ok = false;
        if (kind === 'length') ok = v.length >= 8;
        if (kind === 'case') ok = /[A-Z]/.test(v) && /[a-z]/.test(v);
        if (kind === 'number') ok = /\d/.test(v);
        if (kind === 'symbol') ok = /[^A-Za-z0-9]/.test(v);
        r.classList.toggle('is-ok', ok);
        var ic = r.querySelector('i');
        if (ic) ic.innerHTML = Icon.get(ok ? 'check-circle' : 'x-circle');
      });
    });
  }

  /* --------------------------------------------------------- image preview */
  function bindImagePreview(fileInput, imgTarget) {
    fileInput.addEventListener('change', function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      if (!/^image\//.test(f.type)) {
        Toast.error('Please choose an image file (JPG, PNG or WebP).');
        return;
      }
      if (f.size > 4 * 1024 * 1024) {
        Toast.warning('Image is over 4 MB — pick something smaller.');
        return;
      }
      var reader = new FileReader();
      reader.onload = function () {
        if (imgTarget.tagName === 'IMG') imgTarget.src = reader.result;
        else imgTarget.innerHTML = '<img src="' + reader.result + '" alt="Profile preview">';
        Toast.success('Looking good! Photo preview updated.');
      };
      reader.readAsDataURL(f);
    });
  }

  /* auto-bind on load */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-pw-strength]').forEach(function (meter) {
      var input = document.querySelector(meter.dataset.pwStrength);
      if (input) bindStrengthMeter(input, meter);
    });
    document.querySelectorAll('[data-img-preview]').forEach(function (fi) {
      var target = document.querySelector(fi.dataset.imgPreview);
      if (target) bindImagePreview(fi, target);
    });
  });

  global.Validate = {
    form: checkForm,
    field: checkField,
    isEmail: function (v) { return RE.email.test(v); },
    isPhone: function (v) { return RE.phone.test(v); }
  };
})(window);
