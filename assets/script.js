document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  var form = document.querySelector("form.contact-form");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = encodeURIComponent(form.name.value || "");
      var email = encodeURIComponent(form.email.value || "");
      var message = encodeURIComponent(form.message.value || "");
      var subject = encodeURIComponent("Website enquiry from " + (form.name.value || "website visitor"));
      var body = "Name: " + decodeURIComponent(name) + "%0D%0AEmail: " + decodeURIComponent(email) + "%0D%0A%0D%0A" + decodeURIComponent(message);
      window.location.href = "mailto:REPLACE_WITH_YOUR_EMAIL@example.com?subject=" + subject + "&body=" + body;
    });
  }
});
