/* =========================================
   Awdiya — Main JavaScript
   ========================================= */

(function () {
  'use strict';

  // ── Theme toggle (#3 fix: inverted logic) ──
  var themeBtn = document.querySelector('.theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var html = document.documentElement;
      var current = html.getAttribute('data-theme');
      var next;

      if (current === 'dark') {
        next = 'light';
      } else if (current === 'light') {
        next = 'dark';
      } else {
        // No explicit theme — toggle opposite of system preference
        var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        next = systemDark ? 'light' : 'dark';
      }

      html.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
      var arLabel = next === 'dark' ? 'التبديل إلى الوضع الفاتح' : 'التبديل إلى الوضع الداكن';
      var enLabel = next === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeBtn.setAttribute('aria-label', document.documentElement.lang === 'ar' ? arLabel : enLabel);
    });
  }

  // ── Smooth scrolling ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu();
      target.scrollIntoView({ behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });

  // ── Mobile navigation (#4 fix: null checks) ──
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.classList.remove('open');
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function () {
      var isOpen = navToggle.classList.toggle('open');
      navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      if (isOpen) {
        var firstLink = navMenu.querySelector('.nav-link');
        if (firstLink) firstLink.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        closeMenu();
        navToggle.focus();
      }
    });
  }

  // ── Scroll throttle helper (#7 fix) ──
  var ticking = false;
  function onScrollThrottled() {
    if (!ticking) {
      requestAnimationFrame(function () {
        onScroll();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  // ── Parallax hero background (#7 fix: merged into throttled scroll) ──
  var heroBg = document.querySelector('.hero-bg');
  var particles = document.querySelector('.hero-particles');
  var mobileQuery = window.matchMedia('(max-width: 768px)');
  var isMobile = mobileQuery.matches;
  mobileQuery.addEventListener('change', function (e) { isMobile = e.matches; });

  // ── Header scroll + scroll progress bar (#4 fix: null checks) ──
  var header = document.getElementById('header');
  var backToTop = document.getElementById('backToTop');
  var progressBar = document.getElementById('scrollProgress');

  function onScroll() {
    var scrollY = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle('scrolled', scrollY > 50);
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);
    if (progressBar && docHeight > 0) {
      progressBar.style.width = (scrollY / docHeight * 100) + '%';
    }
    if (!isMobile && heroBg && scrollY < window.innerHeight) {
      heroBg.style.transform = 'translateY(' + (scrollY * 0.3) + 'px) scale(1.05)';
      if (particles) particles.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
    }
  }

  window.addEventListener('scroll', onScrollThrottled);

  // ── Back to top (#4 fix: null check) ──
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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

  // ── Loader ──
  var loader = document.getElementById('loader');
  window.addEventListener('load', function () {
    document.body.classList.add('loaded');
    if (loader) {
      setTimeout(function () {
        loader.classList.add('hidden');
        loader.addEventListener('transitionend', function () { loader.remove(); }, { once: true });
      }, 300);
    }
  });


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
  var reveals = document.querySelectorAll('.section-header, .about-card, .solution-card, .project-card, .feature-item, .process-step, .tech-item, .faq-item, .contact-form, .contact-info, .cta-content');

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

  // ── FAQ accordion ──
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.faq-item.open').forEach(function (el) {
        el.classList.remove('open');
        el.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });
      // Toggle current
      if (!isOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── Cookie consent ──
  var cookieBanner = document.getElementById('cookieBanner');
  var cookieAccept = document.getElementById('cookieAccept');
  var cookieDecline = document.getElementById('cookieDecline');

  if (cookieBanner) {
    try {
      if (!localStorage.getItem('cookie-consent')) {
        cookieBanner.hidden = false;
      }
    } catch (e) {
      cookieBanner.hidden = false;
    }

    if (cookieAccept) {
      cookieAccept.addEventListener('click', function () {
        try { localStorage.setItem('cookie-consent', 'accepted'); } catch (e) {}
        cookieBanner.hidden = true;
      });
    }
    if (cookieDecline) {
      cookieDecline.addEventListener('click', function () {
        try { localStorage.setItem('cookie-consent', 'declined'); } catch (e) {}
        cookieBanner.hidden = true;
      });
    }
  }

  // ── Contact form validation (#4 fix: null check) ──
  var form = document.getElementById('contactForm');
  var formSuccess = document.getElementById('formSuccess');

  function showError(input, msg) {
    var error = input.parentElement.querySelector('.form-error');
    input.classList.add('invalid');
    if (error) error.textContent = msg;
  }

  function clearError(input) {
    if (!input) return;
    var error = input.parentElement.querySelector('.form-error');
    input.classList.remove('invalid');
    if (error) error.textContent = '';
  }

  var isAr = document.documentElement.lang === 'ar';

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var name = form.querySelector('#name');
      var email = form.querySelector('#email');
      var message = form.querySelector('#message');

      [name, email, message].forEach(clearError);

      if (!name.value.trim()) {
        showError(name, isAr ? 'يرجى إدخال اسمك.' : 'Please enter your name.');
        valid = false;
      }
      if (!email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value)) {
        showError(email, isAr ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email.');
        valid = false;
      }
      if (!message.value.trim()) {
        showError(message, isAr ? 'يرجى إدخال رسالتك.' : 'Please enter a message.');
        valid = false;
      }

      if (valid) {
        form.classList.add('form-sending');
        fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            _redirect: false,
            _gotcha: '',
            name: name.value.trim(),
            email: email.value.trim(),
            message: message.value.trim(),
            'cf-turnstile-response': form.querySelector('[name="cf-turnstile-response"]') ? form.querySelector('[name="cf-turnstile-response"]').value : ''
          })
        }).then(function (res) {
          form.classList.remove('form-sending');
          if (res.ok) {
            form.classList.add('form-hidden');
            if (formSuccess) {
              formSuccess.hidden = false;
              formSuccess.classList.add('form-success-animate');
            }
          } else {
            res.text().then(function (t) { console.error('Formspark error:', res.status, t); });
            alert(isAr ? 'حدث خطأ، يرجى المحاولة لاحقاً.' : 'Something went wrong. Please try again.');
          }
        }).catch(function (err) {
          form.classList.remove('form-sending');
          console.error('Fetch error:', err);
          alert(isAr ? 'حدث خطأ، يرجى المحاولة لاحقاً.' : 'Something went wrong. Please try again.');
        });
      }
    });

    form.querySelectorAll('input, textarea').forEach(function (input) {
      input.addEventListener('input', function () { clearError(this); });
    });
  }

  // ── Legal Modals (#5 fix: accessibility + focus trap) ──
  var lastFocusedEl = null;

  function openModal(modal) {
    lastFocusedEl = document.activeElement;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus the close button
    var closeBtn = modal.querySelector('.legal-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  document.querySelectorAll('[data-modal]').forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.preventDefault();
      var modal = document.getElementById(this.getAttribute('data-modal'));
      if (modal) openModal(modal);
    });
  });

  document.querySelectorAll('.legal-modal-overlay').forEach(function (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay || e.target.closest('.legal-modal-close')) {
        closeModal(overlay);
      }
    });

    // Focus trap
    overlay.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var focusable = overlay.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.legal-modal-overlay.active').forEach(function (m) {
        closeModal(m);
      });
    }
  });

})();
