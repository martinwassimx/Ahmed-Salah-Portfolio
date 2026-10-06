/**
 * Ahmed Hesham Salah — Scroll Reveal & Numerical Counter Engine
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 01. SCROLL REVEAL OBSERVER
  // -------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal-init');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // -------------------------------------------------------------------------
  // 02. ANIMATED NUMERICAL METRICS COUNTERS
  // -------------------------------------------------------------------------
  const metricValues = document.querySelectorAll('.metric-value');

  const startCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out expo
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = currentVal.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.textContent = target.toLocaleString();
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    metricValues.forEach((mv) => counterObserver.observe(mv));
  } else {
    metricValues.forEach((mv) => {
      mv.textContent = parseInt(mv.getAttribute('data-target'), 10).toLocaleString();
    });
  }

  // -------------------------------------------------------------------------
  // 03. HERO REACTOR PARALLAX
  // -------------------------------------------------------------------------
  const heroReactor = document.querySelector('.neural-reactor-wrap');

  if (heroReactor && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('mousemove', (e) => {
      const xPercent = (e.clientX / window.innerWidth - 0.5) * 2;
      const yPercent = (e.clientY / window.innerHeight - 0.5) * 2;

      heroReactor.style.transform = `perspective(1000px) rotateY(${xPercent * 8}deg) rotateX(${-yPercent * 8}deg)`;
    });
  }
})();
