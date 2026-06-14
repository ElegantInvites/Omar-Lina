/**
 * Lina & Omar — Fatiha Invitation
 * Premium Digital Invitation Scripts
 */

(function () {
  'use strict';

  /* =============================================
     i18n Translations
     ============================================= */
  const translations = {
    en: {
      'intro.received': 'You Have Received An Invitation',
      'intro.receivedAr': 'لديكم دعوة خاصة',
      'intro.open': 'Open Invitation',
      'card.preline': 'Together with their families',
      'card.message': 'are delighted to invite you to celebrate the reading of Al-Fatiha.',
      'card.messageAr': 'يتشرف لينا وعمر\nبدعوتكم لمشاركتهم\nقراءة الفاتحة',
      'details.title': 'Event Details',
      'details.dateLabel': 'Date',
      'details.dateValue': 'Saturday, July 12, 2026',
      'details.timeLabel': 'Time',
      'details.timeValue': '7:00 PM',
      'details.locationLabel': 'Location',
      'details.locationValue': 'The Grand Hall, Amman',
      'map.title': 'Location',
      'map.subtitle': 'We look forward to welcoming you',
      'map.open': 'Open Location',
      'footer.designed': 'Designed by Elegant Invites',
      'music.play': 'Play Music',
      'music.pause': 'Pause Music'
    },
    ar: {
      'intro.received': 'You Have Received An Invitation',
      'intro.receivedAr': 'لديكم دعوة خاصة',
      'intro.open': 'افتح الدعوة',
      'card.preline': 'Together with their families',
      'card.message': 'are delighted to invite you to celebrate the reading of Al-Fatiha.',
      'card.messageAr': 'يتشرف لينا وعمر\nبدعوتكم لمشاركتهم\nقراءة الفاتحة',
      'details.title': 'تفاصيل المناسبة',
      'details.dateLabel': 'التاريخ',
      'details.dateValue': 'السبت، ١٢ يوليو ٢٠٢٦',
      'details.timeLabel': 'الوقت',
      'details.timeValue': '٧:٠٠ مساءً',
      'details.locationLabel': 'الموقع',
      'details.locationValue': 'القاعة الكبرى، عمّان',
      'map.title': 'الموقع',
      'map.subtitle': 'نتطلع إلى استقبالكم',
      'map.open': 'فتح الموقع',
      'footer.designed': 'Designed by Elegant Invites',
      'music.play': 'تشغيل الموسيقى',
      'music.pause': 'إيقاف الموسيقى'
    }
  };

  /* =============================================
     DOM Elements
     ============================================= */
  const html = document.documentElement;
  const body = document.body;
  const introScreen = document.getElementById('introScreen');
  const invitationMain = document.getElementById('invitationMain');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelope = document.getElementById('envelope');
  const envelopeGlow = document.getElementById('envelopeGlow');
  const openBtn = document.getElementById('openInvitationBtn');
  const langToggle = document.getElementById('langToggle');
  const themeToggle = document.getElementById('themeToggle');
  const musicToggle = document.getElementById('musicToggle');
  const bgMusic = document.getElementById('bgMusic');
  const particlesCanvas = document.getElementById('particlesCanvas');
  const sparkleOverlay = document.getElementById('sparkleOverlay');

  let currentLang = localStorage.getItem('invitation-lang') || 'en';
  let currentTheme = localStorage.getItem('invitation-theme') || 'light';
  let isOpening = false;
  let isMusicPlaying = false;
  let particlesAnimId = null;

  /* =============================================
     Initialize
     ============================================= */
  function init() {
    applyLanguage(currentLang, false);
    applyTheme(currentTheme, false);
    bindEvents();
    initParticlesCanvas();

    if (typeof window._setParticlesIntensity === 'function') {
      window._setParticlesIntensity('ambient');
    }
  }

  function bindEvents() {
    openBtn.addEventListener('click', openInvitation);
    envelopeWrapper.addEventListener('click', openInvitation);
    envelopeWrapper.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openInvitation();
      }
    });

    langToggle.addEventListener('click', toggleLanguage);
    themeToggle.addEventListener('click', toggleTheme);
    musicToggle.addEventListener('click', toggleMusic);
  }

  /* =============================================
     Language
     ============================================= */
  function applyLanguage(lang, save) {
    currentLang = lang;
    const t = translations[lang];
    const dir = lang === 'ar' ? 'rtl' : 'ltr';

    html.setAttribute('lang', lang);
    html.setAttribute('dir', dir);
    body.setAttribute('dir', dir);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const key = el.getAttribute('data-i18n');
      if (t[key]) {
        if (el.classList.contains('card-message-ar')) {
          el.innerHTML = t[key].replace(/\n/g, '<br>');
        } else {
          el.textContent = t[key];
        }
      }
    });

    langToggle.querySelector('.lang-label').textContent = lang === 'en' ? 'ع' : 'EN';

    if (save !== false) {
      localStorage.setItem('invitation-lang', lang);
    }

    updateMusicLabel();
  }

  function toggleLanguage() {
    applyLanguage(currentLang === 'en' ? 'ar' : 'en');
  }

  /* =============================================
     Theme
     ============================================= */
  function applyTheme(theme, save) {
    currentTheme = theme;
    body.classList.remove('theme-light', 'theme-dark');
    body.classList.add('theme-' + theme);

    if (save !== false) {
      localStorage.setItem('invitation-theme', theme);
    }
  }

  function toggleTheme() {
    applyTheme(currentTheme === 'light' ? 'dark' : 'light');
  }

  /* =============================================
     Music
     ============================================= */
  function toggleMusic() {
    if (isMusicPlaying) {
      bgMusic.pause();
      isMusicPlaying = false;
      musicToggle.classList.remove('playing');
    } else {
      bgMusic.play().then(function () {
        isMusicPlaying = true;
        musicToggle.classList.add('playing');
      }).catch(function () {
        /* Audio file may be missing — fail silently */
      });
    }
    updateMusicLabel();
  }

  function updateMusicLabel() {
    const label = musicToggle.querySelector('.music-label');
    const t = translations[currentLang];
    label.textContent = isMusicPlaying ? t['music.pause'] : t['music.play'];
  }

  /* =============================================
     Envelope Opening Animation
     ============================================= */
  function openInvitation(e) {
    if (isOpening) return;
    if (e && e.target === openBtn) {
      e.stopPropagation();
    }

    isOpening = true;
    introScreen.classList.add('opening');

    envelopeGlow.classList.add('active');
    envelope.classList.add('opened');

    startSparkles();
    startParticles();

    setTimeout(function () {
      introScreen.classList.add('hidden-away');
      invitationMain.classList.remove('hidden');
      invitationMain.setAttribute('aria-hidden', 'false');

      requestAnimationFrame(function () {
        invitationMain.classList.add('visible');
      });

      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 900,
          easing: 'ease-out-cubic',
          once: true,
          offset: 60,
          disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
      }
    }, 3800);

    setTimeout(function () {
      introScreen.style.display = 'none';
    }, 5000);

    setTimeout(function () {
      if (typeof window._setParticlesIntensity === 'function') {
        window._setParticlesIntensity('ambient');
      }
    }, 4500);
  }

  /* =============================================
     Sparkles
     ============================================= */
  function startSparkles() {
    sparkleOverlay.classList.add('active');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2 - 40;

    for (let i = 0; i < 30; i++) {
      setTimeout(function () {
        createSparkle(centerX, centerY);
      }, i * 80);
    }

    setTimeout(function () {
      sparkleOverlay.classList.remove('active');
    }, 4000);
  }

  function createSparkle(cx, cy) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 120;
    sparkle.style.left = (cx + Math.cos(angle) * distance) + 'px';
    sparkle.style.top = (cy + Math.sin(angle) * distance) + 'px';
    sparkle.style.animationDuration = (1.5 + Math.random() * 1.5) + 's';
    sparkle.style.width = sparkle.style.height = (2 + Math.random() * 4) + 'px';
    sparkleOverlay.appendChild(sparkle);

    setTimeout(function () {
      sparkle.remove();
    }, 3000);
  }

  /* =============================================
     Floating Particles (Canvas)
     ============================================= */
  function initParticlesCanvas() {
    if (!particlesCanvas) return;

    const ctx = particlesCanvas.getContext('2d');
    let particles = [];
    let w, h;

    function resize() {
      w = particlesCanvas.width = window.innerWidth;
      h = particlesCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    function Particle() {
      this.reset = function () {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.size = Math.random() * 2.5 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.speedX = (Math.random() - 0.5) * 0.3;
        this.opacity = Math.random() * 0.5 + 0.2;
        this.color = Math.random() > 0.5 ? '232, 191, 203' : '215, 160, 178';
      };
      this.reset();
      this.y = h + Math.random() * h;
    }

    for (let i = 0; i < 50; i++) {
      particles.push(new Particle());
    }

    let intensity = 'idle';

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isActive = intensity !== 'idle';

      particles.forEach(function (p) {
        if (isActive) {
          const speedMult = intensity === 'burst' ? 1.8 : 0.6;
          p.y -= p.speedY * speedMult;
          p.x += p.speedX * speedMult;
          if (p.y < -10) {
            p.reset();
            p.y = h + 10;
          }
        }

        const alphaBase = intensity === 'burst' ? p.opacity : p.opacity * 0.35;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + p.color + ', ' + alphaBase + ')';
        ctx.fill();
      });

      particlesAnimId = requestAnimationFrame(draw);
    }

    draw();

    window._startInvitationParticles = function () {
      particlesCanvas.classList.add('active');
      intensity = 'burst';
    };

    window._setParticlesIntensity = function (mode) {
      particlesCanvas.classList.add('active');
      intensity = mode;
    };
  }

  function startParticles() {
    if (typeof window._startInvitationParticles === 'function') {
      window._startInvitationParticles();
    }
  }

  /* =============================================
     Boot
     ============================================= */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
