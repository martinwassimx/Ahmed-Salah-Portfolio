/**
 * Ahmed Hesham Salah — Main Cinematic Application Controller
 * Features: Dual Custom Cursor, Loading Screen, Floating Navbar, Contact Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 01. LOADING SCREEN SEQUENCE (1.2s MAXIMUM)
  // -------------------------------------------------------------------------
  const loadingScreen = document.getElementById('loading-screen');
  const loaderBarFill = document.querySelector('.loader-bar-fill');

  if (loadingScreen && loaderBarFill) {
    // Animate loader bar quickly
    setTimeout(() => {
      loaderBarFill.style.width = '100%';
    }, 100);

    setTimeout(() => {
      loadingScreen.classList.add('fade-out');
    }, 1150);
  }

  // -------------------------------------------------------------------------
  // 02. DUAL CUSTOM CURSOR (DESKTOP)
  // -------------------------------------------------------------------------
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  const cursorLight = document.querySelector('.cursor-light-glow');
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer && cursorDot && cursorRing) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;

      if (cursorLight) {
        cursorLight.style.left = `${mouseX}px`;
        cursorLight.style.top = `${mouseY}px`;
      }
    });

    // Smooth trailing ring
    function renderCursor() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      cursorRing.style.left = `${ringX}px`;
      cursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(renderCursor);
    }
    renderCursor();

    // Hover interactions
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .cluster-btn, .cert-cinematic-card, .cert-card-enhanced, .cert-filter-pill, .channel-card, .btn-cert-inspect, .btn-channel-action');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        cursorRing.classList.add('hover-active');
      });
      el.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('hover-active');
      });
    });

    // Special project showcase hover
    const projectCards = document.querySelectorAll('.editorial-project-showcase');
    projectCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        cursorRing.classList.add('project-hover');
        cursorRing.textContent = 'EXPLORE';
      });
      card.addEventListener('mouseleave', () => {
        cursorRing.classList.remove('project-hover');
        cursorRing.textContent = '';
      });
    });
  }

  // -------------------------------------------------------------------------
  // 03. FLOATING NAVBAR SCROLL & ACTIVE TRACKING
  // -------------------------------------------------------------------------
  const navbar = document.querySelector('.floating-navbar');
  const navLinks = document.querySelectorAll('.nav-item-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mobileOverlay = document.getElementById('mobile-overlay');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile menu toggle
  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileOverlay.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
    });

    mobileNavLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('open');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // Active section scrollspy
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach((l) => {
              if (l.getAttribute('href') === `#${id}`) {
                l.classList.add('active');
              } else {
                l.classList.remove('active');
              }
            });
          }
        });
      },
      { threshold: 0.25 }
    );

    sections.forEach((s) => sectionObserver.observe(s));
  }

  // -------------------------------------------------------------------------
  // 04. TOAST NOTIFICATION ENGINE
  // -------------------------------------------------------------------------
  const toastStack = document.getElementById('toast-stack');

  const triggerToast = (message) => {
    if (!toastStack) return;
    const toast = document.createElement('div');
    toast.className = 'cinematic-toast-item';
    toast.innerHTML = `<span class="toast-red-laser-dot"></span><span>${escapeHtml(message)}</span>`;
    toastStack.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  };

  // One-click copy
  document.querySelectorAll('.copy-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (text) {
        navigator.clipboard.writeText(text).then(() => {
          triggerToast(`Copied to clipboard: ${text}`);
        }).catch(() => {
          triggerToast(`Value: ${text}`);
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 05. CONTACT TRANSMISSION ENGINE
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-transmission-form');
  const formFeedback = document.getElementById('form-feedback-pill');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#sender-name')?.value.trim();
      const email = contactForm.querySelector('#sender-email')?.value.trim();
      const projectType = contactForm.querySelector('#project-type')?.value.trim();
      const message = contactForm.querySelector('#sender-message')?.value.trim();

      if (!name || !email || !message) {
        if (formFeedback) {
          formFeedback.className = 'form-feedback-pill show';
          formFeedback.style.borderColor = '#ff1a2a';
          formFeedback.textContent = 'Please fill out all required fields (Name, Email, Message).';
        }
        return;
      }

      const mailtoSub = encodeURIComponent(projectType ? `[AI Inquiry] ${projectType} from ${name}` : `Inquiry from ${name}`);
      const mailtoBody = encodeURIComponent(`Sender: ${name}\nEmail: ${email}\n\nProject Scope:\n${message}`);
      const mailtoUrl = `mailto:ahmedheshamsalah2005@gmail.com?subject=${mailtoSub}&body=${mailtoBody}`;

      if (formFeedback) {
        formFeedback.className = 'form-feedback-pill show';
        formFeedback.innerHTML = `<strong>Transmission Prepared!</strong> Launching email client for <strong>${escapeHtml(email)}</strong>...`;
      }

      triggerToast('Preparing transmission...');
      setTimeout(() => {
        window.location.href = mailtoUrl;
      }, 400);
    });
  }

  // -------------------------------------------------------------------------
  // 06. BACK TO TOP
  // -------------------------------------------------------------------------
  const backToTopBtn = document.querySelector('.back-to-top-trigger');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
});
