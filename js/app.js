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
    el.dataset.done = '1';                       // runs once, ever
    var target = parseFloat(el.dataset.count);
    var prefix = el.dataset.prefix || '';
    var suffix = el.dataset.suffix || '';
    var final = prefix + target.toLocaleString('en-US') + suffix;
    // The final figure is already in the markup, so if motion is reduced (or JS
    // is disabled entirely) the number stays visible and correct.
    if (prefersReduced()) { el.textContent = final; return; }
    var dur = 1100, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = prefix + Math.round(target * eased).toLocaleString('en-US') + suffix;
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = final;
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

  var resetBtn = $('#reset-filters');
  var activeFilter = 'all';

  function applyFilter(key) {
    activeFilter = key;
    var shown = 0;
    cards.forEach(function (c) {
      var match = key === 'all' || c.dataset.status === key ||
                  (key === 'purchased' && c.dataset.status === 'selected');
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
      ? 'No items match \u201c' + name + '\u201d'
      : 'Showing ' + shown + ' of ' + cards.length + (key === 'all' ? ' items' : ' \u00b7 ' + name);

    resetBtn.disabled = key === 'all';
    // Clearing the filter also clears any card selection highlight
    if (key === 'all') cards.forEach(function (c) { c.classList.remove('selected'); });
  }

  // Counts are computed from the rendered cards, never hard-coded in the markup
  filterBtns.forEach(function (b) {
    var key = b.dataset.filter;
    var n = key === 'all' ? cards.length
          : cards.filter(function (c) {
              return c.dataset.status === key ||
                     (key === 'purchased' && c.dataset.status === 'selected');
            }).length;
    var c = b.querySelector('.cnt');
    if (c) c.textContent = n;
    if (n === 0) b.classList.add('zero');
  });

  resetBtn.addEventListener('click', function () {
    applyFilter('all');
    filterStatus.textContent = 'Filters reset \u00b7 showing all ' + cards.length + ' items';
    toast('Filters reset');
  });

  filterBtns.forEach(function (b) {
    b.addEventListener('click', function () { applyFilter(b.dataset.filter); });
  });

  applyFilter('all');

  /* ======================================================================
     Capability landscape — counters computed from the cards, status filter
     ====================================================================== */
  var capCards = $$('#cap-domains .capcard');
  var capDomains = $$('#cap-domains .domain');
  var capFilters = $$('.cap-filter');
  var capEmpty = $('#cap-empty');
  var capStatus = $('#cap-status');
  var capReset = $('#reset-caps');

  // Group statuses into the four executive counters. Nothing is hard-coded:
  // each figure is the length of an actual filter over the rendered cards.
  // Each counter is the length of a real filter over the rendered cards
  var GROUPS = {
    operational: ['operational'],
    contracted:  ['contracted', 'purchased', 'selected'],
    people:      ['recruited'],
    remaining:   ['required', 'dependent', 'critical', 'planned2026']
  };

  function countStatus(list) {
    return capCards.filter(function (c) { return list.indexOf(c.dataset.status) > -1; }).length;
  }
  function countGroup(g) {
    return capCards.filter(function (c) { return c.dataset.group === g; }).length;
  }

  if (capCards.length) {
    // Counter KPI cards
    Object.keys(GROUPS).forEach(function (k) {
      var el = $('[data-counter="' + k + '"]');
      if (!el) return;
      var n = countStatus(GROUPS[k]);
      el.dataset.count = n;      // lets the shared count-up animation pick it up
      el.textContent = n;        // visible immediately, and without JS-driven motion
    });

    // Filter chip counts
    $$('[data-cnt]').forEach(function (el) {
      var k = el.dataset.cnt;
      // 'planned' groups Planned / Procurement with Planned / Dependency, so the
      // chip count must use the same grouping the filter uses.
      el.textContent = k === 'all' ? capCards.length
        : (k.slice(-2) === '-g' ? countGroup(k) : countStatus(GROUPS[k] || [k]));
      if (el.textContent === '0') el.closest('.filter').classList.add('zero');
    });

    var capActive = 'all';
    function applyCap(key) {
      capActive = key;
      var shown = 0;
      capCards.forEach(function (c) {
        var match = key === 'all' ||
                    (key.slice(-2) === '-g' ? c.dataset.group === key : c.dataset.status === key);
        c.hidden = !match;
        if (match) shown++;
      });
      // Hide a domain group entirely when nothing in it matches
      capDomains.forEach(function (d) {
        var vis = $$('.capcard', d).filter(function (c) { return !c.hidden; });
        d.hidden = vis.length === 0;
        var cnt = $('.domain-count', d);
        if (cnt) cnt.textContent = vis.length;
      });
      capFilters.forEach(function (b) {
        b.setAttribute('aria-pressed', b.dataset.cap === key ? 'true' : 'false');
      });
      capEmpty.classList.toggle('show', shown === 0);
      var lbl = capFilters.filter(function (b) { return b.dataset.cap === key; })[0];
      var name = lbl ? lbl.childNodes[0].textContent.trim() : 'All';
      capStatus.textContent = shown === 0
        ? 'No capabilities match \u201c' + name + '\u201d'
        : 'Showing ' + shown + ' of ' + capCards.length + (key === 'all' ? ' capabilities' : ' \u00b7 ' + name);
      capReset.disabled = key === 'all';
    }

    capFilters.forEach(function (b) {
      b.addEventListener('click', function () { applyCap(b.dataset.cap); });
    });
    capReset.addEventListener('click', function () {
      applyCap('all');
      capStatus.textContent = 'Filters reset \u00b7 showing all ' + capCards.length + ' capabilities';
      toast('Filters reset');
    });
    applyCap('all');
  }

  /* ======================================================================
     Modal
     ====================================================================== */
  var modal = $('#modal');
  var modalTitle = $('#modal-title');
  var modalBadges = $('#modal-badges');
  var modalBody = $('#modal-body');
  var lastFocus = null;

  var modalFoot = document.createElement('div');
  modalFoot.id = 'modal-foot';
  modalBody.parentNode.appendChild(modalFoot);

  function openModal(el) {
    lastFocus = el;
    var title = el.dataset.title || '';
    modalTitle.textContent = title.replace(/&amp;/g, '&');

    modalBadges.innerHTML = '';
    var badge = el.querySelector('.badge') || (el.closest('article') && el.closest('article').querySelector('.badge'));
    if (badge) modalBadges.appendChild(badge.cloneNode(true));
    var stage = el.querySelector('.stage-label');
    if (stage) {
      var s1 = document.createElement('span');
      s1.className = 'badge b-steel';
      s1.textContent = stage.textContent;
      modalBadges.appendChild(s1);
    }
    if (el.dataset.period) {
      var s2 = document.createElement('span');
      s2.className = 'badge b-cyan';
      s2.textContent = el.dataset.period;
      modalBadges.appendChild(s2);
    }

    var src = el.querySelector('.detail-src');
    modalBody.innerHTML = src ? src.innerHTML : '';
    modalFoot.textContent = 'Source \u00b7 Muhlah Cybersecurity Executive Progress Report \u00b7 24 August 2026';

    // Mark which card is open
    cards.forEach(function (c) { c.classList.toggle('selected', c === el); });

    modal.hidden = false;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('#modal-close').focus();
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.hidden = true;
    if (!document.body.classList.contains('present')) document.body.style.overflow = '';
    if (lastFocus) { try { lastFocus.focus(); } catch (e) {} }
  }

  // Trap focus inside the dialog while it is open
  modal.addEventListener('keydown', function (e) {
    if (e.key !== 'Tab') return;
    var f = $$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', modal)
      .filter(function (n) { return n.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  cards.forEach(function (c) {
    c.addEventListener('click', function () { openModal(c); });
  });
  $$('[data-modal]').forEach(function (el) {
    el.addEventListener('click', function () { openModal(el); });
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

  var pName = null, pOf = null, pFill = null;
  function buildPresentMeta() {
    if (pName) return;
    var wrap = document.createElement('div');
    wrap.id = 'present-meta';
    wrap.innerHTML = '<div class="row"><span class="name"></span><span class="of"></span></div>'
                   + '<div class="track"><span class="fill"></span></div>';
    document.body.appendChild(wrap);
    pName = wrap.querySelector('.name');
    pOf = wrap.querySelector('.of');
    pFill = wrap.querySelector('.fill');
  }

  function sectionName(sec) {
    var lb = sec.getAttribute('aria-labelledby');
    var h = lb && document.getElementById(lb);
    return h ? h.textContent.trim() : sec.id;
  }

  function showSlide(i) {
    slideIndex = Math.max(0, Math.min(sections.length - 1, i));
    sections.forEach(function (s, k) {
      s.classList.toggle('present-active', k === slideIndex);
      if (k === slideIndex) { s.scrollTop = 0; activate(s); }
    });
    buildPresentMeta();
    var navLink = navLinks.filter(function (a) { return a.dataset.nav === sectionIds[slideIndex]; })[0];
    pName.textContent = navLink ? navLink.textContent.trim() : sectionName(sections[slideIndex]);
    pOf.textContent = 'Section ' + (slideIndex + 1) + ' of ' + sections.length;
    pFill.style.width = ((slideIndex + 1) / sections.length * 100) + '%';
    presentCount.innerHTML = '<b>' + (slideIndex + 1) + '</b> / ' + sections.length;
    pPrev.disabled = slideIndex === 0;
    pNext.disabled = slideIndex === sections.length - 1;
    setActive(sectionIds[slideIndex]);
    if (history.replaceState) history.replaceState(null, '', '#' + sectionIds[slideIndex]);
  }

  function enterPresent(startId) {
    // Resolve the target section BEFORE adding the .present class. That class
    // hides every section, which collapses their bounding rects to zero and
    // makes currentSection() always report the last section.
    var i = startId ? sectionIds.indexOf(startId) : sectionIds.indexOf(currentSection());
    if (i < 0) i = 0;
    document.body.classList.add('present');
    document.body.style.overflow = 'hidden';
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    showSlide(i);
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
