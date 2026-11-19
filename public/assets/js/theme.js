/* theme.js — shared back-to-top control. */
(function () {
  'use strict';
  try { localStorage.removeItem('theme'); } catch (e) {}

  document.addEventListener('DOMContentLoaded', function () {
    var backToTop = document.createElement('button');
    backToTop.type = 'button';
    backToTop.className = 'back-to-top';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.title = 'Back to top';
    backToTop.textContent = '↑';
    backToTop.hidden = true;
    backToTop.addEventListener('click', function () {
      var behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
      window.scrollTo({ top: 0, behavior: behavior });
    });
    document.body.appendChild(backToTop);

    var updateBackToTop = function () { backToTop.hidden = window.scrollY < 320; };
    window.addEventListener('scroll', updateBackToTop, { passive: true });
    updateBackToTop();
  });
})();
