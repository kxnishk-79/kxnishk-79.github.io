/* ═══════════════════════════════════════
   ANIMATIONS — Text Scramble, Number Ticker,
   Flip Words, AOS, Hero Stagger
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  /* ─── TEXT SCRAMBLE — ReactBits / Decrypted style ─── */
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

  class TextScramble {
    constructor(el) {
      this.el = el;
      this.finalText = el.textContent;
      this.chars = CHARS;
      this.frameReq = null;
    }
    scramble() {
      const len = this.finalText.length;
      let iteration = 0;
      const speed = 30;
      const reveal = () => {
        let output = '';
        for (let i = 0; i < len; i++) {
          if (i < iteration) {
            output += this.finalText[i];
          } else {
            output += this.chars[Math.floor(Math.random() * this.chars.length)];
          }
        }
        this.el.textContent = output;
        if (iteration < len) {
          iteration += 0.5;
          this.frameReq = setTimeout(reveal, speed);
        }
      };
      reveal();
    }
  }

  // Init text scramble on scroll
  const scrambleEls = document.querySelectorAll('.scramble-text');
  const scrambleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sc = new TextScramble(entry.target);
        sc.scramble();
        scrambleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  scrambleEls.forEach(el => scrambleObserver.observe(el));

  /* ─── FLIP WORDS / TYPED — Aceternity style ─── */
  const typedEl = document.getElementById('typed-role');
  if (typedEl) {
    const roles = [
      'Machine Learning Engineer',
      'Flutter Developer',
      'Data Analyst',
      'Full-Stack Developer',
      'Problem Solver'
    ];
    let roleIdx = 0, charIdx = 0, isDeleting = false;

    function typeLoop() {
      const current = roles[roleIdx];
      if (!isDeleting) {
        typedEl.textContent = current.substring(0, charIdx + 1);
        charIdx++;
        if (charIdx === current.length) {
          isDeleting = true;
          setTimeout(typeLoop, 2200);
          return;
        }
        setTimeout(typeLoop, 70);
      } else {
        typedEl.textContent = current.substring(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          isDeleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(typeLoop, 300);
          return;
        }
        setTimeout(typeLoop, 35);
      }
    }
    setTimeout(typeLoop, 1000);
  }

  /* ─── NUMBER TICKER — MagicUI style ─── */
  const tickers = document.querySelectorAll('.number-ticker');
  const tickerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const start = performance.now();

        function ease(t) {
          return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function tick(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.round(ease(progress) * target);
          el.textContent = value;

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(tick);
        tickerObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  tickers.forEach(el => tickerObserver.observe(el));

  /* ─── AOS (Animate On Scroll) ─── */
  const aosEls = document.querySelectorAll('[data-aos]');
  const aosObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-in');
        }, parseInt(delay, 10));
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  aosEls.forEach(el => aosObserver.observe(el));

  /* ─── HERO STAGGER ANIMATION ─── */
  window.addEventListener('load', () => {
    const heroEls = document.querySelectorAll(
      '.hero-badge, .hero-heading, .hero-role, .hero-desc, .hero-ctas, .hero-visual'
    );
    heroEls.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = `opacity 0.7s ease ${i * 0.12 + 0.2}s, transform 0.7s ease ${i * 0.12 + 0.2}s`;
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        });
      });
    });
  });

  /* ─── TEXT GENERATE EFFECT — Words fade in one by one ─── */
  const genEls = document.querySelectorAll('.text-generate');
  genEls.forEach(el => {
    const text = el.textContent;
    const words = text.split(' ');
    el.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.opacity = '0';
      span.style.display = 'inline-block';
      span.style.transition = `opacity 0.4s ease ${i * 0.05}s, transform 0.4s ease ${i * 0.05}s`;
      span.style.transform = 'translateY(8px)';
      el.appendChild(span);
    });

    const genObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.querySelectorAll('span').forEach(span => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
          });
          genObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    genObserver.observe(el);
  });

})();
