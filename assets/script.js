/* MiniKart marketing site — interaction & motion.
   Plain JS, no dependencies, no build step.

   Motion moments (deliberately few):
     1. Intro       — first page view per browser session: logo + wordmark on ink,
                      panel lifts away and the hero cascades in behind it.
     2. Reveals     — [data-reveal] elements fade/rise as they enter the viewport,
                      staggered only when several enter together. Headlines use a
                      masked word-rise; screenshots use a curtain wipe.
     3. Hero tilt   — the dashboard shot is tilted back in 3D and flattens as you
                      scroll into it (smoothed, scroll-linked).
     4. Product tour— on desktop the home-page screenshots pin in place and swap
                      as each feature's copy scrolls past.
   Plus small craft details: magnetic CTAs, cursor, auto-hiding header,
   animated mobile menu, counters.

   Safety: the inline <head> script adds html.js (which is what hides reveal
   targets) and removes it again if window.MK_READY isn't set by page load —
   so if this file fails, the page is simply static, never blank. */

(function () {
  "use strict";

  var doc = document;
  var html = doc.documentElement;
  var win = window;

  function mq(q) { return !!(win.matchMedia && win.matchMedia(q).matches); }
  var reduced = mq("(prefers-reduced-motion: reduce)");
  var finePointer = mq("(hover: hover) and (pointer: fine)");

  var STAGGER = 80;     // ms between items that enter the viewport together
  var MAX_STAGGER = 6;  // cap, so a big batch never makes the last item wait long

  function $(sel, root) { return (root || doc).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || doc).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  // Non-critical features are isolated: if one throws, the rest still run and
  // the error still reaches the console.
  function safe(name, fn) {
    try { fn(); } catch (err) { if (win.console) console.error("[MiniKart] " + name + " failed:", err); }
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", init);
  else init();

  function init() {
    safe("nav", setupNav);
    safe("form", setupForm);
    safe("marquee", setupMarquee);
    safe("words", splitWords);
    safe("counters", primeCounters);
    safe("tour", setupTour);
    safe("scroll", setupScrollScene);
    safe("magnetic", setupMagnetic);
    safe("cursor", setupCursor);
    runIntro(startReveals);
    win.MK_READY = true;
  }

  /* ------------------------------------------------------------------------
     Navigation: mobile menu with proper ARIA, Escape / outside-click to close
     ------------------------------------------------------------------------ */
  function setupNav() {
    var toggle = $(".menu-toggle");
    var links = $(".nav-links");
    if (!toggle || !links) return;

    function setOpen(open) {
      links.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      html.classList.toggle("nav-open", open);
    }
    toggle.addEventListener("click", function () {
      setOpen(!links.classList.contains("open"));
    });
    $$("a", links).forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) { setOpen(false); toggle.focus(); }
    });
    doc.addEventListener("click", function (e) {
      if (links.classList.contains("open") && !e.target.closest(".nav")) setOpen(false);
    });
    win.addEventListener("resize", function () {
      if (win.innerWidth > 700 && links.classList.contains("open")) setOpen(false);
    });
  }

  /* ------------------------------------------------------------------------
     Contact form -> pre-filled email to info@minikart.com
     (Previously the body wasn't URL-encoded, so a message containing "&",
     "#" or "%" was silently truncated or mangled.)
     ------------------------------------------------------------------------ */
  var CONTACT_EMAIL = "info@minikart.com";

  function buildMailto(form) {
    var f = form.elements;
    var name = (f.namedItem("name").value || "").trim();
    var email = (f.namedItem("email").value || "").trim();
    var message = (f.namedItem("message").value || "").trim();
    var subject = "Website enquiry from " + (name || "website visitor");
    var body = "Name: " + name + "\r\nEmail: " + email + "\r\n\r\n" + message;
    return "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }
  win.MK = { buildMailto: buildMailto }; // exposed for testing

  function setupForm() {
    var form = $("form.contact-form");
    if (!form) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var btn = $("button[type=submit]", form);
      var label = btn && $(".btn-label", btn);
      if (label) {
        var original = label.textContent;
        btn.classList.add("is-busy");
        label.textContent = "Opening your email app…";
        setTimeout(function () { label.textContent = original; btn.classList.remove("is-busy"); }, 3500);
      }
      win.location.href = buildMailto(form);
    });
  }

  /* ------------------------------------------------------------------------
     Marquee: seamless strip, paused while off-screen (saves battery)
     ------------------------------------------------------------------------ */
  function setupMarquee() {
    var track = $("#marquee-track");
    if (!track) return;
    var items = [
      "Sales", "Inventory", "Purchases", "Staff roles", "Cash registers",
      "Reports", "Receipts", "Void approvals", "Works on any device"
    ];
    var frag = doc.createDocumentFragment();
    for (var copy = 0; copy < 2; copy++) { // two copies -> the -50% loop has no seam
      items.forEach(function (label) {
        var item = doc.createElement("span");
        item.className = "marquee-item";
        var dot = doc.createElement("span");
        dot.className = "dot";
        dot.textContent = "●";
        item.appendChild(dot);
        item.appendChild(doc.createTextNode(label));
        frag.appendChild(item);
      });
    }
    track.appendChild(frag);

    var band = track.parentNode;
    if (typeof win.IntersectionObserver === "function") {
      new IntersectionObserver(function (entries) {
        band.classList.toggle("is-paused", !entries[0].isIntersecting);
      }).observe(band);
    }
  }

  /* ------------------------------------------------------------------------
     Split [data-reveal="words"] headings into masked words (DOM-built, so
     text is never re-parsed as HTML).
     ------------------------------------------------------------------------ */
  function splitWords() {
    $$('[data-reveal="words"]').forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.setAttribute("aria-label", words.join(" "));
      el.textContent = "";
      words.forEach(function (word, i) {
        var outer = doc.createElement("span");
        outer.className = "w";
        outer.setAttribute("aria-hidden", "true");
        var inner = doc.createElement("span");
        inner.className = "wi";
        inner.style.setProperty("--i", i);
        inner.textContent = word;
        outer.appendChild(inner);
        el.appendChild(outer);
        if (i < words.length - 1) el.appendChild(doc.createTextNode(" "));
      });
      el.classList.add("is-split");
    });
  }

  /* ------------------------------------------------------------------------
     Counters. HTML holds the real final value (so no-JS visitors see correct
     numbers); we rewind to data-from (default 0) and count when revealed.
     ------------------------------------------------------------------------ */
  function fmt(el, v) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = target % 1 !== 0 ? 1 : 0;
    return v.toFixed(decimals) + (el.getAttribute("data-suffix") || "");
  }
  function primeCounters() {
    if (reduced) return;
    $$("[data-count]").forEach(function (el) {
      el.textContent = fmt(el, parseFloat(el.getAttribute("data-from") || "0"));
    });
  }
  function runCounter(el) {
    var to = parseFloat(el.getAttribute("data-count"));
    if (isNaN(to)) return;
    if (reduced) { el.textContent = fmt(el, to); return; }
    var from = parseFloat(el.getAttribute("data-from") || "0");
    var duration = 1400;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 4); // quartic ease-out: fast start, gentle landing
      var v = from + (to - from) * eased;
      el.textContent = fmt(el, t < 1 ? (to % 1 ? v : Math.round(v)) : to);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ------------------------------------------------------------------------
     Intro sequence (first page view of the session; skipped for reduced
     motion). Click / key / wheel / touch skips straight to the exit.
     ------------------------------------------------------------------------ */
  function runIntro(done) {
    if (!html.classList.contains("is-intro")) { done(); return; }
    try { doc.cookie = "mk-intro=1; path=/; SameSite=Lax"; } catch (e) {}
    try { sessionStorage.setItem("mk-intro", "1"); } catch (e) {}

    var intro = doc.createElement("div");
    intro.className = "intro";
    intro.setAttribute("aria-hidden", "true");
    var mark = doc.createElement("div");
    mark.className = "intro-mark";
    var img = doc.createElement("img");
    img.src = "assets/logo-mark.png";
    img.alt = "";
    var word = doc.createElement("span");
    word.className = "intro-word";
    var wordInner = doc.createElement("span");
    wordInner.textContent = "MiniKart";
    word.appendChild(wordInner);
    mark.appendChild(img);
    mark.appendChild(word);
    var bar = doc.createElement("div");
    bar.className = "intro-bar";
    bar.appendChild(doc.createElement("i"));
    intro.appendChild(mark);
    intro.appendChild(bar);
    doc.body.appendChild(intro);
    html.classList.add("intro-mounted");

    var exited = false;
    var timers = [];
    function exit() {
      if (exited) return;
      exited = true;
      timers.forEach(clearTimeout);
      intro.classList.add("is-out");
      // Start the page cascade as the panel begins to lift, so the hero is
      // already moving when it's uncovered.
      setTimeout(done, 180);
      setTimeout(function () {
        intro.remove();
        html.classList.remove("is-intro", "intro-mounted");
      }, 900);
      ["click", "keydown", "wheel", "touchstart"].forEach(function (t) { win.removeEventListener(t, exit); });
    }
    ["click", "keydown", "wheel", "touchstart"].forEach(function (t) {
      win.addEventListener(t, exit, { passive: true });
    });

    // Two frames so the initial (hidden) state is painted before we animate.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { intro.classList.add("is-in"); });
    });
    timers.push(setTimeout(exit, 1050));
  }

  /* ------------------------------------------------------------------------
     Scroll reveals
     ------------------------------------------------------------------------ */
  function reveal(el, delay, instant) {
    if (instant) el.classList.add("is-instant");
    el.style.setProperty("--d", delay + "ms");
    var fire = function () {
      el.classList.add("in-view");
      $$("[data-count]", el).forEach(function (c) { setTimeout(function () { runCounter(c); }, delay + 150); });
      if (instant) {
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { el.classList.remove("is-instant"); });
        });
      }
    };
    if (el.getAttribute("data-reveal") === "media" && !instant) whenImagesReady(el, fire);
    else fire();
  }

  // Don't wipe the curtain off an image that hasn't arrived yet — but never
  // wait more than 1.2s, so a slow/broken image can't keep anything hidden.
  function whenImagesReady(el, cb) {
    var imgs = $$("img", el).filter(function (i) { return !i.complete; });
    if (!imgs.length) { cb(); return; }
    var called = false;
    var remaining = imgs.length;
    function finish() { if (!called) { called = true; cb(); } }
    imgs.forEach(function (i) {
      var one = function () { if (--remaining <= 0) finish(); };
      i.addEventListener("load", one, { once: true });
      i.addEventListener("error", one, { once: true });
    });
    setTimeout(finish, 1200);
  }

  function startReveals() {
    var targets = $$("[data-reveal]");
    if (typeof win.IntersectionObserver !== "function") {
      targets.forEach(function (el) { reveal(el, 0, true); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      var batch = entries.filter(function (e) {
        // Entering the viewport, or already scrolled past (e.g. restored
        // scroll position / in-page anchor) — the latter reveals instantly.
        return e.isIntersecting || e.boundingClientRect.bottom <= 0;
      });
      batch.sort(function (a, b) {
        return (a.boundingClientRect.top - b.boundingClientRect.top) ||
               (a.boundingClientRect.left - b.boundingClientRect.left);
      });
      var k = 0;
      batch.forEach(function (e) {
        io.unobserve(e.target);
        if (!e.isIntersecting) { reveal(e.target, 0, true); return; }
        reveal(e.target, Math.min(k, MAX_STAGGER) * STAGGER, false);
        k++;
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    targets.forEach(function (el) { io.observe(el); });

    // Printing should never show half-revealed content.
    win.addEventListener("beforeprint", function () {
      targets.forEach(function (el) { el.classList.add("in-view"); });
    });
  }

  /* ------------------------------------------------------------------------
     Product tour: which step is active (IntersectionObserver on a thin band
     across the middle of the viewport), plus progress bar (scroll-linked).
     ------------------------------------------------------------------------ */
  var tour = null;
  function setupTour() {
    var root = $("[data-tour]");
    if (!root) return;
    var steps = $$(".tour-step", root);
    var imgs = $$(".tour-img", root);
    var current = $(".tour-current", root);
    var label = $(".tour-label", root);
    var bar = $(".tour-bar i", root);
    var active = -1;

    function setActive(i) {
      if (i === active) return;
      active = i;
      steps.forEach(function (s, n) { s.classList.toggle("is-active", n === i); });
      imgs.forEach(function (im, n) { im.classList.toggle("is-active", n === i); });
      if (current) current.textContent = ("0" + (i + 1)).slice(-2);
      var eb = $(".eyebrow", steps[i]);
      if (label && eb) label.textContent = eb.textContent;
    }
    setActive(0);

    if (typeof win.IntersectionObserver === "function") {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setActive(steps.indexOf(e.target));
        });
      }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
      steps.forEach(function (s) { io.observe(s); });
    }

    tour = {
      update: function (vh) {
        if (!bar) return;
        var first = steps[0].getBoundingClientRect();
        var last = steps[steps.length - 1].getBoundingClientRect();
        var mid = vh / 2;
        var p = clamp((mid - first.top) / Math.max(1, last.bottom - first.top), 0, 1);
        bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
      }
    };
  }

  /* ------------------------------------------------------------------------
     One passive scroll listener, one rAF per frame at most:
       - header: shadow once scrolled; hides on scroll down, returns on scroll up
       - hero tilt target
       - tour progress
     The tilt itself is smoothed toward its target (decorative motion should
     have a little inertia, not be glued 1:1 to the scrollbar).
     ------------------------------------------------------------------------ */
  function setupScrollScene() {
    var header = $("header.site");
    var shot = $("[data-tilt]");
    var tiltEl = shot && $(".tilt", shot);
    var lastY = win.pageYOffset;
    var ticking = false;

    var tiltTarget = 0, tiltCur = 0, tiltRunning = false;
    var useTilt = tiltEl && !reduced;

    function tiltProgress(vh) {
      var r = shot.getBoundingClientRect();
      // 0 when the shot's top is at the bottom of the viewport,
      // 1 when it has risen to ~25% from the top.
      return clamp((vh - r.top) / (vh * 0.75), 0, 1);
    }
    function applyTilt(p) {
      var e = 1 - Math.pow(1 - p, 2);
      var small = win.innerWidth < 700;
      var rot = (small ? 12 : 22) * (1 - e);
      var sc = 0.9 + 0.1 * e;
      tiltEl.style.transform = "rotateX(" + rot.toFixed(3) + "deg) scale(" + sc.toFixed(4) + ")";
    }
    function tiltLoop() {
      tiltCur += (tiltTarget - tiltCur) * 0.12;
      if (Math.abs(tiltTarget - tiltCur) < 0.0005) { tiltCur = tiltTarget; tiltRunning = false; }
      applyTilt(tiltCur);
      if (tiltRunning) requestAnimationFrame(tiltLoop);
    }

    function frame() {
      ticking = false;
      var y = win.pageYOffset;
      var vh = win.innerHeight;

      if (header) {
        header.classList.toggle("is-scrolled", y > 8);
        var menuOpen = html.classList.contains("nav-open");
        if (!reduced && !menuOpen && y > 160 && y > lastY + 4) header.classList.add("is-hidden");
        else if (y < lastY - 4 || y <= 160 || menuOpen) header.classList.remove("is-hidden");
      }
      lastY = y;

      if (useTilt) {
        tiltTarget = tiltProgress(vh);
        if (!tiltRunning) { tiltRunning = true; requestAnimationFrame(tiltLoop); }
      }
      if (tour) tour.update(vh);
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(frame); }
    }

    if (useTilt) { tiltCur = tiltTarget = tiltProgress(win.innerHeight); applyTilt(tiltCur); }
    // Keyboard focus moving into a hidden header should bring it back.
    if (header) header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
    win.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("resize", onScroll);
    frame();
  }

  /* ------------------------------------------------------------------------
     Magnetic CTAs (fine pointer only). Uses the `translate` property so the
     :active press scale (on `transform`) still works — before, the inline
     transform permanently overrode the press/hover states after first hover.
     ------------------------------------------------------------------------ */
  function setupMagnetic() {
    if (!finePointer || reduced) return;
    $$(".magnetic").forEach(function (el) {
      el.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = el.getBoundingClientRect();
        var x = clamp((e.clientX - r.left - r.width / 2) * 0.22, -10, 10);
        var y = clamp((e.clientY - r.top - r.height / 2) * 0.3, -8, 8);
        el.style.translate = x.toFixed(2) + "px " + y.toFixed(2) + "px";
      });
      el.addEventListener("pointerleave", function () { el.style.translate = ""; });
    });
  }

  /* ------------------------------------------------------------------------
     Cursor: dot + ring. Only animates while moving (no idle rAF loop),
     grows over interactive elements, turns white over dark surfaces and
     steps aside over text fields.
     ------------------------------------------------------------------------ */
  function setupCursor() {
    if (!finePointer || reduced) return;
    var c = doc.createElement("div");
    c.className = "cursor";
    c.setAttribute("aria-hidden", "true");
    c.innerHTML = '<span class="cursor-ring"></span><span class="cursor-dot"></span>';
    doc.body.appendChild(c);

    var tx = -100, ty = -100, cx = -100, cy = -100, running = false, seen = false;
    function loop() {
      cx += (tx - cx) * 0.3;
      cy += (ty - cy) * 0.3;
      if (Math.abs(tx - cx) < 0.1 && Math.abs(ty - cy) < 0.1) { cx = tx; cy = ty; running = false; }
      c.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      if (running) requestAnimationFrame(loop);
    }
    doc.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      tx = e.clientX; ty = e.clientY;
      if (!seen) { seen = true; cx = tx; cy = ty; } // appear under the pointer, don't fly in
      c.classList.add("is-active");
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    html.addEventListener("mouseleave", function () { c.classList.remove("is-active"); seen = false; });
    doc.addEventListener("pointerover", function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      c.classList.toggle("is-hover", !!t.closest("a, button, label, [data-cursor]"));
      c.classList.toggle("is-text", !!t.closest("input, textarea, select"));
      c.classList.toggle("is-dark", !!t.closest(".cta-band, .marquee, footer.site, .intro"));
    });
    doc.addEventListener("pointerdown", function () { c.classList.add("is-down"); });
    doc.addEventListener("pointerup", function () { c.classList.remove("is-down"); });
  }
})();
