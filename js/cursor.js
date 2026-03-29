/* ═══════════════════════════════════════
   CURSOR — Custom Cursor + Magnetic Effect
   ═══════════════════════════════════════ */
(function () {
  'use strict';

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  // Check for touch device
  if ('ontouchstart' in window) return;

  let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    dot.style.left = cursorX - 3 + 'px';
    dot.style.top = cursorY - 3 + 'px';
  });

  function animateRing() {
    ringX += (cursorX - ringX) * 0.12;
    ringY += (cursorY - ringY) * 0.12;
    ring.style.left = ringX - 18 + 'px';
    ring.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverEls = document.querySelectorAll(
    'a, button, input, textarea, .skill-card, .tilt-card, .glow-card, .social-icon, .dock-item, .marquee-item, .tool-item, .soft-pill'
  );
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.classList.add('hovering');
      ring.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot.classList.remove('hovering');
      ring.classList.remove('hovering');
    });
  });

  // ── Magnetic Button Effect ──
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-glow, .nav-resume');
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();
