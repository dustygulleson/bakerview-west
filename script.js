/* ===================================
   Bakerview West Business Park
   Scripts — WCAG 2.2 Level AA
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

  // --- Mobile nav toggle (WCAG 4.1.2: aria-expanded) ---
  var toggle = document.getElementById('nav-toggle');
  var links = document.getElementById('nav-links');

  toggle.addEventListener('click', function () {
    var isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    toggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
  });

  // Close mobile nav on link click
  var navAnchors = links.querySelectorAll('a');
  navAnchors.forEach(function (anchor) {
    anchor.addEventListener('click', function () {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
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
          link.removeAttribute('aria-current');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'location');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);
  updateActiveNav();

  // --- Contact form is handled by Formsubmit.co ---
  // Submissions go to dusty@gulleson.com with CC to timcup21@gmail.com

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

  // --- Leaflet Property Map ---
  if (typeof L !== 'undefined' && document.getElementById('property-map')) {
    var map = L.map('property-map', {
      center: [48.78614, -122.51417],
      zoom: 16,
      scrollWheelZoom: false
    });

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19
    }).addTo(map);

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19
    }).addTo(map);

    var propertyBounds = [
      [48.78810, -122.51680],
      [48.78810, -122.51140],
      [48.78430, -122.51140],
      [48.78430, -122.51680]
    ];

    var propertyOutline = L.polygon(propertyBounds, {
      color: '#c4973b',
      weight: 3,
      fillColor: '#c4973b',
      fillOpacity: 0.15,
      dashArray: '8, 6'
    }).addTo(map);

    propertyOutline.bindPopup(
      '<strong style="font-size:14px;">Bakerview West Business Park</strong><br>' +
      '21-Acre Mixed-Use Development<br>' +
      '<em>Bellingham, WA</em>'
    );

    map.fitBounds(propertyOutline.getBounds().pad(0.3));

    map.on('click', function () {
      map.scrollWheelZoom.enable();
    });
  }

  // --- Exit Intent Popup (WCAG 2.1.1, 4.1.2: focus trap + Escape key) ---
  var popup = document.getElementById('exit-popup');
  var popupClose = document.getElementById('popup-close');
  var popupTriggered = localStorage.getItem('bakerviewPopupSeen');
  var lastFocusedElement = null;

  // Collect focusable elements within the popup
  function getFocusableElements(container) {
    return Array.from(container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    ));
  }

  function openPopup() {
    popup.style.display = 'flex';
    lastFocusedElement = document.activeElement;
    // Move focus to close button on open
    setTimeout(function () {
      popupClose.focus();
    }, 50);
  }

  function closePopup() {
    popup.style.display = 'none';
    // Return focus to the element that had it before opening
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  // Focus trap: constrain Tab / Shift+Tab inside popup (WCAG 2.1.2)
  popup.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closePopup();
      return;
    }

    if (e.key === 'Tab') {
      var focusable = getFocusableElements(popup);
      var first = focusable[0];
      var last = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  });

  if (popup && popupClose && !popupTriggered) {
    var checkExitIntent = function (e) {
      if (e.clientY < 15) {
        openPopup();
        localStorage.setItem('bakerviewPopupSeen', 'true');
        document.removeEventListener('mouseout', checkExitIntent);
      }
    };

    setTimeout(function () {
      document.addEventListener('mouseout', checkExitIntent);
    }, 3000);

    popupClose.addEventListener('click', closePopup);

    popup.addEventListener('click', function (e) {
      if (e.target === popup) {
        closePopup();
      }
    });
  }
})();
