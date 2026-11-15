

// --- Modal de obras (Bootstrap Modal) ---------------------------------------
const artModalEl = document.getElementById('artModal');
const artModal = artModalEl ? bootstrap.Modal.getOrCreateInstance(artModalEl) : null;

function openArtModal(title, description, imgUrl) {
  if (!artModal) return;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalDesc').textContent = description;
  const img = document.getElementById('modalImage');
  img.src = imgUrl;
  img.alt = title;
  artModal.show();
}

function closeArtModal() {
  if (artModal) artModal.hide();
}

// Cerrar al hacer clic en el fondo (como en el diseño original)
if (artModalEl) {
  artModalEl.addEventListener('click', (e) => {
    if (e.target === artModalEl) closeArtModal();
  });
}

// --- Formulario de contacto (envío real con Web3Forms + confeti) -------------
async function handleContactSubmit(event) {
  event.preventDefault();
  const form = document.getElementById('contactForm');
  const toast = document.getElementById('formSuccessToast');
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const originalHtml = submitBtn ? submitBtn.innerHTML : '';

  const formData = new FormData(form);

  if (submitBtn) {
    submitBtn.innerHTML = '<i class="fa-regular fa-paper-plane"></i> Enviando...';
    submitBtn.disabled = true;
  }

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (response.ok && data.success) {
      if (toast) toast.classList.remove('hidden');
      form.reset();
      burstConfetti();
      if (toast) {
        setTimeout(() => toast.classList.add('hidden'), 5000);
      }
    } else {
      alert('Error: ' + (data && data.message ? data.message : 'No se pudo enviar el mensaje.'));
    }
  } catch (error) {
    alert('Algo salió mal. Por favor intenta de nuevo.');
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = originalHtml;
      submitBtn.disabled = false;
    }
  }
}

// Explosión de confeti al enviar (canvas-confetti, con paleta de marca)
function burstConfetti() {
  if (typeof confetti !== 'function') return;
  const palette = ['#f5a6b7', '#76a1c1', '#fed7e2', '#ffffff', '#88b3d0', '#f38da3'];
  confetti({ particleCount: 150, spread: 85, startVelocity: 45, origin: { x: 0.5, y: 0.65 }, colors: palette });
  setTimeout(() => confetti({ particleCount: 90, angle: 60, spread: 60, origin: { x: 0, y: 0.7 }, colors: palette }), 250);
  setTimeout(() => confetti({ particleCount: 90, angle: 120, spread: 60, origin: { x: 1, y: 0.7 }, colors: palette }), 400);
}


function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  const bar = pre.querySelector('.preloader-bar span');
  const wings = pre.querySelectorAll('.pg-wing');
  if (window.anime) {
    anime({ targets: wings, scaleX: [1, 0.25, 1], duration: 380, loop: true, easing: 'easeInOutSine' });
  }
  if (window.Typed) {
    new Typed('.preloader-text', {
      strings: ['cargando...', 'esperando...'],
      typeSpeed: 42,
      backSpeed: 24,
      backDelay: 300,
      loop: false,
      onComplete: () => {
        if (bar) bar.style.width = '100%';
        setTimeout(() => {
          if (window.gsap) {
            gsap.to(pre, { opacity: 0, duration: 0.6, onComplete: () => pre.classList.add('is-done') });
          } else {
            pre.classList.add('is-done');
          }
        }, 250);
      }
    });
  } else {
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + Math.random() * 12 + 4);
      if (bar) bar.style.width = p + '%';
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => pre.classList.add('is-done'), 300);
      }
    }, 140);
  }
}

// --- Partículas en hero -----------------------------------------------------
function initParticles() {
  if (!window.particlesJS || !document.getElementById('hero-particles')) return;
  particlesJS('hero-particles', {
    particles: {
      number: { value: 70, density: { enable: true, value_area: 900 } },
      color: { value: ['#f5a6b7', '#76a1c1', '#fed7e2', '#ffffff'] },
      shape: { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: '#f5a6b7', opacity: 0.18, width: 1 },
      move: { enable: true, speed: 1.1, direction: 'none', random: true, straight: false, out_mode: 'out' }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes: { grab: { distance: 170, line_linked: { opacity: 0.4 } }, push: { particles_nb: 3 } }
    },
    retina_detect: true
  });
}

// --- GSAP ScrollTrigger: parallax + reveals + skill bars ---------------------
function initGsap() {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  const glow = document.querySelector('.hero-glow');
  if (glow) {
    gsap.to(glow, { yPercent: 40, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  gsap.utils.toArray('.skill-fill').forEach((el) => {
    const w = el.style.width;
    el.style.width = '0%';
    gsap.to(el, { width: w, duration: 1.3, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 92%' } });
  });
  const photo = document.querySelector('.photo-frame');
  if (photo) {
    gsap.from(photo, { scale: 0.75, opacity: 0, duration: 1, ease: 'back.out(1.7)', scrollTrigger: { trigger: photo, start: 'top 82%' } });
  }
  gsap.utils.toArray('.scalloped-container').forEach((el) => {
    gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
}

// --- Botones magnéticos -----------------------------------------------------
function initMagnetic() {
  document.querySelectorAll('.btn-pill-pink, .btn-pill-blue, .btn-pill').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = 'translate(' + x * 0.22 + 'px,' + y * 0.22 + 'px)';
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

function initOfflineOverlay() {
  if (document.getElementById('offlineOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'offlineOverlay';
  overlay.className = 'offline-overlay';
  overlay.innerHTML =
    '<div class="offline-inner">' +
    '<svg class="offline-butterfly" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
    '<linearGradient id="offA" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="var(--brand-pink-light)"/><stop offset=".5" stop-color="var(--brand-pink)"/><stop offset="1" stop-color="var(--brand-blue-light)"/></linearGradient>' +
    '<linearGradient id="offB" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--brand-blue-muted)"/><stop offset="1" stop-color="var(--brand-pink-mid)"/></linearGradient>' +
    '</defs>' +
    '<g class="off-wing off-wing-l"><path d="M32 30 C18 8 2 10 6 26 C8 36 22 34 32 32 Z" fill="url(#offA)"/><path d="M32 34 C22 40 10 52 20 56 C30 60 34 46 33 37 Z" fill="url(#offB)"/></g>' +
    '<g class="off-wing off-wing-r"><path d="M32 30 C46 8 62 10 58 26 C56 36 42 34 32 32 Z" fill="url(#offA)"/><path d="M32 34 C42 40 54 52 44 56 C34 60 30 46 31 37 Z" fill="url(#offB)"/></g>' +
    '<g class="off-body"><ellipse cx="32" cy="33" rx="2.3" ry="13" fill="var(--brand-pink-light)"/><path d="M31 21 C27 13 24 10 22 9" stroke="var(--brand-pink-light)" stroke-width="1.4" fill="none"/><path d="M33 21 C37 13 40 10 42 9" stroke="var(--brand-pink-light)" stroke-width="1.4" fill="none"/><circle cx="22" cy="9" r="1.7" fill="var(--brand-pink-light)"/><circle cx="42" cy="9" r="1.7" fill="var(--brand-pink-light)"/></g>' +
    '</svg>' +
    '<div class="offline-text">Sin conexión<span class="typed-cursor">|</span></div>' +
    '<div class="offline-sub">esperando wifi...</div>' +
    '</div>';
  document.body.appendChild(overlay);

  function setWingsAnimating(on) {
    if (!window.anime) return;
    const wings = overlay.querySelectorAll('.off-wing');
    anime.remove(wings);
    if (on) {
      anime({ targets: wings, scaleX: [1, 0.18, 1], duration: 320, loop: true, easing: 'easeInOutSine' });
    }
  }

  let checking = false;
  async function checkConnectivity() {
    if (!navigator.onLine) return false;
    try {
      const res = await fetch('js/theme-init.js?_t=' + Date.now(), { cache: 'no-store', method: 'GET' });
      return !!res && res.ok;
    } catch (e) {
      return false;
    }
  }
  async function update() {
    if (checking) return;
    checking = true;
    const online = await checkConnectivity();
    checking = false;
    if (!online) {
      overlay.classList.add('is-active');
      setWingsAnimating(true);
    } else {
      overlay.classList.remove('is-active');
      setWingsAnimating(false);
    }
  }
  window.addEventListener('offline', update);
  window.addEventListener('online', update);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) update(); });
  setInterval(update, 12000);
  update();
}

// --- Selector de color (banderitas laterales) ------------------------------
function initThemeSwitcher() {
  const themes = [
    { pink: '#f5a6b7', light: '#fed7e2', mid: '#f38da3', dark: '#d9778f', sobremi: '#fa6f8d' },
    { pink: '#fed7e2', light: '#ffe3ec', mid: '#f5a6b7', dark: '#d9778f', sobremi: '#f38da3' },
    { pink: '#edf0e6', light: '#f7f9f2', mid: '#c5dedd', dark: '#a1c2d9', sobremi: '#edf0e6' },
    { pink: '#c5dedd', light: '#edf0e6', mid: '#a1c2d9', dark: '#73a4b6', sobremi: '#c5dedd' },
    { pink: '#73a4b6', light: '#c5dedd', mid: '#355f88', dark: '#203c57', sobremi: '#73a4b6' },
    { pink: '#355f88', light: '#73a4b6', mid: '#2d5275', dark: '#203c57', sobremi: '#355f88' }
  ];

  const swatches = document.querySelectorAll('.swatch-bar, .swatch-bar-right');
  swatches.forEach((el, i) => {
    const idx = i % themes.length;
    el.dataset.theme = String(idx);
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Tema ' + (idx + 1));
  });

  function isLight(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.75;
  }
  function isPillLight(hex) {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16) / 255;
    const g = parseInt(h.slice(2, 4), 16) / 255;
    const b = parseInt(h.slice(4, 6), 16) / 255;
    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return lum > 0.5;
  }

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h, 16);
    return ((n >> 16) & 255) + ', ' + ((n >> 8) & 255) + ', ' + (n & 255);
  }

  function applyTheme(idx) {
    const t = themes[idx];
    if (!t) return;
    const root = document.documentElement;
    root.style.setProperty('--brand-pink', t.pink);
    root.style.setProperty('--brand-pink-light', t.light);
    root.style.setProperty('--brand-pink-mid', t.mid);
    root.style.setProperty('--brand-pink-dark', t.dark);
    root.style.setProperty('--brand-pink-sobremi', t.sobremi);
    root.style.setProperty('--brand-pink-rgb', hexToRgb(t.pink));
    root.style.setProperty('--brand-on-pink', isLight(t.pink) ? '#1a1a1a' : '#ffffff');
    root.style.setProperty('--brand-pill-text', isPillLight(t.pink) ? '#0f172a' : '#ffffff');
    localStorage.setItem('theme-index', String(idx));
    swatches.forEach((el) => {
      el.classList.toggle('is-active', Number(el.dataset.theme) === idx);
    });
  }

  swatches.forEach((el) => {
    const handler = () => applyTheme(Number(el.dataset.theme));
    el.addEventListener('click', handler);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
    });
  });

  const saved = localStorage.getItem('theme-index');
  const initial = saved !== null ? Number(saved) : 0;
  applyTheme(initial);
}

function initAnimations() {
  initThemeSwitcher();
  initPreloader();
  initOfflineOverlay();
  initParticles();
  initMagnetic();
  // ---------- Galerías de Arte 2D y 3D: abrir el modal desde cada tarjeta --
  const bindArtModal = (selector, fallbackTitle) => {
    document.querySelectorAll(selector).forEach((tile) => {
      tile.addEventListener('click', () => {
        openArtModal(
          tile.dataset.artTitle || fallbackTitle,
          tile.dataset.artDesc || '',
          tile.dataset.artImg
        );
      });
    });
  };

  bindArtModal('.art2d-tile[data-art-img]', 'Obra de Arte 2D');
  bindArtModal('.art3d-preview[data-art-img]', 'Proyecto 3D');
  bindArtModal('.art3d-extra-media[data-art-img]', 'Proyecto 3D');
  bindArtModal('.av-slide-hit[data-art-img]', 'Imágenes Editadas');
  bindArtModal('.trad-slide-hit[data-art-img]', 'Arte Tradicional');
  bindArtModal('.trad-feature-hit[data-art-img]', 'Arte Tradicional');

  // ---------- AOS: asignar data-aos + retrasos y luego inicializar ----------
  if (window.AOS) {
    // Reveal simple con retardo incremental
    const reveal = (sel, effect, baseDelay = 0, step = 0) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.setAttribute('data-aos', effect);
        el.setAttribute('data-aos-delay', String(baseDelay + i * step));
      });
    };

    // Cabeceras y títulos (evita anidar dentro de .banner-badge)
    reveal('.banner-badge', 'zoom-in', 0, 0);
    document.querySelectorAll('.banner-title').forEach((el) => {
      if (!el.closest('.banner-badge')) {
        el.setAttribute('data-aos', 'fade-up');
      }
    });
    reveal('.section-heading', 'fade-up', 0, 0);
    reveal('.pill-title', 'fade-right', 0, 80);
    reveal('.feature-line', 'fade-up', 100, 0);

    // Tarjetas y paneles de texto
    reveal('.bio-card, .skills-card', 'fade-up', 150, 150);
    reveal('.contact-card, .info-box', 'fade-up', 100, 120);
    reveal('.bg-brand-cardDark', 'fade-left', 200, 0);

    // Galerías: tilt en la caja interior + reveal (zoom) en su columna envoltorio
    document.querySelectorAll('.wireframe-box.cursor-pointer, a.wireframe-box').forEach((box) => {
      box.setAttribute('data-tilt', '');
      const col = box.closest('[class*="col-"]');
      if (col && !col.hasAttribute('data-aos')) {
        const sibs = Array.prototype.indexOf.call(col.parentElement.children, col);
        col.setAttribute('data-aos', 'zoom-in-up');
        col.setAttribute('data-aos-delay', String(Math.min(Math.max(sibs, 0), 5) * 100));
      }
    });

    // Marco de foto de "Sobre Mí" (tilt, sin reveal para evitar conflicto)
    document.querySelectorAll('.photo-frame').forEach((el) => el.setAttribute('data-tilt', ''));

    AOS.init({
      duration: 850,
      easing: 'ease-out-cubic',
      once: true,
      offset: 90,
      disable: false
    });
    AOS.refresh();
  }
  initGsap();

  // ---------- VanillaTilt: inclinación 3D en cajas interactivas ------------
  if (window.VanillaTilt) {
    const tiltEls = document.querySelectorAll('[data-tilt]');
    if (tiltEls.length) {
      VanillaTilt.init(tiltEls, {
        max: 8,
        speed: 450,
        perspective: 1200,
        scale: 1.02,
        glare: true,
        'max-glare': 0.22,
        easing: 'cubic-bezier(.03,.98,.52,.99)'
      });
    }
  }

  // ---------- Anime.js: entrada del hero + respiración del glow (índice) ---
  if (window.anime && document.querySelector('.hero-title')) {
    anime
      .timeline({ easing: 'easeOutExpo', autoplay: true })
      .add({ targets: '.hero-title', opacity: [0, 1], translateY: [60, 0], scale: [0.92, 1], duration: 950 }, 0)
      .add({ targets: '.hero-subtitle', opacity: [0, 1], translateY: [40, 0], letterSpacing: ['0.5em', '0.02em'], duration: 850 }, 250)
      .add({ targets: '.hero-desc', opacity: [0, 1], translateY: [30, 0], duration: 800 }, 450)
      .add(
        { targets: '.hero-actions a', opacity: [0, 1], translateY: [26, 0], scale: [0.9, 1], delay: anime.stagger(130), duration: 700 },
        650
      );

    // Respiración del resplandor rosa detrás de la mariposa
    if (document.querySelector('.hero-glow')) {
      anime({
        targets: '.hero-glow',
        scale: [1, 1.22],
        opacity: [0.55, 1],
        duration: 3600,
        easing: 'easeInOutSine',
        loop: true,
        direction: 'alternate'
      });
    }
  }

  // Cursor personalizado: mariposa
  initButterflyCursor();
}

// --- Cursor personalizado: mariposa que sigue al puntero -------------------
function initButterflyCursor() {
  // Solo en dispositivos con ratón/precisión; en móvil no tiene sentido.
  const fine = window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!fine) return;

  const svg =
    '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">' +
    '<defs>' +
    '<linearGradient id="bfA" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="var(--brand-pink-light)"/><stop offset=".5" stop-color="var(--brand-pink)"/><stop offset="1" stop-color="var(--brand-blue-light)"/>' +
    '</linearGradient>' +
    '<linearGradient id="bfB" x1="1" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="var(--brand-blue-muted)"/><stop offset="1" stop-color="var(--brand-pink-mid)"/>' +
    '</linearGradient>' +
    '</defs>' +
    '<g class="bf-wing bf-wing-l">' +
    '<path d="M32 30 C18 8 2 10 6 26 C8 36 22 34 32 32 Z" fill="url(#bfA)"/>' +
    '<path d="M32 34 C22 40 10 52 20 56 C30 60 34 46 33 37 Z" fill="url(#bfB)"/>' +
    '</g>' +
    '<g class="bf-wing bf-wing-r">' +
    '<path d="M32 30 C46 8 62 10 58 26 C56 36 42 34 32 32 Z" fill="url(#bfA)"/>' +
    '<path d="M32 34 C42 40 54 52 44 56 C34 60 30 46 31 37 Z" fill="url(#bfB)"/>' +
    '</g>' +
    '<g class="bf-body">' +
    '<ellipse cx="32" cy="33" rx="2.3" ry="13" fill="var(--brand-dark)"/>' +
    '<path d="M31 21 C27 13 24 10 22 9" stroke="var(--brand-dark)" stroke-width="1.4" fill="none"/>' +
    '<path d="M33 21 C37 13 40 10 42 9" stroke="var(--brand-dark)" stroke-width="1.4" fill="none"/>' +
    '<circle cx="22" cy="9" r="1.7" fill="var(--brand-dark)"/><circle cx="42" cy="9" r="1.7" fill="var(--brand-dark)"/>' +
    '</g></svg>';

  const glow = document.createElement('div');
  glow.className = 'cursor-glow';
  const cur = document.createElement('div');
  cur.className = 'cursor-butterfly';
  cur.innerHTML = svg;
  document.body.appendChild(glow);
  document.body.appendChild(cur);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let bx = mx, by = my, gx = mx, gy = my; // posiciones suavizadas (butterfly / glow)
  let rot = 0, visible = false, overText = false, hover = false;

  function onMove(e) {
    mx = e.clientX;
    my = e.clientY;
    if (!visible) { visible = true; bx = mx; by = my; gx = mx; gy = my; show(); }
    const t = e.target;
    const q = (s) => t && t.closest && t.closest(s);
    overText = !!q('input, textarea, [contenteditable="true"]');
    const inter = !!q('a, button, [onclick], .btn, .wireframe-box, [role="button"]');
    if (inter !== hover) { hover = inter; cur.classList.toggle('is-hover', hover); }
  }

  function show() { if (visible) document.documentElement.classList.add('has-butterfly-cursor'); }
  function hide() { document.documentElement.classList.remove('has-butterfly-cursor'); visible = false; }

  window.addEventListener('mousemove', onMove, { passive: true });
  document.addEventListener('mouseleave', hide);
  document.addEventListener('mouseenter', show);
  window.addEventListener('blur', hide);
  window.addEventListener('focus', show);
  show();

  (function tick() {
    bx += (mx - bx) * 0.3;
    by += (my - by) * 0.3;
    gx += (mx - gx) * 0.12;
    gy += (my - gy) * 0.12;
    // inclinación según la dirección del movimiento
    const target = Math.max(-28, Math.min(28, (mx - bx) * 5));
    rot += (target - rot) * 0.15;

    cur.style.transform = 'translate3d(' + bx + 'px,' + by + 'px,0) rotate(' + rot + 'deg)';
    glow.style.transform = 'translate3d(' + gx + 'px,' + gy + 'px,0)';
    const op = visible && !overText ? '1' : '0';
    cur.style.opacity = op;
    glow.style.opacity = op;

    requestAnimationFrame(tick);
  })();
}

// --- Arranque ---------------------------------------------------------------
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations);
} else {
  initAnimations();
}

// --- Service Worker (offline support) ---------------------------------------
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}
