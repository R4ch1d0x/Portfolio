/* theme.js — shared theme switch and back-to-top control. Load in <head> so theme applies before first paint. */
(function () {
  'use strict';
  var KEY = 'theme', root = document.documentElement;

  function read() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v) { try { localStorage.setItem(KEY, v); } catch (e) { } }

  var theme = read() === 'light' ? 'light' : 'dark';
  root.setAttribute('data-theme', theme);

  document.addEventListener('DOMContentLoaded', function () {
    var host = document.querySelector('nav .links') || document.querySelector('nav');
    if (host) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-btn';

      function paint() {
        var light = root.getAttribute('data-theme') === 'light';
        btn.textContent = light ? '☾' : '☀';
        btn.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
        btn.title = btn.getAttribute('aria-label');
      }
      btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
        root.setAttribute('data-theme', next);
        save(next);
        paint();
      });
      paint();
      host.appendChild(btn);
    }

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
