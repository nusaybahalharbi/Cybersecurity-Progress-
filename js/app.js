/* ==========================================================================
   Muhlah · Cybersecurity Transformation — Executive Progress Report
   Plain JavaScript. No dependencies, no build step.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  var sections = $$('main .section');
  var sectionIds = sections.map(function (s) { return s.id; });
  var navLinks = $$('#nav a');
  var header = $('#header');

  /* ======================================================================
     Toast
     ====================================================================== */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  /* ======================================================================
     Scroll progress bar
     ====================================================================== */
  var bar = $('#scrollbar');
  function updateScrollbar() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? (window.scrollY / h) * 100 : 0;
    bar.style.width = Math.min(100, Math.max(0, p)) + '%';
  }

  /* ======================================================================
     Section dots
     ====================================================================== */
  var dotsWrap = $('#dots');
  sections.forEach(function (sec) {
    var label = sec.getAttribute('aria-labelledby');
    var name = label && $('#' + label) ? $('#' + label).textContent.trim() : sec.id;
    var b = document.createElement('button');
    b.type = 'button';
    b.dataset.target = sec.id;
    b.title = name;
    b.setAttribute('aria-label', 'Go to ' + name);
    b.addEventListener('click', function () { goTo(sec.id); });
    dotsWrap.appendChild(b);
  });
  var dots = $$('#dots button');

  /* ======================================================================
     Scroll spy
     ====================================================================== */
  function setActive(id) {
    navLinks.forEach(function (a) { a.classList.toggle('active', a.dataset.nav === id); });
    dots.forEach(function (d) { d.classList.toggle('active', d.dataset.target === id); });
  }

  function currentSection() {
    var offset = header.offsetHeight + 40;
    var best = sectionIds[0];
    sections.forEach(function (s) {
      if (s.getBoundingClientRect().top <= offset) best = s.id;
    });
    // Bottom of page always lights the last section
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
      best = sectionIds[sectionIds.length - 1];
    }
    return best;
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateScrollbar();
      if (!document.body.classList.contains('present')) setActive(currentSection());
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  /* ======================================================================
     Navigation (works in both reading and presentation mode)
     ====================================================================== */
  function goTo(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (document.body.classList.contains('present')) {
      showSlide(sectionIds.indexOf(id));
    } else {
      var top = el.getBoundingClientRect().top + window.scrollY - header.offsetHeight - 8;
      window.scrollTo({ top: Math.max(0, top), behavior: prefersReduced() ? 'auto' : 'smooth' });
      setActive(id);
      if (history.replaceState) history.replaceState(null, '', '#' + id);
    }
    closeMenu();
  }

  function prefersReduced() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // Any in-page anchor — nav links, hero buttons, brand logo
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href').slice(1);
      if (!id || !document.getElementById(id)) return;
      e.preventDefault();
      goTo(id);
    });
  });

  /* ======================================================================
     Mobile menu
     ====================================================================== */
  var menuBtn = $('#menu-btn');
  var nav = $('#nav');
  function closeMenu() {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }
  menuBtn.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  /* ======================================================================
     Reveal on scroll + animated counters, rings, bars
     ====================================================================== */
  function animateCount(el) {
    if (el.dataset.done === '1') return;
    el.dataset.done = '1';
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    if (prefersReduced()) { el.textContent = prefix + target + suffix; return; }
    var dur = 1200, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target.toLocaleString('en-US') + suffix;
    }
    requestAnimationFrame(step);
  }

  function activate(root) {
    $$('[data-count]', root).forEach(animateCount);
    $$('[data-w]', root).forEach(function (el) {
      var w = el.dataset.w + '%';
      el.style.setProperty('--w', w);
      requestAnimationFrame(function () { el.style.width = w; });
    });
    $$('[data-ring]', root).forEach(function (el) {
      var pct = parseFloat(el.dataset.ring);
      var c = 2 * Math.PI * 61;
      el.style.strokeDasharray = c;
      requestAnimationFrame(function () { el.style.strokeDashoffset = c * (1 - pct / 100); });
    });
    if (root.matches && root.matches('[data-count]')) animateCount(root);
  }

  var io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        activate(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    $$('.reveal').forEach(function (el) { io.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); activate(el); });
  }

  // The hero is above the fold — run it immediately
  activate($('#home'));

  /* ======================================================================
     Filters
     ====================================================================== */
  var cards = $$('#cards .icard');
  var filterBtns = $$('.filter');
  var emptyState = $('#empty-state');
  var filterStatus = $('#filter-status');

  function applyFilter(key) {
    var shown = 0;
    cards.forEach(function (c) {
      var match = key === 'all' || c.dataset.status === key;
      c.hidden = !match;
      if (match) shown++;
    });
    filterBtns.forEach(function (b) {
      b.setAttribute('aria-pressed', b.dataset.filter === key ? 'true' : 'false');
    });
    emptyState.classList.toggle('show', shown === 0);
    var label = filterBtns.filter(function (b) { return b.dataset.filter === key; })[0];
    var name = label ? label.childNodes[0].textContent.trim() : 'All';
    filterStatus.textContent = shown === 0
      ? 'No items match “' + name + '”'
      : 'Showing ' + shown + (key === 'all' ? ' items' : ' · ' + name);
  }

  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.dataset.filter); });
  });
  applyFilter('all');

  /* ======================================================================
     Modal
     ====================================================================== */
  var modal = $('#modal');
  var modalTitle = $('#modal-title');
  var modalBadges = $('#modal-badges');
  var modalBody = $('#modal-body');
  var lastFocus = null;

  function openModal(card) {
    lastFocus = card;
    modalTitle.textContent = card.dataset.title.replace(/&amp;/g, '&');
    modalBadges.innerHTML = '';
    var badge = card.querySelector('.badge');
    if (badge) modalBadges.appendChild(badge.cloneNode(true));
    var stage = card.querySelector('.stage-label');
    if (stage) {
      var s = document.createElement('span');
      s.className = 'badge b-steel';
      s.textContent = stage.textContent;
      modalBadges.appendChild(s);
    }
    var src = card.querySelector('.detail-src');
    modalBody.innerHTML = src ? src.innerHTML : '';
    modal.hidden = false;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('#modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.hidden = true;
    if (!document.body.classList.contains('present')) document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  cards.forEach(function (c) {
    c.addEventListener('click', function () { openModal(c); });
  });
  $('#modal-close').addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  /* ======================================================================
     Tabs
     ====================================================================== */
  var tabs = $$('.tab');
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        var on = o === t;
        o.setAttribute('aria-selected', on ? 'true' : 'false');
        var pane = document.getElementById(o.getAttribute('aria-controls'));
        if (pane) {
          pane.hidden = !on;
          if (on) { pane.classList.add('in'); activate(pane); }
        }
      });
    });
    t.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(t);
      if (e.key === 'ArrowRight') { e.stopPropagation(); tabs[(i + 1) % tabs.length].focus(); tabs[(i + 1) % tabs.length].click(); }
      if (e.key === 'ArrowLeft')  { e.stopPropagation(); tabs[(i - 1 + tabs.length) % tabs.length].focus(); tabs[(i - 1 + tabs.length) % tabs.length].click(); }
    });
  });

  /* ======================================================================
     Full screen
     ====================================================================== */
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
  $('#fs-btn').addEventListener('click', toggleFullscreen);
  $('#p-fs').addEventListener('click', toggleFullscreen);

  /* ======================================================================
     Print
     ====================================================================== */
  function resolveAllForPrint() {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    $$('[data-count]').forEach(function (el) {
      var t = parseFloat(el.dataset.count);
      el.dataset.done = '1';
      el.textContent = (el.dataset.prefix || '') + t.toLocaleString('en-US') + (el.dataset.suffix || '');
    });
    $$('[data-w]').forEach(function (el) {
      el.style.setProperty('--w', el.dataset.w + '%');
      el.style.width = el.dataset.w + '%';
    });
    $$('[data-ring]').forEach(function (el) {
      var c = 2 * Math.PI * 61;
      el.style.strokeDasharray = c;
      el.style.strokeDashoffset = c * (1 - parseFloat(el.dataset.ring) / 100);
    });
  }
  window.addEventListener('beforeprint', resolveAllForPrint);
  $('#print-btn').addEventListener('click', function () {
    resolveAllForPrint();
    setTimeout(function () { window.print(); }, 60);
  });

  /* ======================================================================
     Presentation mode — one section per screen
     ====================================================================== */
  var slideIndex = 0;
  var presentCount = $('#present-count');
  var pPrev = $('#p-prev');
  var pNext = $('#p-next');

  function showSlide(i) {
    slideIndex = Math.max(0, Math.min(sections.length - 1, i));
    sections.forEach(function (s, k) {
      s.classList.toggle('present-active', k === slideIndex);
      if (k === slideIndex) { s.scrollTop = 0; activate(s); }
    });
    presentCount.innerHTML = '<b>' + (slideIndex + 1) + '</b> / ' + sections.length;
    pPrev.disabled = slideIndex === 0;
    pNext.disabled = slideIndex === sections.length - 1;
    setActive(sectionIds[slideIndex]);
    if (history.replaceState) history.replaceState(null, '', '#' + sectionIds[slideIndex]);
  }

  function enterPresent(startId) {
    document.body.classList.add('present');
    document.body.style.overflow = 'hidden';
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    var i = startId ? sectionIds.indexOf(startId) : sectionIds.indexOf(currentSection());
    showSlide(i < 0 ? 0 : i);
    toast('Presentation mode · ← → to move, Esc to exit');
  }

  function exitPresent() {
    document.body.classList.remove('present');
    document.body.style.overflow = '';
    sections.forEach(function (s) { s.classList.remove('present-active'); });
    goTo(sectionIds[slideIndex]);
    toast('Exited presentation mode');
  }

  function togglePresent() {
    document.body.classList.contains('present') ? exitPresent() : enterPresent();
  }

  $('#present-btn').addEventListener('click', function () { togglePresent(); });
  $$('[data-present-start]').forEach(function (b) {
    b.addEventListener('click', function () { enterPresent('home'); });
  });
  pPrev.addEventListener('click', function () { showSlide(slideIndex - 1); });
  pNext.addEventListener('click', function () { showSlide(slideIndex + 1); });
  $('#p-exit').addEventListener('click', exitPresent);

  /* ======================================================================
     Keyboard
     ====================================================================== */
  document.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    if (modal.classList.contains('open')) {
      if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
      return;
    }

    var tag = (e.target.tagName || '').toLowerCase();
    var typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
    if (typing) return;

    var present = document.body.classList.contains('present');
    var idx = present ? slideIndex : sectionIds.indexOf(currentSection());

    switch (e.key) {
      case 'ArrowRight':
      case 'PageDown':
        e.preventDefault();
        present ? showSlide(idx + 1) : goTo(sectionIds[Math.min(sections.length - 1, idx + 1)]);
        break;
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        present ? showSlide(idx - 1) : goTo(sectionIds[Math.max(0, idx - 1)]);
        break;
      case 'Home':
        e.preventDefault();
        present ? showSlide(0) : goTo(sectionIds[0]);
        break;
      case 'End':
        e.preventDefault();
        present ? showSlide(sections.length - 1) : goTo(sectionIds[sectionIds.length - 1]);
        break;
      case 'Escape':
        if (present) { e.preventDefault(); exitPresent(); }
        break;
      case 'p':
      case 'P':
        e.preventDefault(); togglePresent(); break;
      case 'f':
      case 'F':
        e.preventDefault(); toggleFullscreen(); break;
      default: break;
    }
  });

  /* ======================================================================
     Touch swipe in presentation mode
     ====================================================================== */
  var tx = null, ty = null;
  document.addEventListener('touchstart', function (e) {
    tx = e.changedTouches[0].clientX; ty = e.changedTouches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (tx === null || !document.body.classList.contains('present')) { tx = ty = null; return; }
    var dx = e.changedTouches[0].clientX - tx;
    var dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) showSlide(slideIndex + (dx < 0 ? 1 : -1));
    tx = ty = null;
  }, { passive: true });

  /* ======================================================================
     Boot
     ====================================================================== */
  updateScrollbar();
  setActive(location.hash ? location.hash.slice(1) : 'home');
  if (location.hash && document.getElementById(location.hash.slice(1))) {
    setTimeout(function () { goTo(location.hash.slice(1)); }, 60);
  }
  window.addEventListener('load', onScroll);
})();
