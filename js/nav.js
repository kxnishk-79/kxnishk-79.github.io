/* ═══════════════════════════════════════
   NAV — Theme Toggle, Dock scroll,
   Smooth scrolling, Formspree
   ═══════════════════════════════════════ */

(function() {

  /* ═══ THEME TOGGLE ═══ */
  const toggle = document.getElementById('theme-toggle');
  const stored = localStorage.getItem('theme');

  function initTheme() {
    if (stored) {
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }
  initTheme();

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = (current === 'light') ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  /* ═══ NAVBAR SCROLL ═══ */
  const navbar = document.getElementById('navbar');
  const scrollProgress = document.getElementById('scroll-progress');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 60);
    if (scrollProgress) {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress.style.width = docH > 0 ? `${(scrollY / docH) * 100}%` : '0%';
    }
    const btt = document.getElementById('back-to-top');
    if (btt) btt.classList.toggle('visible', scrollY > 400);

    // Active section tracking
    updateActiveSection();
  });

  /* ═══ ACTIVE SECTION TRACKING ═══ */
  function updateActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const dockItems = document.querySelectorAll('.dock-item[href^="#"]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    let currentId = '';

    sections.forEach(section => {
      const top = section.offsetTop - 200;
      if (window.scrollY >= top) {
        currentId = section.getAttribute('id');
      }
    });

    dockItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === '#' + currentId);
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }

  /* ═══ HAMBURGER MENU ═══ */
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ═══ BACK TO TOP ═══ */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══ SMOOTH SCROLL for anchor links ═══ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ═══ FORMSPREE ═══ */
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const status = document.getElementById('form-status');
      const originalText = btn.innerHTML;

      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled = true;

      try {
        const res = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (status) { status.textContent = '✓ Message sent successfully!'; status.className = 'form-status success'; }
          form.reset();
        } else {
          throw new Error('Failed');
        }
      } catch (err) {
        if (status) { status.textContent = '✗ Something went wrong. Please try again.'; status.className = 'form-status error'; }
      }
      btn.innerHTML = originalText;
      btn.disabled = false;
    });
  }

  /* ═══ NUMBER TICKER ANIMATION ═══ */
  const counters = document.querySelectorAll('.ticker[data-target]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        let current = 0;
        const step = target / 40;
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target;
            clearInterval(timer);
          } else {
            el.textContent = Math.floor(current);
          }
        }, 40);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));

  /* ═══ FADE-IN ANIMATION on scroll ═══ */
  const fadeEls = document.querySelectorAll('[data-aos]');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
  fadeEls.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    const delay = el.getAttribute('data-aos-delay');
    if (delay) el.style.transitionDelay = delay + 'ms';
    fadeObserver.observe(el);
  });

  // Add aos-animate styles
  const style = document.createElement('style');
  style.textContent = '.aos-animate { opacity: 1 !important; transform: translateY(0) !important; }';
  document.head.appendChild(style);

})();
