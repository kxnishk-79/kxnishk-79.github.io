/* ═══════════════════════════════════════
   PROFILE CARD — 3D Tilt + Parallax Photo
   ReactBits-exact behavior
   ═══════════════════════════════════════ */

(function() {
  const wrapper = document.querySelector('.profile-card-wrapper');
  const card = document.querySelector('.profile-card');
  if (!wrapper || !card) return;

  const photo = card.querySelector('.profile-card-photo');
  const shine = card.querySelector('.profile-card-shine');
  const glow = wrapper.querySelector('.profile-card-glow');

  let bounds;
  let currentRx = 0, currentRy = 0;
  let targetRx = 0, targetRy = 0;

  function updateBounds() {
    bounds = card.getBoundingClientRect();
  }

  wrapper.addEventListener('mouseenter', updateBounds);

  wrapper.addEventListener('mousemove', (e) => {
    if (!bounds) updateBounds();

    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;
    const centerX = bounds.width / 2;
    const centerY = bounds.height / 2;

    // Tilt
    targetRx = ((y - centerY) / centerY) * -12;
    targetRy = ((x - centerX) / centerX) * 12;

    // Photo parallax
    if (photo) {
      const px = ((x - centerX) / centerX) * 8;
      const py = ((y - centerY) / centerY) * 5;
      photo.style.setProperty('--px', px + 'px');
      photo.style.setProperty('--py', py + 'px');
    }

    // Shine + glow follow
    const mx = (x / bounds.width) * 100;
    const my = (y / bounds.height) * 100;
    card.style.setProperty('--mx', mx + '%');
    card.style.setProperty('--my', my + '%');
    if (glow) {
      glow.style.setProperty('--mx', mx + '%');
      glow.style.setProperty('--my', my + '%');
    }
  });

  wrapper.addEventListener('mouseleave', () => {
    targetRx = 0;
    targetRy = 0;
    if (photo) {
      photo.style.setProperty('--px', '0px');
      photo.style.setProperty('--py', '0px');
    }
  });

  // Smooth spring loop
  function tick() {
    currentRx += (targetRx - currentRx) * 0.12;
    currentRy += (targetRy - currentRy) * 0.12;
    card.style.setProperty('--rx', currentRx.toFixed(2) + 'deg');
    card.style.setProperty('--ry', currentRy.toFixed(2) + 'deg');
    requestAnimationFrame(tick);
  }
  tick();

  /* ═══ TYPED TEXT EFFECT ═══ */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const words = ['ML Models', 'Flutter Apps', 'Data Pipelines', 'Smart Solutions'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeLoop() {
      const word = words[wordIndex];

      if (!isDeleting) {
        typedEl.textContent = word.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === word.length) {
          isDeleting = true;
          setTimeout(typeLoop, 2000);
          return;
        }
      } else {
        typedEl.textContent = word.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }
      setTimeout(typeLoop, isDeleting ? 50 : 100);
    }
    typeLoop();
  }
})();
