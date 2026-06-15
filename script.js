/* ═══════════════════════════════════════════════════
   MAA'S KITCHEN — script.js
   Interactive behaviour & animations
═══════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────────────
   1. PAGE LOADER
────────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero reveal after loader hides
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
  }, 1800);
});


/* ──────────────────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────────────────── */
const cursorDot  = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left  = mouseX + 'px';
  cursorDot.style.top   = mouseY + 'px';
});

// Smooth ring follow
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor scale on hover
document.querySelectorAll('a, button, .filter-btn, .card-btn, .slider-btn').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorDot.style.transform  = 'translate(-50%, -50%) scale(2.5)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1.4)';
    cursorRing.style.borderColor = 'var(--red)';
  });
  el.addEventListener('mouseleave', () => {
    cursorDot.style.transform  = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
    cursorRing.style.borderColor = 'var(--gold)';
  });
});


/* ──────────────────────────────────────────────────
   3. NAVBAR SCROLL BEHAVIOUR
────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* ──────────────────────────────────────────────────
   4. MOBILE HAMBURGER MENU
────────────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Close menu when a link is clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});


/* ──────────────────────────────────────────────────
   5. SMOOTH SCROLL for NAV LINKS
────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


/* ──────────────────────────────────────────────────
   6. INTERSECTION OBSERVER — Fade-in on scroll
────────────────────────────────────────────────── */
const observerOptions = {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
};

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, index) => {
    if (entry.isIntersecting) {
      // Stagger siblings
      const siblings = entry.target.parentElement.querySelectorAll('.fade-in');
      let delay = 0;
      siblings.forEach((sib, i) => {
        if (sib === entry.target) delay = i * 100;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      fadeObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));


/* ──────────────────────────────────────────────────
   7. ANIMATED COUNTER — Stats Section
────────────────────────────────────────────────── */
function animateCounter(el, target, duration = 1800) {
  let start    = 0;
  const step   = target / (duration / 16);
  const timer  = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString();
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('.stat-number');
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'), 10);
        animateCounter(counter, target);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);


/* ──────────────────────────────────────────────────
   8. MENU FILTER TABS
────────────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const menuCards  = document.querySelectorAll('.menu-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    menuCards.forEach((card, i) => {
      const category = card.getAttribute('data-category');
      const show     = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
          card.style.opacity    = '1';
          card.style.transform  = 'translateY(0)';
        }, i * 60);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ──────────────────────────────────────────────────
   9. TESTIMONIAL SLIDER
────────────────────────────────────────────────── */
const track    = document.getElementById('testimonialTrack');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
const dotsWrap = document.getElementById('sliderDots');

if (track) {
  const slides = track.querySelectorAll('.testimonial-card');
  let current  = 0;
  const total  = slides.length;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.classList.add('slider-dot');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  function updateDots() {
    document.querySelectorAll('.slider-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    updateDots();
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  // Keyboard nav
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') goTo(current - 1);
    if (e.key === 'ArrowRight') goTo(current + 1);
  });

  // Touch / swipe support
  let touchStartX = 0;
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      goTo(diff > 0 ? current + 1 : current - 1);
    }
  }, { passive: true });

  // Auto-play
  let autoPlay = setInterval(() => goTo(current + 1), 5000);
  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.parentElement.addEventListener('mouseleave', () => {
    autoPlay = setInterval(() => goTo(current + 1), 5000);
  });
}


/* ──────────────────────────────────────────────────
   10. ADD TO CART TOAST
────────────────────────────────────────────────── */
const cartToast = document.getElementById('cartToast');
const toastMsg  = document.getElementById('toastMsg');
let toastTimer  = null;

function addToCart(name, price) {
  toastMsg.textContent = `✦ ${name} — Rs. ${price} added!`;
  cartToast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    cartToast.classList.remove('show');
  }, 3000);
}

// Expose globally (called from HTML onclick)
window.addToCart = addToCart;


/* ──────────────────────────────────────────────────
   11. ORDER FORM SUBMISSION
────────────────────────────────────────────────── */
function submitOrder() {
  const name    = document.getElementById('formName').value.trim();
  const phone   = document.getElementById('formPhone').value.trim();
  const address = document.getElementById('formAddress').value.trim();
  const dish    = document.getElementById('formDish').value;

  if (!name || !phone || !address || !dish) {
    // Shake effect on empty fields
    ['formName','formPhone','formAddress','formDish'].forEach(id => {
      const el = document.getElementById(id);
      if (!el.value.trim() && el.id !== 'formNote') {
        el.style.borderColor = 'var(--red)';
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => {
          el.style.animation = '';
          el.style.borderColor = '';
        }, 500);
      }
    });
    return;
  }

  // Show success modal
  document.getElementById('modalOverlay').classList.add('active');

  // Clear form
  ['formName','formPhone','formAddress','formNote'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('formDish').selectedIndex = 0;
}

function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}

window.submitOrder = submitOrder;
window.closeModal  = closeModal;

// Close modal on overlay click
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});


/* ──────────────────────────────────────────────────
   12. HERO PARTICLE SYSTEM
────────────────────────────────────────────────── */
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT    = 30;
const PARTICLE_COLORS   = ['var(--gold)', 'var(--red)', 'var(--gold-bright)', '#fff8f0'];
const PARTICLE_CHARS    = ['✦', '❧', '◆', '✿', '❤', '✶', '·'];

function createParticle() {
  const p   = document.createElement('span');
  const useChar = Math.random() > 0.5;
  
  p.classList.add('particle');
  p.textContent = useChar ? PARTICLE_CHARS[Math.floor(Math.random() * PARTICLE_CHARS.length)] : '';
  
  const size     = Math.random() * 10 + 4;
  const startX   = Math.random() * 100;
  const delay    = Math.random() * 12;
  const duration = Math.random() * 14 + 8;
  const color    = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];

  p.style.cssText = `
    left: ${startX}%;
    bottom: -20px;
    width: ${size}px;
    height: ${size}px;
    font-size: ${size}px;
    color: ${color};
    background: ${useChar ? 'transparent' : color};
    animation-delay: ${delay}s;
    animation-duration: ${duration}s;
  `;

  particleContainer.appendChild(p);

  // Remove particle after animation completes
  setTimeout(() => {
    if (p.parentNode) p.parentNode.removeChild(p);
    createParticle(); // spawn a replacement
  }, (delay + duration) * 1000);
}

if (particleContainer) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    setTimeout(createParticle, i * 300);
  }
}


/* ──────────────────────────────────────────────────
   13. PARALLAX TILT on Menu Cards
────────────────────────────────────────────────── */
document.querySelectorAll('.menu-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = (e.clientX - rect.left) / rect.width  - 0.5;
    const y      = (e.clientY - rect.top)  / rect.height - 0.5;
    const tiltX  = y * -8;
    const tiltY  = x * 8;
    card.style.transform = `translateY(-8px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    card.style.transformStyle = 'preserve-3d';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});


/* ──────────────────────────────────────────────────
   14. ACTIVE NAV LINK on scroll
────────────────────────────────────────────────── */
const sections     = document.querySelectorAll('section[id]');
const navLinkEls   = document.querySelectorAll('.nav-link');

function setActiveNav() {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinkEls.forEach(link => {
    link.style.color = '';
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.style.color = 'var(--gold)';
    }
  });
}

window.addEventListener('scroll', setActiveNav, { passive: true });


/* ──────────────────────────────────────────────────
   15. SHAKE KEYFRAME — injected dynamically
────────────────────────────────────────────────── */
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);


/* ──────────────────────────────────────────────────
   16. SPECIAL CARD HOVER GLOW
────────────────────────────────────────────────── */
document.querySelectorAll('.special-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 30px 70px rgba(0,0,0,0.7), 0 0 40px rgba(192,57,43,0.2)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});


/* ──────────────────────────────────────────────────
   17. SCROLL PROGRESS INDICATOR
────────────────────────────────────────────────── */
const progressBar = document.createElement('div');
progressBar.style.cssText = `
  position: fixed; top: 0; left: 0; height: 2px;
  background: linear-gradient(90deg, var(--red), var(--gold));
  width: 0%; z-index: 9999;
  transition: width 0.1s linear;
  pointer-events: none;
`;
document.body.appendChild(progressBar);

window.addEventListener('scroll', () => {
  const scrollTop    = window.scrollY;
  const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + '%';
}, { passive: true });


/* ──────────────────────────────────────────────────
   18. SECTION LABEL TYPING EFFECT (decorative)
────────────────────────────────────────────────── */
const labelObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el        = entry.target;
      const fullText  = el.textContent;
      el.textContent  = '';
      let i           = 0;
      const type = setInterval(() => {
        el.textContent += fullText[i];
        i++;
        if (i >= fullText.length) clearInterval(type);
      }, 50);
      labelObserver.unobserve(el);
    }
  });
}, { threshold: 0.8 });

document.querySelectorAll('.section-label').forEach(el => {
  labelObserver.observe(el);
});


/* ──────────────────────────────────────────────────
   19. INPUT FOCUS GOLD GLOW
────────────────────────────────────────────────── */
document.querySelectorAll('.form-input').forEach(input => {
  input.addEventListener('focus', () => {
    input.parentElement.style.position = 'relative';
  });
  input.addEventListener('blur', () => {
    input.style.borderColor = '';
  });
});


/* ──────────────────────────────────────────────────
   20. LOG — Console Branding
────────────────────────────────────────────────── */
console.log(
  '%c✦ MAA\'S KITCHEN ✦\n%cCoded with love, just like her cooking.',
  'color: #d4a843; font-size: 1.4rem; font-weight: bold; font-family: serif;',
  'color: #c0392b; font-size: 0.9rem; font-style: italic;'
);
