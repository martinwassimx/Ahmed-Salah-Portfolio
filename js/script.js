/**
 * Ahmed Hesham Salah — Professional Portfolio
 * Core JavaScript Logic
 * Clean, Modular, Dependency-free Vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // -------------------------------------------------------------------------
  // 01. NAVIGATION & SCROLL TRACKING
  // -------------------------------------------------------------------------
  const siteHeader = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-nav-drawer');
  const sections = document.querySelectorAll('section[id]');
  const backToTopBtn = document.querySelector('.footer-back-to-top');

  // Sticky Header Effect
  const handleScroll = () => {
    if (window.scrollY > 30) {
      siteHeader?.classList.add('scrolled');
    } else {
      siteHeader?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Menu Toggle
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.classList.toggle('active', isOpen);
      mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close mobile menu when clicking any nav link
    mobileDrawer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!siteHeader.contains(e.target) && !mobileDrawer.contains(e.target)) {
        mobileDrawer.classList.remove('open');
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Smooth Scroll with Offset
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Active Navigation Highlighting on Scroll
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => navObserver.observe(section));

  // Back to top
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 02. HERO INTERACTIVE TERMINAL
  // -------------------------------------------------------------------------
  const terminalTabs = document.querySelectorAll('.terminal-tab-btn');
  const terminalPanes = document.querySelectorAll('.terminal-tab-pane');
  const terminalInput = document.querySelector('.terminal-input');
  const cliOutput = document.getElementById('cli-output-log');
  const quickCmdChips = document.querySelectorAll('.t-chip');

  // Tab switching
  terminalTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');

      terminalTabs.forEach((t) => t.classList.remove('active'));
      terminalPanes.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const activePane = document.getElementById(`pane-${targetTab}`);
      if (activePane) activePane.classList.add('active');

      if (targetTab === 'cli' && terminalInput) {
        setTimeout(() => terminalInput.focus(), 50);
      }
    });
  });

  // Interactive CLI commands dictionary
  const commands = {
    help: () => `Available commands:
  <span class="t-success">whoami</span>    - Display summary of Ahmed Hesham
  <span class="t-success">skills</span>    - List top technical domains
  <span class="t-success">projects</span>  - Show featured production & research projects
  <span class="t-success">contact</span>   - Show email, phone & location
  <span class="t-success">cv</span>        - Download Ahmed Hesham's verified CV
  <span class="t-success">clear</span>     - Clear terminal buffer`,

    whoami: () => `Ahmed Hesham Salah
Role: Data Science Student | AI, ML & Backend Developer
University: Helwan National University (Sep 2023 - Present)
Focus: RAG Systems, Local LLMs, CNNs, FastAPI, Docker, Plotly Dash.`,

    skills: () => `Core Skills:
- Generative AI & RAG: ChromaDB, Sentence-Transformers, Ollama, Llama 3
- Machine Learning & DL: CNN Architectures, Transfer Learning, Computer Vision, NLP
- Backend & Data: FastAPI, Pydantic, Redis Caching, SQLite, Pandas, Plotly Dash
- Tools: Docker Compose, Pytest, Git, Web3.py, Solidity`,

    projects: () => `Featured Systems:
1. [RAG] Document Assistant (FastAPI + ChromaDB + Ollama + Streamlit)
2. [Data] Spotify Analytics Dashboard (54,000+ tracks, Plotly Dash)
3. [Web3] Blockchain Certificate Registry (Ethereum + Solidity + Web3.py)
4. [DL] Waste Classifier (5-Class CNN image sorting)
5. [CV] Hand Gesture Recognition (Transfer Learning + Model Explainability)
6. [API] Task Manager Backend (FastAPI + Redis + RBAC)`,

    contact: () => `Contact Info:
Email:    ahmedheshamsalah2005@gmail.com
Phone:    +20 109 879 0003
Location: Cairo, Egypt
GitHub:   github.com/Ahmad-Salah-22`,

    cv: () => {
      const link = document.createElement('a');
      link.href = 'assets/docs/Ahmed_Hesham_CV.pdf';
      link.download = 'Ahmed_Hesham_CV.pdf';
      link.click();
      return `<span class="t-success">Initiating download: Ahmed_Hesham_CV.pdf...</span>`;
    },

    clear: () => {
      if (cliOutput) cliOutput.innerHTML = '';
      return '';
    }
  };

  const executeCliCommand = (cmdText) => {
    const raw = cmdText.trim().toLowerCase();
    if (!raw) return;

    if (raw === 'clear') {
      commands.clear();
      return;
    }

    const commandResponse = commands[raw]
      ? commands[raw]()
      : `<span style="color:#ef4444">Command not found: '${raw}'. Type <span class="t-success">'help'</span> for instructions.</span>`;

    if (cliOutput) {
      const cmdEntry = document.createElement('div');
      cmdEntry.style.marginBottom = '8px';
      cmdEntry.innerHTML = `<div><span class="t-prompt">$</span> <span class="t-cmd">${escapeHtml(cmdText)}</span></div><div class="t-dim" style="white-space:pre-wrap; margin-top:2px;">${commandResponse}</div>`;
      cliOutput.appendChild(cmdEntry);

      // Scroll to bottom of terminal
      const terminalBody = cliOutput.closest('.terminal-body');
      if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const val = terminalInput.value;
        executeCliCommand(val);
        terminalInput.value = '';
      }
    });
  }

  // Quick CLI chips click
  quickCmdChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      // Switch to CLI tab first
      const cliTabBtn = document.querySelector('.terminal-tab-btn[data-tab="cli"]');
      if (cliTabBtn) cliTabBtn.click();
      executeCliCommand(cmd);
    });
  });

  // -------------------------------------------------------------------------
  // 03. SKILLS CATEGORY FILTERING & LIVE SEARCH
  // -------------------------------------------------------------------------
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-category-card');
  const skillSearchInput = document.querySelector('.skill-search-input');

  const filterSkills = () => {
    const activeCategory = document.querySelector('.skill-tab-btn.active')?.getAttribute('data-category') || 'all';
    const query = skillSearchInput?.value.trim().toLowerCase() || '';

    skillCards.forEach((card) => {
      const cardCategory = card.getAttribute('data-category');
      const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;

      const chips = card.querySelectorAll('.skill-chip');
      let matchesSearch = false;

      if (!query) {
        matchesSearch = true;
        chips.forEach((c) => (c.style.display = 'inline-flex'));
      } else {
        let visibleCount = 0;
        chips.forEach((chip) => {
          const text = chip.textContent.toLowerCase();
          if (text.includes(query)) {
            chip.style.display = 'inline-flex';
            visibleCount++;
          } else {
            chip.style.display = 'none';
          }
        });
        matchesSearch = visibleCount > 0;
      }

      if (matchesCategory && matchesSearch) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  };

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      filterSkills();
    });
  });

  if (skillSearchInput) {
    skillSearchInput.addEventListener('input', filterSkills);
  }

  // -------------------------------------------------------------------------
  // 04. PROJECTS FILTERING & ARCHITECTURE DETAILS MODAL
  // -------------------------------------------------------------------------
  const projectFilterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  projectFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      projectFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filter === 'all' || cardCategory === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project Details Modal System
  const modalBackdrop = document.getElementById('project-modal');
  const modalTitle = document.getElementById('modal-project-title');
  const modalSubtitle = document.getElementById('modal-project-subtitle');
  const modalBody = document.getElementById('modal-project-body');
  const modalGithubLink = document.getElementById('modal-project-github');
  const modalCloseBtn = modalBackdrop?.querySelector('.modal-close-btn');

  // Detailed Project Breakdown Data strictly based on CV
  const projectDetailsMap = {
    'rag-assistant': {
      title: 'RAG-Powered Document Assistant',
      subtitle: 'Full-stack AI application running entirely on a local LLM',
      github: 'https://github.com/Ahmad-Salah-22/RAG-Powered-Document-Assistant-',
      architectureHtml: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.25); border-radius:8px; padding:16px;">
            <h4 style="color:#00ff88; font-family:var(--font-mono); font-size:0.9rem; margin-bottom:8px;">PIPELINE ARCHITECTURE</h4>
            <p style="color:#cbd5e1; font-size:0.9rem; line-height:1.6;">
              PDF Documents &rarr; <strong>PyPDF Page Extraction</strong> &rarr; <strong>Text Cleaning & Chunking (800 chars, 150 overlap)</strong> &rarr; <strong>all-MiniLM-L6-v2 Embeddings (384-dim)</strong> &rarr; <strong>Persistent ChromaDB</strong> &rarr; Cosine Top-K Retrieval &rarr; <strong>Ollama Local Llama 3 8B</strong> &rarr; Grounded Answer with Citations.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.05rem; margin-bottom:8px;">Key Engineering Implementations</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:#94a3b8;">
              <li><strong style="color:#fff;">FastAPI Backend:</strong> Engineered <code style="color:#00ff88;">POST /query</code> and <code style="color:#00ff88;">GET /health</code> endpoints with Pydantic schema validation. Vector store and embedding model loaded once at startup via lifespan handler to eliminate per-request overhead.</li>
              <li><strong style="color:#fff;">Anti-Hallucination Guardrails:</strong> Configured a strict grounding prompt instructing Llama 3 to explicitly cite source chunks and fall back safely to a fallback response on out-of-scope queries.</li>
              <li><strong style="color:#fff;">Interface & Testing:</strong> Responsive Streamlit UI with citation drawers and loading states. Comprehensive Pytest suite testing health checks, input validation (HTTP 422), and retrieval accuracy. Fully containerized with Docker Compose.</li>
              <li><strong style="color:#fff;">Evaluation Results:</strong> Verified on 10 test questions; correctly retrieved target sources and refused fabricated responses on out-of-domain prompts.</li>
            </ul>
          </div>
        </div>
      `
    },
    'spotify-analytics': {
      title: 'Spotify Analytics Dashboard',
      subtitle: 'Data pipeline and interactive dashboard analyzing 54,000+ tracks',
      github: 'https://github.com/seifalmaz/spotify-analytics-dashboard',
      architectureHtml: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.25); border-radius:8px; padding:16px;">
            <h4 style="color:#00ff88; font-family:var(--font-mono); font-size:0.9rem; margin-bottom:8px;">DATA PIPELINE & RECOVERY</h4>
            <p style="color:#cbd5e1; font-size:0.9rem; line-height:1.6;">
              54,000+ Raw Spotify Tracks &rarr; Spotify API Metadata Recovery via <code>track_id</code> &rarr; Secondary Dataset Join with Left Joins & Validation &rarr; Feature Engineering &rarr; Plotly Dash Dark UI Engine.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.05rem; margin-bottom:8px;">Key Engineering Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:#94a3b8;">
              <li><strong style="color:#fff;">Metadata Recovery:</strong> Created an automated recovery pipeline querying Spotify Web API to resolve missing release dates and metadata gaps needed for temporal analysis.</li>
              <li><strong style="color:#fff;">Interactive Visualizations:</strong> Built multi-dimensional KPI dashboards with Plotly Dash, covering genre popularity, audio feature correlations (danceability, acousticness, tempo), and explicit vs. clean content metrics.</li>
              <li><strong style="color:#fff;">Time-Series Analysis:</strong> Enabled custom decade and year filtering to track genre evolution trends over time without data corruption.</li>
            </ul>
          </div>
        </div>
      `
    },
    'blockchain-registry': {
      title: 'Online Course Certificate Registry',
      subtitle: 'Decentralized digital certificate ledger on Ethereum',
      github: 'https://github.com/Ahmad-Salah-22/CertificateProject',
      architectureHtml: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.25); border-radius:8px; padding:16px;">
            <h4 style="color:#00ff88; font-family:var(--font-mono); font-size:0.9rem; margin-bottom:8px;">SMART CONTRACT & CLI ARCHITECTURE</h4>
            <p style="color:#cbd5e1; font-size:0.9rem; line-height:1.6;">
              Solidity Smart Contracts &rarr; Role-Based Access Control (Admin/User) &rarr; Web3.py Python Terminal App &rarr; Event Scanning & On-Chain Public Verification.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.05rem; margin-bottom:8px;">Key Engineering Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:#94a3b8;">
              <li><strong style="color:#fff;">Security & Controls:</strong> Authored smart contracts with batch certification issuing, emergency pause/resume switches, and RBAC privilege separation.</li>
              <li><strong style="color:#fff;">Python Terminal Engine:</strong> Developed a Python Web3.py application with admin controls, live blockchain event listening, and automated transaction scanning.</li>
              <li><strong style="color:#fff;">Analytics & Audits:</strong> Implemented balance snapshot CSV exports and an admin dashboard script for monitoring ecosystem analytics and gas metrics.</li>
            </ul>
          </div>
        </div>
      `
    },
    'waste-classifier': {
      title: 'Waste Classifier – Intelligent Recycling System',
      subtitle: 'Deep learning image classifier sorting waste into 5 categories',
      github: 'https://github.com/seifalmaz/waste-classifier',
      architectureHtml: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.25); border-radius:8px; padding:16px;">
            <h4 style="color:#00ff88; font-family:var(--font-mono); font-size:0.9rem; margin-bottom:8px;">COMPUTER VISION MODEL SPECS</h4>
            <p style="color:#cbd5e1; font-size:0.9rem; line-height:1.6;">
              Input Images &rarr; Data Augmentation & Normalization &rarr; Deep CNN Architecture &rarr; Softmax Multi-Class Probability across 5 Categories: Plastic, Paper, Glass, Metal, Organic.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.05rem; margin-bottom:8px;">Key Engineering Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:#94a3b8;">
              <li><strong style="color:#fff;">5-Class Classification:</strong> Built an end-to-end deep learning pipeline to detect and sort municipal waste to automate smart recycling centers.</li>
              <li><strong style="color:#fff;">Environmental Impact:</strong> Tailored for environmental sustainability, minimizing misclassification between plastics and metals.</li>
            </ul>
          </div>
        </div>
      `
    },
    'gesture-recognition': {
      title: 'Hand Gesture Recognition System',
      subtitle: 'Transfer learning CNN with real-time video stream GUI and explainability',
      github: 'https://github.com/seifalmaz/gesture-recognition',
      architectureHtml: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.25); border-radius:8px; padding:16px;">
            <h4 style="color:#00ff88; font-family:var(--font-mono); font-size:0.9rem; margin-bottom:8px;">TRANSFER LEARNING & EXPLAINABILITY</h4>
            <p style="color:#cbd5e1; font-size:0.9rem; line-height:1.6;">
              Live Webcam Feed &rarr; Frame Preprocessing & Feature Extraction &rarr; Fine-Tuned CNN Backbones &rarr; Real-Time Prediction GUI & Confidence Heatmaps.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.05rem; margin-bottom:8px;">Key Engineering Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:#94a3b8;">
              <li><strong style="color:#fff;">Model Benchmarking:</strong> Trained and compared multiple CNN architectures using transfer learning to recognize gesture patterns (e.g., peace, stop, help).</li>
              <li><strong style="color:#fff;">Interactive GUI:</strong> Developed a desktop interface visualizing live video stream predictions, confidence intervals, and Grad-CAM saliency explainability.</li>
            </ul>
          </div>
        </div>
      `
    },
    'task-manager-api': {
      title: 'Task Manager API',
      subtitle: 'High-performance backend with workflow validation and Redis caching',
      github: 'https://github.com/ahmedelhossary22/Task-Management-System-Python-and-R-language-project',
      architectureHtml: `
        <div style="display:flex; flex-direction:column; gap:16px;">
          <div style="background:rgba(0,255,136,0.06); border:1px solid rgba(0,255,136,0.25); border-radius:8px; padding:16px;">
            <h4 style="color:#00ff88; font-family:var(--font-mono); font-size:0.9rem; margin-bottom:8px;">BACKEND ARCHITECTURE</h4>
            <p style="color:#cbd5e1; font-size:0.9rem; line-height:1.6;">
              FastAPI REST Routing &rarr; Pydantic V2 Request Schemas &rarr; Role-Based Access Control &rarr; Redis In-Memory Caching Layer &rarr; SQLite Persistence.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-heading); font-size:1.05rem; margin-bottom:8px;">Key Engineering Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:0.9rem; color:#94a3b8;">
              <li><strong style="color:#fff;">Role-Based Security:</strong> Implemented strict RBAC permissions controlling task assignments, state transitions, and audit logs.</li>
              <li><strong style="color:#fff;">Redis Caching & Logs:</strong> Integrated in-memory caching for frequently requested task queries to slash latency, backed by structured logging for debugging and auditability.</li>
            </ul>
          </div>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-project-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = btn.getAttribute('data-project');
      const details = projectDetailsMap[projKey];
      if (details && modalBackdrop) {
        modalTitle.textContent = details.title;
        modalSubtitle.textContent = details.subtitle;
        modalBody.innerHTML = details.architectureHtml;
        modalGithubLink.href = details.github;
        modalBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    if (modalBackdrop) modalBackdrop.classList.remove('open');
    const certModal = document.getElementById('cert-modal');
    if (certModal) certModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
  });

  // -------------------------------------------------------------------------
  // 05. CERTIFICATIONS FILTER & LIGHTBOX MODAL
  // -------------------------------------------------------------------------
  const certFilterBtns = document.querySelectorAll('.cert-filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  const certModal = document.getElementById('cert-modal');
  const certModalTitle = document.getElementById('cert-modal-title');
  const certModalIssuer = document.getElementById('cert-modal-issuer');
  const certModalDate = document.getElementById('cert-modal-date');
  const certModalImg = document.getElementById('cert-modal-img');
  const certModalPdfLink = document.getElementById('cert-modal-pdf');
  const certModalCloseBtn = certModal?.querySelector('.modal-close-btn');

  certFilterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      certFilterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      certCards.forEach((card) => {
        const issuer = card.getAttribute('data-issuer');
        if (filter === 'all' || issuer === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  certCards.forEach((card) => {
    card.addEventListener('click', () => {
      const title = card.getAttribute('data-title');
      const issuer = card.getAttribute('data-issuer-name');
      const date = card.getAttribute('data-date');
      const imgSrc = card.getAttribute('data-img');
      const pdfSrc = card.getAttribute('data-pdf');

      if (certModal) {
        if (certModalTitle) certModalTitle.textContent = title;
        if (certModalIssuer) certModalIssuer.textContent = issuer;
        if (certModalDate) certModalDate.textContent = date;

        if (certModalImg) {
          if (imgSrc) {
            certModalImg.src = imgSrc;
            certModalImg.style.display = 'block';
          } else {
            certModalImg.style.display = 'none';
          }
        }

        if (certModalPdfLink) {
          if (pdfSrc) {
            certModalPdfLink.href = pdfSrc;
            certModalPdfLink.style.display = 'inline-flex';
          } else {
            certModalPdfLink.style.display = 'none';
          }
        }

        certModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  if (certModalCloseBtn) certModalCloseBtn.addEventListener('click', closeModal);
  certModal?.addEventListener('click', (e) => {
    if (e.target === certModal) closeModal();
  });

  // -------------------------------------------------------------------------
  // 06. GITHUB API INTEGRATION (WITH BULLETPROOF FALLBACK)
  // -------------------------------------------------------------------------
  const fetchGithubStats = async () => {
    const reposCountEl = document.getElementById('gh-repos-count');
    const followersCountEl = document.getElementById('gh-followers-count');
    const statusDotEl = document.getElementById('gh-status-dot');

    try {
      const response = await fetch('https://api.github.com/users/Ahmad-Salah-22', {
        headers: { Accept: 'application/vnd.github.v3+json' }
      });

      if (!response.ok) throw new Error('GitHub API response not ok');
      const data = await response.json();

      if (reposCountEl && data.public_repos !== undefined) {
        reposCountEl.textContent = data.public_repos;
      }
      if (followersCountEl && data.followers !== undefined) {
        followersCountEl.textContent = data.followers;
      }
      if (statusDotEl) {
        statusDotEl.style.background = '#00ff88';
      }
    } catch {
      // Graceful fallback to verified numbers from CV repositories
      if (reposCountEl) reposCountEl.textContent = '6+ Verified';
      if (followersCountEl) followersCountEl.textContent = 'Active';
    }
  };

  fetchGithubStats();

  // -------------------------------------------------------------------------
  // 07. CLIPBOARD COPY & TOAST NOTIFICATIONS
  // -------------------------------------------------------------------------
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message) => {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span class="toast-dot"></span><span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  };

  document.querySelectorAll('.copy-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied to clipboard: ${textToCopy}`);
        }).catch(() => {
          showToast(`Selected: ${textToCopy}`);
        });
      }
    });
  });

  // -------------------------------------------------------------------------
  // 08. CONTACT FORM HANDLING
  // -------------------------------------------------------------------------
  const contactForm = document.getElementById('portfolio-contact-form');
  const formStatus = document.getElementById('form-status-message');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('#sender-name')?.value.trim();
      const email = contactForm.querySelector('#sender-email')?.value.trim();
      const subject = contactForm.querySelector('#sender-subject')?.value.trim();
      const message = contactForm.querySelector('#sender-message')?.value.trim();

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.className = 'form-status-msg';
          formStatus.style.display = 'block';
          formStatus.style.background = 'rgba(239, 68, 68, 0.1)';
          formStatus.style.border = '1px solid #ef4444';
          formStatus.style.color = '#ef4444';
          formStatus.textContent = 'Please fill out all required fields (Name, Email, Message).';
        }
        return;
      }

      // Format mailto URI
      const mailtoSubject = encodeURIComponent(subject || `Portfolio Inquiry from ${name}`);
      const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      const mailtoUrl = `mailto:ahmedheshamsalah2005@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

      // Feedback to user
      if (formStatus) {
        formStatus.className = 'form-status-msg success';
        formStatus.style.display = 'block';
        formStatus.innerHTML = `
          <strong>Message Prepared!</strong> Opening default email client...<br>
          <span style="font-size:0.78rem; color:#94a3b8;">If your mail app didn't open automatically, you can send directly to: <strong>ahmedheshamsalah2005@gmail.com</strong></span>
        `;
      }

      showToast('Opening email client...');
      window.location.href = mailtoUrl;
    });
  }

  // -------------------------------------------------------------------------
  // 09. KEYBOARD SHORTCUTS
  // -------------------------------------------------------------------------
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Helper function to prevent XSS
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
