/* ==========================================================================
   Inari Build Trading, Inc. — script.js
   Vanilla JS only. Small, dependency-free modules:
   stickyNav · mobileMenu · activeNav · scrollReveal · counters · quoteForm
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Sticky navigation ---------------------------------------- */
  function stickyNav() {
    var nav = $('#nav');
    if (!nav) return;
    var ticking = false;

    function update() {
      nav.classList.toggle('is-stuck', window.scrollY > 24);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- 2. Mobile menu ---------------------------------------------- */
  function mobileMenu() {
    var burger = $('#burger');
    var links  = $('#navLinks');
    if (!burger || !links) return;

    function setOpen(open) {
      links.classList.toggle('is-open', open);
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
    }

    burger.addEventListener('click', function () {
      setOpen(!links.classList.contains('is-open'));
    });

    links.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        setOpen(false);
        burger.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980) setOpen(false);
    });
  }

  /* ---------- 3. Active navigation state ---------------------------------- */
  function activeNav() {
    var links = $$('.nav__link');
    if (!links.length) return;

    var targets = links
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? { link: link, el: $(id) } : null;
      })
      .filter(function (t) { return t && t.el; });

    if (!targets.length) return;
    var ticking = false;

    function update() {
      var offset = window.scrollY + (window.innerHeight * 0.28);
      var current = targets[0];

      targets.forEach(function (t) {
        if (t.el.offsetTop <= offset) current = t;
      });

      // Bottom of page always highlights the last linked section.
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 4) {
        current = targets[targets.length - 1];
      }

      targets.forEach(function (t) {
        t.link.classList.toggle('is-active', t === current);
      });
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  /* ---------- 4. Scroll reveal -------------------------------------------- */
  function scrollReveal() {
    var items = $$('[data-reveal]');
    if (!items.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 5. Statistic counters --------------------------------------- */
  function counters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target   = parseFloat(el.getAttribute('data-count'));
      var decimals = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      var start    = null;
      var duration = 1400;

      function frame(now) {
        if (start === null) start = now;
        var p = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = (target * eased).toFixed(decimals);
        if (p < 1) window.requestAnimationFrame(frame);
        else el.textContent = target.toFixed(decimals);
      }
      el.textContent = (0).toFixed(decimals);
      window.requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { run(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });

    nums.forEach(function (el) { io.observe(el); });
  }

  /* ---------- 6. Quote form validation ------------------------------------ */
  function quoteForm() {
    var form    = $('#quoteForm');
    var success = $('#formSuccess');
    if (!form || !success) return;

    var rules = {
      fullName: function (v) {
        if (!v.trim()) return 'Please enter your full name.';
        if (v.trim().length < 2) return 'Please enter at least 2 characters.';
        return '';
      },
      phone: function (v) {
        if (!v.trim()) return 'Please enter a contact number.';
        if (v.replace(/\D/g, '').length < 7) return 'Please enter a valid phone number.';
        return '';
      },
      service: function (v) {
        return v ? '' : 'Please select the service you need.';
      },
      details: function (v) {
        if (!v.trim()) return 'Please describe your project.';
        if (v.trim().length < 10) return 'Please add a little more detail (10+ characters).';
        return '';
      }
    };

    function fieldOf(input) { return input.closest('.field'); }

    function showError(input, message) {
      var field = fieldOf(input);
      var slot  = field ? field.querySelector('[data-error-for="' + input.id + '"]') : null;
      if (field) field.classList.toggle('has-error', !!message);
      if (slot) slot.textContent = message;
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validate(input) {
      var rule = rules[input.name];
      if (!rule) return true;
      var message = rule(input.value);
      showError(input, message);
      return !message;
    }

    Object.keys(rules).forEach(function (name) {
      var input = form.elements[name];
      if (!input) return;
      input.addEventListener('blur', function () { validate(input); });
      input.addEventListener('input', function () {
        if (fieldOf(input) && fieldOf(input).classList.contains('has-error')) validate(input);
      });
      input.addEventListener('change', function () { validate(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstInvalid = null;

      Object.keys(rules).forEach(function (name) {
        var input = form.elements[name];
        if (!input) return;
        if (!validate(input) && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        firstInvalid.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
        return;
      }

      var name    = form.elements.fullName.value.trim().split(/\s+/)[0];
      var service = form.elements.service.value;
      var msg     = $('#successMsg');
      if (msg) {
        msg.textContent = 'Thank you, ' + name + '. We’ve noted your ' +
          service.toLowerCase() + ' enquiry and will be in touch on the number you provided.';
      }

      form.hidden = true;
      success.hidden = false;
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    });

    var reset = $('#resetForm');
    if (reset) {
      reset.addEventListener('click', function () {
        form.reset();
        $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
        $$('.field__error', form).forEach(function (s) { s.textContent = ''; });
        success.hidden = true;
        form.hidden = false;
        form.elements.fullName.focus();
      });
    }
  }

  /* ---------- init --------------------------------------------------------- */
  function init() {
    stickyNav();
    mobileMenu();
    activeNav();
    scrollReveal();
    counters();
    quoteForm();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
