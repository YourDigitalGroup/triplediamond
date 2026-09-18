/* Triple Diamond — shared behavior: mobile nav, touch-friendly dropdown,
   FAQ accordion, Facebook panel fit-to-width, home review carousel.
   No dependencies. */
(function () {
  'use strict';

  /* ---------------------------------------------------- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  function setMobileNav(open) {
    mobileNav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    var icon = toggle.querySelector('span') || toggle;
    icon.textContent = open ? '✕' : '☰';
  }
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      setMobileNav(!mobileNav.classList.contains('is-open'));
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest && e.target.closest('a')) setMobileNav(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        setMobileNav(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1080 && mobileNav.classList.contains('is-open')) setMobileNav(false);
    });
  }

  /* --------------------------------- desktop dropdown (tap + keys) ---- */
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('.nav-dropdown'));
  function closeDropdown(dd) {
    dd.classList.remove('is-open');
    var b = dd.querySelector('.nav-dropdown-toggle');
    if (b) b.setAttribute('aria-expanded', 'false');
  }
  dropdowns.forEach(function (dd) {
    var btn = dd.querySelector('.nav-dropdown-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var open = dd.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    dd.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && dd.classList.contains('is-open')) {
        closeDropdown(dd);
        btn.focus();
      }
    });
    // Keyboard: close once focus has moved out of the menu entirely.
    dd.addEventListener('focusout', function (e) {
      if (!e.relatedTarget || !dd.contains(e.relatedTarget)) closeDropdown(dd);
    });
  });
  if (dropdowns.length) {
    document.addEventListener('click', function (e) {
      dropdowns.forEach(function (dd) {
        if (dd.classList.contains('is-open') && !dd.contains(e.target)) closeDropdown(dd);
      });
    });
  }

  /* ------------------------------------------------- FAQ accordion ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.faq-q') : null;
    if (!btn) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    var sign = btn.querySelector('.faq-sign');
    if (sign) sign.textContent = open ? '+' : '−';
  });

  /* ---------------------------------- Facebook panel: fit to width ---- */
  /* The Facebook page plugin renders at a fixed 340px. On narrow phones the
     panel is narrower than that, so scale the frame down to fit instead of
     letting it clip. Desktop is untouched (scale stays 1). */
  var fbBox = document.querySelector('.hero-fb-iframe-box');
  var fbFrame = fbBox ? fbBox.querySelector('iframe') : null;
  if (fbFrame) {
    var fbW = parseInt(fbFrame.getAttribute('width'), 10) || 340;
    var fbH = parseInt(fbFrame.getAttribute('height'), 10) || 400;
    var fitFb = function () {
      var avail = fbBox.clientWidth;
      if (!avail) return;
      var s = Math.min(1, avail / fbW);
      if (s < 1) {
        fbFrame.style.transformOrigin = 'top left';
        fbFrame.style.transform = 'scale(' + s.toFixed(4) + ')';
        fbBox.style.height = Math.round(fbH * s) + 'px';
        fbBox.style.justifyContent = 'flex-start';
      } else {
        fbFrame.style.transform = '';
        fbBox.style.height = '';
        fbBox.style.justifyContent = '';
      }
    };
    fitFb();
    window.addEventListener('resize', fitFb);
    window.addEventListener('orientationchange', fitFb);
  }

  /* --------------------------------------------- home hero slideshow -- */
  //var slides = document.querySelectorAll('.hero-slide');
  /*if (slides.length > 1) {
    var current = 0;
    setInterval(function () {
      slides[current].classList.remove('is-active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('is-active');
    }, 5000);
  }*/

  /* -------------------------------------------- home review carousel -- */
  /* Only paginates when prev/next controls exist; without them every review
     card stays visible (the grid stacks on phones). */
  var prev = document.querySelector('.review-btn--prev');
  var next = document.querySelector('.review-btn--next');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.review-card'));
  if (cards.length && (prev || next)) {
    var start = 0;
    function visibleCount() {
      var w = window.innerWidth;
      return w < 760 ? 1 : w < 1080 ? 2 : 3;
    }
    function render() {
      var n = Math.min(visibleCount(), cards.length);
      var show = [];
      for (var i = 0; i < n; i++) show.push((start + i) % cards.length);
      cards.forEach(function (card, i) {
        var idx = show.indexOf(i);
        card.hidden = idx === -1;
        card.style.order = idx === -1 ? '' : String(idx);
      });
    }
    if (prev) prev.addEventListener('click', function () { start = (start - 1 + cards.length) % cards.length; render(); });
    if (next) next.addEventListener('click', function () { start = (start + 1) % cards.length; render(); });
    window.addEventListener('resize', render);
    render();
  }
})();
