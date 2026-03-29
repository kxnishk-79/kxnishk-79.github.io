/* ═══════════════════════════════════════
   EFFECTS — Decrypted Text, Click Spark,
   Splash Cursor, Border Glow, Meteors
   ═══════════════════════════════════════ */

(function() {

  /* ═══ DECRYPTED TEXT EFFECT ═══
     Characters scramble then resolve — hacker-style reveal */
  class DecryptedText {
    constructor(el) {
      this.el = el;
      this.finalText = el.getAttribute('data-text') || el.textContent;
      this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
      this.duration = parseInt(el.getAttribute('data-duration')) || 2000;
      this.started = false;

      // Scramble initially
      this.el.textContent = this.scramble(this.finalText.length);

      // Observe when in viewport
      const ob = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.started) {
            this.started = true;
            this.animate();
          }
        });
      }, { threshold: 0.5 });
      ob.observe(this.el);
    }

    scramble(len) {
      let s = '';
      for (let i = 0; i < len; i++) {
        s += this.chars[Math.floor(Math.random() * this.chars.length)];
      }
      return s;
    }

    animate() {
      const startTime = performance.now();
      const len = this.finalText.length;

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        const revealed = Math.floor(progress * len);

        let display = '';
        for (let i = 0; i < len; i++) {
          if (i < revealed) {
            display += this.finalText[i];
          } else {
            display += this.chars[Math.floor(Math.random() * this.chars.length)];
          }
        }
        this.el.textContent = display;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          this.el.textContent = this.finalText;
        }
      };
      requestAnimationFrame(tick);
    }
  }

  /* ═══ CLICK SPARK EFFECT ═══
     Sparks radiate from click point */
  const sparkCanvas = document.getElementById('click-spark-canvas');
  if (sparkCanvas) {
    const sCtx = sparkCanvas.getContext('2d');
    let sparks = [];

    function resizeSpark() {
      sparkCanvas.width = window.innerWidth;
      sparkCanvas.height = window.innerHeight;
    }
    resizeSpark();
    window.addEventListener('resize', resizeSpark);

    class Spark {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.02;
        this.size = Math.random() * 3 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.08; // gravity
        this.life -= this.decay;
        this.vx *= 0.98;
      }
      draw() {
        sCtx.save();
        sCtx.globalAlpha = this.life;
        sCtx.fillStyle = `hsl(${265 + Math.random() * 30}, 80%, ${60 + Math.random() * 20}%)`;
        sCtx.beginPath();
        sCtx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        sCtx.fill();
        sCtx.restore();
      }
    }

    document.addEventListener('click', (e) => {
      for (let i = 0; i < 16; i++) {
        sparks.push(new Spark(e.clientX, e.clientY));
      }
    });

    function sparkLoop() {
      sCtx.clearRect(0, 0, sparkCanvas.width, sparkCanvas.height);
      sparks = sparks.filter(s => s.life > 0);
      sparks.forEach(s => { s.update(); s.draw(); });
      requestAnimationFrame(sparkLoop);
    }
    sparkLoop();
  }

  /* ═══ SPLASH CURSOR — WebGL Fluid Simulation ═══
     Simplified fluid dynamics that follows the cursor */
  const splashCanvas = document.getElementById('splash-canvas');
  if (splashCanvas) {
    const gl = splashCanvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
    if (gl) {
      splashCanvas.width = window.innerWidth;
      splashCanvas.height = window.innerHeight;
      gl.viewport(0, 0, splashCanvas.width, splashCanvas.height);

      // Simplified fluid simulation using textured particles
      let mouseX = 0, mouseY = 0, prevMouseX = 0, prevMouseY = 0;
      let ripples = [];
      const maxRipples = 30;

      document.addEventListener('mousemove', (e) => {
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        mouseX = e.clientX;
        mouseY = e.clientY;

        const dx = mouseX - prevMouseX;
        const dy = mouseY - prevMouseY;
        const speed = Math.sqrt(dx * dx + dy * dy);

        if (speed > 2) {
          ripples.push({
            x: mouseX / splashCanvas.width,
            y: 1 - mouseY / splashCanvas.height,
            size: Math.min(speed * 0.003, 0.06),
            life: 1.0,
            hue: 270 + Math.random() * 40 - 20
          });
          if (ripples.length > maxRipples) ripples.shift();
        }
      });

      // Vertex shader
      const vsSource = `
        attribute vec2 a_position;
        void main() { gl_Position = vec4(a_position, 0, 1); }
      `;
      // Fragment shader — renders fluid-looking ripples
      const fsSource = `
        precision mediump float;
        uniform vec2 u_resolution;
        uniform float u_time;
        uniform vec2 u_ripples[30];
        uniform float u_sizes[30];
        uniform float u_lives[30];
        uniform float u_hues[30];
        uniform int u_count;

        vec3 hsl2rgb(float h, float s, float l) {
          float c = (1.0 - abs(2.0*l - 1.0)) * s;
          float x = c * (1.0 - abs(mod(h/60.0, 2.0) - 1.0));
          float m = l - c/2.0;
          vec3 rgb;
          if (h < 60.0) rgb = vec3(c,x,0);
          else if (h < 120.0) rgb = vec3(x,c,0);
          else if (h < 180.0) rgb = vec3(0,c,x);
          else if (h < 240.0) rgb = vec3(0,x,c);
          else if (h < 300.0) rgb = vec3(x,0,c);
          else rgb = vec3(c,0,x);
          return rgb + m;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution;
          vec4 color = vec4(0.0);
          for (int i = 0; i < 30; i++) {
            if (i >= u_count) break;
            float dist = distance(uv, u_ripples[i]);
            float r = u_sizes[i];
            float life = u_lives[i];
            if (dist < r) {
              float intensity = smoothstep(r, 0.0, dist) * life * 0.35;
              vec3 c = hsl2rgb(u_hues[i], 0.7, 0.55);
              color += vec4(c * intensity, intensity * 0.4);
            }
          }
          gl_FragColor = color;
        }
      `;

      function createShader(type, source) {
        const s = gl.createShader(type);
        gl.shaderSource(s, source);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          gl.deleteShader(s);
          return null;
        }
        return s;
      }

      const vs = createShader(gl.VERTEX_SHADER, vsSource);
      const fs = createShader(gl.FRAGMENT_SHADER, fsSource);

      if (vs && fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Full screen quad
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
        const aPos = gl.getAttribLocation(program, 'a_position');
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

        const uRes = gl.getUniformLocation(program, 'u_resolution');
        const uTime = gl.getUniformLocation(program, 'u_time');
        const uCount = gl.getUniformLocation(program, 'u_count');

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        function renderSplash() {
          gl.viewport(0, 0, splashCanvas.width, splashCanvas.height);
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform2f(uRes, splashCanvas.width, splashCanvas.height);
          gl.uniform1f(uTime, performance.now() * 0.001);
          gl.uniform1i(uCount, ripples.length);

          for (let i = 0; i < 30; i++) {
            const r = ripples[i] || { x: 0, y: 0, size: 0, life: 0, hue: 270 };
            gl.uniform2f(gl.getUniformLocation(program, `u_ripples[${i}]`), r.x, r.y);
            gl.uniform1f(gl.getUniformLocation(program, `u_sizes[${i}]`), r.size);
            gl.uniform1f(gl.getUniformLocation(program, `u_lives[${i}]`), r.life);
            gl.uniform1f(gl.getUniformLocation(program, `u_hues[${i}]`), r.hue);
          }

          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

          // Decay ripples
          ripples.forEach(r => {
            r.life -= 0.008;
            r.size += 0.0005;
          });
          ripples = ripples.filter(r => r.life > 0);

          requestAnimationFrame(renderSplash);
        }
        renderSplash();

        window.addEventListener('resize', () => {
          splashCanvas.width = window.innerWidth;
          splashCanvas.height = window.innerHeight;
        });
      }
    }
  }

  /* ═══ BORDER GLOW — Mouse follow on ALL glow-target cards ═══ */
  document.addEventListener('mousemove', (e) => {
    const glowTargets = document.querySelectorAll(
      '.border-glow-card, .skill-card, .timeline-content, .cert-card, .contact-form, .stat-item, .social-icon'
    );
    glowTargets.forEach(card => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--glow-x', x + 'px');
      card.style.setProperty('--glow-y', y + 'px');
    });
  });

  /* ═══ SPOTLIGHT — Follow mouse ═══ */
  const spotlight = document.getElementById('spotlight');
  if (spotlight) {
    document.addEventListener('mousemove', (e) => {
      spotlight.style.setProperty('--mouse-x', (e.clientX / window.innerWidth * 100) + '%');
      spotlight.style.setProperty('--mouse-y', (e.clientY / window.innerHeight * 100) + '%');
    });
  }

  /* ═══ METEORS — Periodic spawn ═══ */
  function spawnMeteor() {
    const m = document.createElement('div');
    m.className = 'meteor';
    m.style.height = (Math.random() * 150 + 50) + 'px';
    m.style.left = Math.random() * window.innerWidth + 'px';
    m.style.top = '-50px';
    m.style.animationDuration = (Math.random() * 2 + 1.5) + 's';
    document.body.appendChild(m);
    setTimeout(() => m.remove(), 4000);
  }
  setInterval(() => { if (Math.random() > 0.5) spawnMeteor(); }, 3000);

  /* ═══ INIT DECRYPTED TEXT ═══ */
  document.querySelectorAll('[data-decrypt]').forEach(el => new DecryptedText(el));

})();
