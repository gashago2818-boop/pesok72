(function () {
  var triggered = new WeakSet();
  var observed = new WeakSet();
  var counted = new WeakSet();
  var scrolled = false;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        triggered.add(entry.target);
        entry.target.classList.add('is-visible');
        startCount(entry.target);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  function startCount(root) {
    var counters = root.hasAttribute('data-count-to') ? [root] : Array.from(root.querySelectorAll('[data-count-to]'));
    counters.forEach(function (el) {
      if (counted.has(el)) return;
      counted.add(el);
      var target = parseFloat(el.getAttribute('data-count-to'));
      var suffix = el.getAttribute('data-suffix') || '';
      var duration = 1100;
      var start = performance.now();
      function tick(now) {
        var p = Math.min(1, (now - start) / duration);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = Math.round(target * eased);
        el.textContent = val.toLocaleString('ru-RU') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
  }

  // The page's render engine recreates/patches DOM nodes during its initial mount, which can
  // wipe classes we set too early. This keeps re-binding new .reveal nodes and re-applying
  // the "already revealed" state if it ever gets reset out from under us.
  function sync() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      if (!observed.has(el)) {
        observed.add(el);
        io.observe(el);
      }
      if (triggered.has(el) && !el.classList.contains('is-visible')) {
        el.classList.add('is-visible');
      }
    });
    var header = document.querySelector('.m-header');
    if (header) header.classList.toggle('is-scrolled', scrolled);
  }

  var mo = new MutationObserver(sync);
  mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

  function start() { sync(); }
  if (document.readyState === 'complete') {
    setTimeout(start, 700);
  } else {
    window.addEventListener('load', function () { setTimeout(start, 700); });
  }

  document.addEventListener('scroll', function () {
    scrolled = window.scrollY > 8;
    var header = document.querySelector('.m-header');
    if (header) header.classList.toggle('is-scrolled', scrolled);
  }, { passive: true });
})();
