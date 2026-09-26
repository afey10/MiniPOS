document.addEventListener("DOMContentLoaded", function () {
  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { links.classList.remove("open"); });
    });
  }

  var form = document.querySelector("form.contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var subject = encodeURIComponent("Website enquiry from " + (form.name.value || "website visitor"));
      var body = "Name: " + (form.name.value || "") + "%0D%0AEmail: " + (form.email.value || "") + "%0D%0A%0D%0A" + (form.message.value || "");
      window.location.href = "mailto:info@minikart.com?subject=" + subject + "&body=" + body;
    });
  }

  // --- Marquee: build a seamless looping strip from a short item list ---
  var marqueeTrack = document.getElementById("marquee-track");
  if (marqueeTrack) {
    var items = [
      "Sales", "Inventory", "Purchases", "Staff roles", "Cash registers",
      "Reports", "Receipts", "Void approvals", "Works on any device",
    ];
    var html = items
      .map(function (label) {
        return '<span class="marquee-item"><span class="dot">●</span>' + label + "</span>";
      })
      .join("");
    // Duplicate once so the -50% translate loop has no visible seam.
    marqueeTrack.innerHTML = html + html;
  }

  // --- Hero headline: split into words that rise into place on load ---
  var heroH1 = document.querySelector(".hero h1");
  if (heroH1 && !reducedMotion) {
    var text = heroH1.textContent;
    var words = text.trim().split(/\s+/);
    heroH1.innerHTML = words
      .map(function (w, i) {
        return '<span class="word" style="--word-delay:' + (i * 60) + 'ms">' + w + "</span>";
      })
      .join(" ");
  }

  // --- Scroll-reveal: fade + rise for general content blocks ---
  var revealTargets = document.querySelectorAll(
    ".hero .eyebrow, .hero p.lead, .hero-actions, .card, .step, .plan, .faq-item, .cta-band, .section-head, .stats, .marquee"
  );
  revealTargets.forEach(function (el) { el.classList.add("reveal"); });

  // Screenshots/frames get the wipe-reveal treatment instead.
  var mediaTargets = document.querySelectorAll(".frame, .showcase-media");
  mediaTargets.forEach(function (el) { el.classList.add("reveal-media"); });

  // Stagger cards/steps/plans within their own grid.
  document.querySelectorAll(".grid, .steps, .pricing-grid, .stats").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--reveal-delay", (i * 70) + "ms");
    });
  });

  var allTargets = Array.prototype.concat(
    Array.prototype.slice.call(revealTargets),
    Array.prototype.slice.call(mediaTargets)
  );

  function animateCounter(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    if (isNaN(target)) return;
    var suffix = el.getAttribute("data-suffix") || "";
    var duration = 1100;
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var isFractional = target % 1 !== 0;
      var value = isFractional ? (target * eased).toFixed(1) : Math.round(target * eased);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && !reducedMotion) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            var counters = entry.target.querySelectorAll("[data-count]");
            counters.forEach(animateCounter);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    allTargets.forEach(function (el) { observer.observe(el); });
  } else {
    allTargets.forEach(function (el) {
      el.classList.add("in-view");
      el.querySelectorAll("[data-count]").forEach(function (c) {
        c.textContent = c.getAttribute("data-count") + (c.getAttribute("data-suffix") || "");
      });
    });
  }

  // --- Magnetic buttons: nudge toward the cursor, snap back on leave ---
  if (window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches && !reducedMotion) {
    document.querySelectorAll(".magnetic").forEach(function (el) {
      el.addEventListener("mousemove", function (e) {
        var rect = el.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = "translate(" + x * 0.25 + "px, " + y * 0.35 + "px)";
      });
      el.addEventListener("mouseleave", function () {
        el.style.transform = "translate(0, 0)";
      });
    });

    // --- Custom cursor dot that grows over interactive elements ---
    var dot = document.createElement("div");
    dot.className = "cursor-dot";
    document.body.appendChild(dot);
    var dotX = 0, dotY = 0, curX = 0, curY = 0;
    document.addEventListener("mousemove", function (e) {
      dotX = e.clientX; dotY = e.clientY;
      dot.classList.add("active");
    });
    document.addEventListener("mouseleave", function () { dot.classList.remove("active"); });
    (function render() {
      curX += (dotX - curX) * 0.35;
      curY += (dotY - curY) * 0.35;
      dot.style.transform = "translate3d(" + curX + "px," + curY + "px,0)";
      requestAnimationFrame(render);
    })();
    document.querySelectorAll("a, button, .card, .frame, .showcase-media").forEach(function (el) {
      el.addEventListener("mouseenter", function () { dot.classList.add("hover"); });
      el.addEventListener("mouseleave", function () { dot.classList.remove("hover"); });
    });
  }
});
