// === BRUNELLE SARL — main.js ===

document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation scroll state ---
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Menu mobile ---
  const hamburger = document.querySelector('.hamburger');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('nav-mobile-open');
      hamburger.setAttribute('aria-expanded', nav.classList.contains('nav-mobile-open'));
    });
    // Fermer au clic sur un lien
    nav.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('nav-mobile-open'));
    });
  }

  // --- Lien actif dans la nav ---
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Lightbox galerie ---
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxCaption = document.querySelector('.lightbox-caption');
  const lightboxClose = document.querySelector('.lightbox-close');

  if (lightbox) {
    document.querySelectorAll('[data-lightbox]').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.dataset.lightbox;
        const caption = item.dataset.caption || '';
        lightboxImg.src = src;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeLightbox = () => {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { lightboxImg.src = ''; }, 300);
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });
  }

  // --- Filtres galerie ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (filterBtns.length && galleryItems.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        galleryItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // --- Compteurs animés sur les stats ---
  const counterEls = document.querySelectorAll('.stat-number[data-count]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.innerHTML.replace(/^\d+/, '');
        let startTime = null;
        const duration = 1400;
        const step = (ts) => {
          if (!startTime) startTime = ts;
          const progress = Math.min((ts - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.innerHTML = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    counterEls.forEach(el => counterObserver.observe(el));
  }

  // --- Animations d'apparition au scroll ---
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.sf-card, .real-card, .gallery-item, .stat-item, .value-card, .team-card').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
  });

});
