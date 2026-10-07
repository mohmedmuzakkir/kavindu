(() => {
  'use strict';

  // =============================
  // EASY CONFIGURATION
  // =============================
  // Replace with the official WhatsApp number in international format,
  // digits only, e.g. 9477XXXXXXX. Keep blank to use the on-page form instead.
  const WHATSAPP_NUMBER = '';

  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const floatingActions = document.getElementById('floatingActions');
  const footer = document.querySelector('.site-footer');

  document.getElementById('year').textContent = new Date().getFullYear();

  // Header compaction + floating actions
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 50);
    floatingActions.classList.toggle('is-visible', y > 340 && !document.body.classList.contains('menu-open'));
    if (footer) {
      const footerTop = footer.getBoundingClientRect().top;
      floatingActions.classList.toggle('is-footer-near', footerTop < window.innerHeight + 90);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const setMenu = (open) => {
    menuToggle.classList.toggle('is-open', open);
    mobileMenu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    mobileMenu.setAttribute('aria-hidden', String(!open));
    if (open) floatingActions.classList.remove('is-visible');
    else onScroll();
  };
  menuToggle.addEventListener('click', () => setMenu(!mobileMenu.classList.contains('is-open')));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) setMenu(false); });

  // Hero slider
  const slider = document.getElementById('heroSlider');
  const slides = [...slider.querySelectorAll('.hero-slide')];
  const dots = [...slider.querySelectorAll('.dot')];
  const prev = slider.querySelector('.slider-prev');
  const next = slider.querySelector('.slider-next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let autoTimer = null;
  let resumeTimer = null;

  const showSlide = (newIndex, userInitiated = false) => {
    index = (newIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const active = i === index;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    dots.forEach((dot, i) => {
      const active = i === index;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
    });
    if (userInitiated) pauseThenResume();
  };

  const startAuto = () => {
    if (reduceMotion) return;
    clearInterval(autoTimer);
    autoTimer = setInterval(() => showSlide(index + 1), 6000);
  };
  const pauseThenResume = () => {
    clearInterval(autoTimer);
    clearTimeout(resumeTimer);
    resumeTimer = setTimeout(startAuto, 9000);
  };
  prev.addEventListener('click', () => showSlide(index - 1, true));
  next.addEventListener('click', () => showSlide(index + 1, true));
  dots.forEach(dot => dot.addEventListener('click', () => showSlide(Number(dot.dataset.slideTo), true)));

  let touchStartX = 0;
  let touchStartY = 0;
  slider.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });
  slider.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) showSlide(index + (dx < 0 ? 1 : -1), true);
  }, { passive: true });
  slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slider.addEventListener('mouseleave', startAuto);
  startAuto();

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  // Active navigation link
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
      });
    }, { threshold: 0.35, rootMargin: '-80px 0px -45% 0px' });
    sections.forEach(s => navObserver.observe(s));
  }

  // WhatsApp handoff (configurable)
  document.querySelectorAll('.js-whatsapp').forEach(link => {
    link.addEventListener('click', (e) => {
      if (!WHATSAPP_NUMBER) return; // fallback href already sends user to appointment form
      e.preventDefault();
      const message = link.dataset.message || 'Hello, I would like to ask about an appointment.';
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
    });
  });

  // Booking form validation
  const form = document.getElementById('bookingForm');
  const status = document.getElementById('formStatus');
  const dateInput = form.elements.date;
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
  dateInput.min = localToday;

  const validateField = (field) => {
    field.classList.toggle('invalid', !field.checkValidity());
    return field.checkValidity();
  };
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => { if (field.classList.contains('invalid')) validateField(field); });
    field.addEventListener('blur', () => { if (field.required) validateField(field); });
  });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const requiredFields = [...form.querySelectorAll('[required]')];
    const valid = requiredFields.every(validateField);
    status.className = 'form-status';
    if (!valid) {
      status.textContent = 'Please complete all required fields correctly.';
      form.querySelector('.invalid')?.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    if (WHATSAPP_NUMBER) {
      const message = `Appointment request\nName: ${data.fullName}\nPhone: ${data.phone}\nTreatment: ${data.treatment}\nDate: ${data.date}\nTime: ${data.time}\nMessage: ${data.message || '-'}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      status.textContent = 'Your request is ready to send via WhatsApp.';
    } else {
      status.textContent = 'Form checked successfully. Add the official WhatsApp number in js/main.js or connect a booking backend before publishing.';
    }
    status.classList.add('success');
  });

  // Gallery lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  let lastFocus = null;
  const openLightbox = (src, trigger) => {
    lastFocus = trigger;
    lightboxImage.src = src;
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  };
  const closeLightbox = () => {
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => { lightboxImage.src = ''; }, 250);
    lastFocus?.focus();
  };
  document.querySelectorAll('[data-lightbox]').forEach(item => item.addEventListener('click', () => openLightbox(item.dataset.lightbox, item)));
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox(); });
})();
