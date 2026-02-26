/* ===================================
   Bakerview West Business Park
   Scripts
   =================================== */

(function () {
  'use strict';

  // --- Navbar scroll effect ---
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // --- Mobile nav toggle ---
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  toggle.addEventListener('click', function () {
    links.classList.toggle('open');
  });

  // Close mobile nav on link click
  var navAnchors = links.querySelectorAll('a');
  navAnchors.forEach(function (anchor) {
    anchor.addEventListener('click', function () {
      links.classList.remove('open');
    });
  });

  // --- Active nav link on scroll ---
  var sections = document.querySelectorAll('.section, .hero');
  var navLinks = document.querySelectorAll('.nav-links a');

  function updateActiveNav() {
    var scrollPos = window.scrollY + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // --- Contact form handling ---
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Collect form data
      var formData = new FormData(form);
      var data = {};
      formData.forEach(function (value, key) {
        data[key] = value;
      });

      // Show success message
      var wrapper = form.parentElement;
      wrapper.innerHTML =
        '<div class="form-success">' +
        '<h3>Thank You</h3>' +
        '<p>Your inquiry has been received. We will be in touch shortly.</p>' +
        '</div>';

      // In production, replace the above with an actual form submission
      // e.g., fetch('/api/contact', { method: 'POST', body: JSON.stringify(data) })
    });
  }

  // --- Animate elements on scroll ---
  var observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe cards and key elements
  var animElements = document.querySelectorAll(
    '.stat-card, .feature, .property-card, .phase-card, .invest-card, .advantage'
  );
  animElements.forEach(function (el) {
    el.classList.add('animate-in');
    observer.observe(el);
  });
})();
