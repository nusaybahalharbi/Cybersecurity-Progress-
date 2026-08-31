/* =========================================================
   Muhlah · Cybersecurity Transformation
   Presentation engine — navigation, scaling, full screen, print
   No external dependencies.
   ========================================================= */
(function () {
  'use strict';

  var BASE_W = 1920;
  var BASE_H = 1080;

  var deck = document.getElementById('deck');
  var stage = document.getElementById('stage');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var counter = document.getElementById('counter');
  var progress = document.getElementById('progress');
  var hint = document.getElementById('hint');
  var btnPrev = document.getElementById('prev');
  var btnNext = document.getElementById('next');
  var btnFs = document.getElementById('fs');
  var btnPrint = document.getElementById('printBtn');

  var total = slides.length;
  var index = 0;

  /* ---------- Slide numbers stamped onto each slide ---------- */
  slides.forEach(function (s, i) {
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('role', 'group');
    s.setAttribute('aria-label', 'Slide ' + (i + 1) + ' of ' + total + ': ' + (s.dataset.title || ''));
    var n = document.createElement('div');
    n.className = 'slide-no';
    n.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
    s.appendChild(n);
  });

  /* ---------- Scale the fixed 16:9 canvas to fit any viewport ---------- */
  function fit() {
    var pad = window.innerWidth < 900 ? 8 : 28;
    var availW = window.innerWidth - pad * 2;
    var availH = window.innerHeight - (window.innerWidth < 900 ? 96 : 92);
    var scale = Math.min(availW / BASE_W, availH / BASE_H);
    if (!isFinite(scale) || scale <= 0) scale = 1;
    deck.style.transform = 'scale(' + scale + ')';
  }

  /* ---------- Navigation ---------- */
  function show(i, dir) {
    i = Math.max(0, Math.min(total - 1, i));
    slides.forEach(function (s, k) {
      s.classList.remove('is-active', 'is-prev');
      s.setAttribute('aria-hidden', 'true');
      if (k < i) s.classList.add('is-prev');
    });
    var cur = slides[i];
    cur.classList.remove('is-prev');
    cur.classList.add('is-active');
    cur.setAttribute('aria-hidden', 'false');

    index = i;
    counter.innerHTML = '<b>' + (i + 1) + '</b> / ' + total;
    progress.style.width = ((i + 1) / total * 100) + '%';
    btnPrev.disabled = i === 0;
    btnNext.disabled = i === total - 1;

    if (history.replaceState) history.replaceState(null, '', '#' + (i + 1));
  }

  function next() { if (index < total - 1) show(index + 1); }
  function prev() { if (index > 0) show(index - 1); }

  /* ---------- Full screen ---------- */
  function toggleFullscreen() {
    var el = document.documentElement;
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      var req = el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen;
      if (req) req.call(el);
    } else {
      var exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
      if (exit) exit.call(document);
    }
  }

  /* ---------- Events ---------- */
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  btnFs.addEventListener('click', toggleFullscreen);
  btnPrint.addEventListener('click', function () { window.print(); });

  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
      case ' ':
      case 'Enter':
        e.preventDefault(); next(); break;
      case 'ArrowLeft':
      case 'PageUp':
      case 'Backspace':
        e.preventDefault(); prev(); break;
      case 'Home':
        e.preventDefault(); show(0); break;
      case 'End':
        e.preventDefault(); show(total - 1); break;
      case 'f':
      case 'F':
        e.preventDefault(); toggleFullscreen(); break;
      case 'p':
      case 'P':
        e.preventDefault(); window.print(); break;
      default: break;
    }
  });

  /* Touch / swipe for tablets */
  var tx = null, ty = null;
  document.addEventListener('touchstart', function (e) {
    tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) { dx < 0 ? next() : prev(); }
    tx = ty = null;
  }, { passive: true });

  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);
  document.addEventListener('fullscreenchange', fit);
  document.addEventListener('webkitfullscreenchange', fit);

  /* Make sure animated widths are settled before the browser paints for print */
  window.addEventListener('beforeprint', function () {
    slides.forEach(function (s) { s.classList.add('is-active'); });
  });
  window.addEventListener('afterprint', function () { show(index); });

  /* ---------- Boot ---------- */
  fit();
  var start = parseInt((location.hash || '').replace('#', ''), 10);
  show(isFinite(start) && start >= 1 && start <= total ? start - 1 : 0);

  setTimeout(function () { if (hint) hint.classList.add('hide'); }, 4500);
})();
