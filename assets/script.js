document.addEventListener("DOMContentLoaded", function () {
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
      window.location.href = "mailto:REPLACE_WITH_YOUR_EMAIL@example.com?subject=" + subject + "&body=" + body;
    });
  }

  // Scroll-reveal: fade + rise elements into view as the page is scrolled,
  // with a small stagger for items grouped in the same row (cards, steps).
  var revealTargets = document.querySelectorAll(
    ".hero > .container > *, .card, .step, .plan, .faq-item, .frame, .showcase-media, .showcase-copy, .cta-band, .section-head"
  );

  revealTargets.forEach(function (el) {
    el.classList.add("reveal");
  });

  // Stagger cards/steps/plans within their own grid.
  document.querySelectorAll(".grid, .steps, .pricing-grid").forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty("--reveal-delay", (i * 70) + "ms");
    });
  });

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("in-view"); });
  }
});
