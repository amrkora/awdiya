/* =========================================
   Awdiya — Main JavaScript
   ========================================= */

(function () {
  'use strict';

  // ── Smooth scrolling ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ── Mobile navigation ──
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function closeMenu() {
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  document.addEventListener('click', function (e) {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      closeMenu();
    }
  });

  // ── Header scroll + scroll progress bar ──
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');
  var progressBar = document.getElementById('scrollProgress');

  function onScroll() {
    var scrollY = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', scrollY > 50);
    backToTop.classList.toggle('visible', scrollY > 600);
    if (progressBar && docHeight > 0) {
      progressBar.style.width = (scrollY / docHeight * 100) + '%';
    }
  }

  window.addEventListener('scroll', onScroll);

  // ── Back to top ──
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ── Active nav link on scroll ──
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    var scrollY = window.scrollY + 120;
    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
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

  // ── Hero entrance animation ──
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
  });

  // ── Parallax hero background ──
  var heroBg = document.querySelector('.hero-bg');
  var particles = document.querySelector('.hero-particles');
  var isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (!isMobile && heroBg) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(1.05)';
        if (particles) particles.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
      }
    });
  }

  // ── Floating particles in hero ──
  var particleContainer = document.querySelector('.hero-particles');
  if (particleContainer && !isMobile) {
    for (var i = 0; i < 30; i++) {
      var p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = Math.random() * 100 + '%';
      p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
      p.style.animationDuration = (Math.random() * 8 + 6) + 's';
      p.style.animationDelay = (Math.random() * 5) + 's';
      p.style.opacity = Math.random() * 0.4 + 0.1;
      particleContainer.appendChild(p);
    }
  }

  // ── Mouse glow on hero ──
  var heroGlow = document.querySelector('.hero-glow');
  var hero = document.querySelector('.hero');
  if (heroGlow && hero && !isMobile) {
    hero.addEventListener('mousemove', function (e) {
      var rect = hero.getBoundingClientRect();
      heroGlow.style.left = (e.clientX - rect.left) + 'px';
      heroGlow.style.top = (e.clientY - rect.top) + 'px';
    });
  }

  // ── Card tilt on hover ──
  document.querySelectorAll('.solution-card, .about-card').forEach(function (card) {
    if (isMobile) return;
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var centerX = rect.width / 2;
      var centerY = rect.height / 2;
      var rotateX = (y - centerY) / centerY * -4;
      var rotateY = (x - centerX) / centerX * 4;
      card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateY(-4px)';
    });
    card.addEventListener('mouseleave', function () {
      card.style.transform = '';
    });
  });

  // ── Magnetic button effect ──
  document.querySelectorAll('.btn-primary.btn-lg').forEach(function (btn) {
    if (isMobile) return;
    btn.addEventListener('mousemove', function (e) {
      var rect = btn.getBoundingClientRect();
      var x = e.clientX - rect.left - rect.width / 2;
      var y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)';
    });
    btn.addEventListener('mouseleave', function () {
      btn.style.transform = '';
    });
  });

  // ── Typed text effect on hero title ──
  var heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    var words = heroTitle.querySelectorAll('.text-reveal');
    words.forEach(function (word, i) {
      word.style.animationDelay = (0.3 + i * 0.12) + 's';
    });
  }

  // ── Scroll reveal animations ──
  var reveals = document.querySelectorAll('.section-header, .about-card, .solution-card, .feature-item, .contact-form, .contact-info');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(function (el) {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // ── Icon spin on hover ──
  document.querySelectorAll('.about-icon, .solution-icon, .feature-icon').forEach(function (icon) {
    icon.parentElement.addEventListener('mouseenter', function () {
      icon.classList.add('icon-animate');
    });
    icon.addEventListener('animationend', function () {
      icon.classList.remove('icon-animate');
    });
  });

  // ── Contact form validation ──
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function showError(input, msg) {
    var error = input.parentElement.querySelector('.form-error');
    input.classList.add('invalid');
    if (error) error.textContent = msg;
  }

  function clearError(input) {
    var error = input.parentElement.querySelector('.form-error');
    input.classList.remove('invalid');
    if (error) error.textContent = '';
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valid = true;
    var name = form.querySelector('#name');
    var email = form.querySelector('#email');
    var message = form.querySelector('#message');

    [name, email, message].forEach(clearError);

    if (!name.value.trim()) {
      showError(name, 'Please enter your name.');
      valid = false;
    }
    if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Please enter a valid email.');
      valid = false;
    }
    if (!message.value.trim()) {
      showError(message, 'Please enter a message.');
      valid = false;
    }

    if (valid) {
      form.classList.add('form-sending');
      setTimeout(function () {
        form.style.display = 'none';
        formSuccess.hidden = false;
        formSuccess.classList.add('form-success-animate');
      }, 800);
    }
  });

  form.querySelectorAll('input, textarea').forEach(function (input) {
    input.addEventListener('input', function () { clearError(this); });
  });

})();
