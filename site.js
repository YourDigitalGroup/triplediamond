/* Triple Diamond — shared behavior: mobile nav, FAQ accordion,
   home hero slideshow, home review carousel. No dependencies. */
(function () {
  'use strict';

  /* ---------------------------------------------------- mobile nav ---- */
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      var open = mobileNav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        mobileNav.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ------------------------------------------------- FAQ accordion ---- */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest ? e.target.closest('.faq-q') : null;
    if (!btn) return;
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    var sign = btn.querySelector('.faq-sign');
    if (sign) sign.textContent = open ? '+' : '\u2212';
  });

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
  var cards = Array.prototype.slice.call(document.querySelectorAll('.review-card'));
  if (cards.length) {
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
    var prev = document.querySelector('.review-btn--prev');
    var next = document.querySelector('.review-btn--next');
    if (prev) prev.addEventListener('click', function () { start = (start - 1 + cards.length) % cards.length; render(); });
    if (next) next.addEventListener('click', function () { start = (start + 1) % cards.length; render(); });
    window.addEventListener('resize', render);
    render();
  }
})();
