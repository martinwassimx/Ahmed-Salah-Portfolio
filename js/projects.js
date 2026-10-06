/**
 * Ahmed Hesham Salah — Interactive Projects & Technology Constellation Engine
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 01. INTERACTIVE TECHNOLOGY CONSTELLATION GRAPH
  // -------------------------------------------------------------------------
  const constellationCanvas = document.getElementById('constellation-canvas');
  const nodeDrawer = document.getElementById('node-inspector-drawer');
  const drawerNodeTitle = document.getElementById('drawer-node-title');
  const drawerNodeDesc = document.getElementById('drawer-node-desc');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const clusterBtns = document.querySelectorAll('.cluster-btn');

  if (constellationCanvas) {
    const ctx = constellationCanvas.getContext('2d');
    let cWidth = (constellationCanvas.width = constellationCanvas.clientWidth);
    let cHeight = (constellationCanvas.height = constellationCanvas.clientHeight);

    window.addEventListener('resize', () => {
      if (!constellationCanvas) return;
      cWidth = constellationCanvas.width = constellationCanvas.clientWidth;
      cHeight = constellationCanvas.height = constellationCanvas.clientHeight;
      layoutNodes();
    });

    // Technical skills nodes strictly from CV
    const skillNodesData = [
      // AI & RAG
      { id: 'rag', name: 'RAG Systems', cat: 'ai', desc: 'Retrieval-Augmented Generation using PyPDF chunking (800 chars, 150 overlap) and Ollama Llama 3 8B with strict grounding citations.' },
      { id: 'llm', name: 'Large Language Models', cat: 'ai', desc: 'Local model orchestration with Ollama, structured prompt engineering, and fallback safety guards.' },
      { id: 'chroma', name: 'ChromaDB', cat: 'ai', desc: 'Persistent vector database for cosine similarity top-K retrieval of document embeddings.' },
      { id: 'sent-trans', name: 'Sentence-Transformers', cat: 'ai', desc: 'Generated 384-dimension vector embeddings using all-MiniLM-L6-v2.' },
      { id: 'cnn', name: 'CNN Architectures', cat: 'ai', desc: 'Deep convolutional networks designed for multi-class image classification and gesture recognition.' },
      { id: 'transfer', name: 'Transfer Learning', cat: 'ai', desc: 'Fine-tuned pre-trained deep neural backbones for real-time video stream gesture tracking.' },
      { id: 'cv', name: 'Computer Vision', cat: 'ai', desc: 'OpenCV pipelines, 21-landmark skeletal hand tracking, and image normalization.' },
      { id: 'nlp', name: 'NLP in Python', cat: 'ai', desc: 'Certified in Natural Language Processing (DataCamp #47,414,661) and text embeddings.' },
      { id: 'explain', name: 'Model Explainability', cat: 'ai', desc: 'Grad-CAM saliency heatmaps to visualize prediction focus areas and confidence scores.' },

      // Backend
      { id: 'fastapi', name: 'FastAPI', cat: 'backend', desc: 'High-performance REST API backends with startup lifespan handlers, async routes, and Pydantic validation.' },
      { id: 'redis', name: 'Redis Caching', cat: 'backend', desc: 'In-memory caching layer slashing latency to <2ms and handling repetitive query workloads.' },
      { id: 'pydantic', name: 'Pydantic V2', cat: 'backend', desc: 'Strict request schema validation and structured error response modeling.' },
      { id: 'rbac', name: 'RBAC Security', cat: 'backend', desc: 'Role-based access control protecting task assignments, admin dashboards, and endpoints.' },
      { id: 'sqlite', name: 'SQLite', cat: 'backend', desc: 'Relational data persistence and foreign key constraints for project tracking systems.' },
      { id: 'streamlit', name: 'Streamlit', cat: 'backend', desc: 'Full-stack AI interface with source citation inspection drawers and loading states.' },

      // Data
      { id: 'pandas', name: 'Pandas', cat: 'data', desc: 'Tabular data processing, metadata recovery pipelines, and dataset joins across 54,000+ records.' },
      { id: 'numpy', name: 'NumPy', cat: 'data', desc: 'High-speed numerical transformations, matrix computations, and statistical evaluations.' },
      { id: 'dash', name: 'Plotly Dash', cat: 'data', desc: 'Interactive dark-themed dashboards with KPI telemetry, decade filters, and time-series charts.' },
      { id: 'spotify-api', name: 'Spotify API', cat: 'data', desc: 'Metadata recovery pipeline querying audio features and track_id metadata.' },

      // Programming
      { id: 'python', name: 'Python', cat: 'prog', desc: 'Core language for AI pipelines, Web3 scripts, FastAPI backends, and Pytest suites.' },
      { id: 'r-lang', name: 'R Language', cat: 'prog', desc: 'Statistical modeling, exploratory data analysis, and university project workflows.' },
      { id: 'cpp', name: 'C++', cat: 'prog', desc: 'Fundamental algorithms, low-level data structures, and computer science coursework.' },
      { id: 'java', name: 'Java', cat: 'prog', desc: 'Object-oriented software architecture and design pattern implementations.' },
      { id: 'sql', name: 'SQL', cat: 'prog', desc: 'Relational database schema modeling, queries, joins, and indexing.' },
      { id: 'dart', name: 'Dart / Flutter', cat: 'prog', desc: 'Cross-platform mobile architecture with Clean Architecture patterns (ITI Certified).' },
      { id: 'solidity', name: 'Solidity', cat: 'prog', desc: 'Smart contracts for digital certificate registries on Ethereum with pause/resume controls.' },

      // DevOps
      { id: 'docker', name: 'Docker Compose', cat: 'devops', desc: 'Multi-container orchestration for FastAPI backends, vector databases, and frontend interfaces.' },
      { id: 'pytest', name: 'Pytest (Automated Testing)', cat: 'devops', desc: 'Unit testing suites verifying health endpoints, 422 validations, and RAG retrieval pipelines.' },
      { id: 'git', name: 'Git & GitHub', cat: 'devops', desc: 'Version control, open-source repository maintenance, and issue tracking.' }
    ];

    let nodes = [];
    let activeCategory = 'all';
    let hoveredNode = null;
    let selectedNode = null;

    function layoutNodes() {
      nodes = skillNodesData.map((d, i) => {
        const angle = (i / skillNodesData.length) * Math.PI * 2;
        // Radial distribution with random slight jitter
        const radius = Math.min(cWidth, cHeight) * (0.22 + (i % 3) * 0.12);
        return {
          ...d,
          x: cWidth / 2 + Math.cos(angle) * radius + (Math.random() - 0.5) * 30,
          y: cHeight / 2 + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
          baseRadius: d.cat === 'ai' ? 8 : 6,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25
        };
      });
    }
    layoutNodes();

    // Mouse tracking on constellation canvas
    const cMouse = { x: -1000, y: -1000 };

    constellationCanvas.addEventListener('mousemove', (e) => {
      const rect = constellationCanvas.getBoundingClientRect();
      cMouse.x = e.clientX - rect.left;
      cMouse.y = e.clientY - rect.top;

      hoveredNode = null;
      nodes.forEach((n) => {
        if (activeCategory !== 'all' && n.cat !== activeCategory) return;
        const dx = cMouse.x - n.x;
        const dy = cMouse.y - n.y;
        if (Math.sqrt(dx * dx + dy * dy) < 18) {
          hoveredNode = n;
        }
      });
    });

    constellationCanvas.addEventListener('click', () => {
      if (hoveredNode) {
        selectedNode = hoveredNode;
        if (drawerNodeTitle) drawerNodeTitle.textContent = selectedNode.name;
        if (drawerNodeDesc) drawerNodeDesc.textContent = selectedNode.desc;
        if (nodeDrawer) nodeDrawer.classList.add('active');
      }
    });

    if (drawerCloseBtn) {
      drawerCloseBtn.addEventListener('click', () => {
        if (nodeDrawer) nodeDrawer.classList.remove('active');
        selectedNode = null;
      });
    }

    // Category Filter Buttons
    clusterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        clusterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-cluster');
      });
    });

    // Render Loop
    function renderConstellation() {
      ctx.clearRect(0, 0, cWidth, cHeight);

      // Draw Center Hub
      ctx.beginPath();
      ctx.arc(cWidth / 2, cHeight / 2, 12, 0, Math.PI * 2);
      ctx.fillStyle = '#ff1a2a';
      ctx.shadowColor = '#ff1a1a';
      ctx.shadowBlur = 15;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px "JetBrains Mono"';
      ctx.textAlign = 'center';
      ctx.fillText('NEURAL LAB', cWidth / 2, cHeight / 2 - 18);

      // Draw Filaments between related nodes
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (activeCategory !== 'all' && n1.cat !== activeCategory) continue;

        // Line to center
        ctx.beginPath();
        ctx.moveTo(cWidth / 2, cHeight / 2);
        ctx.lineTo(n1.x, n1.y);
        ctx.strokeStyle = n1 === hoveredNode ? 'rgba(255, 26, 42, 0.7)' : 'rgba(139, 0, 0, 0.12)';
        ctx.lineWidth = n1 === hoveredNode ? 1.5 : 0.6;
        ctx.stroke();

        // Lines to same category peers
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          if (n1.cat === n2.cat) {
            const dx = n1.x - n2.x;
            const dy = n1.y - n2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 160) {
              ctx.beginPath();
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
              const isHoveredCluster = (hoveredNode && hoveredNode.cat === n1.cat);
              ctx.strokeStyle = isHoveredCluster ? 'rgba(177, 18, 38, 0.45)' : 'rgba(255, 255, 255, 0.05)';
              ctx.lineWidth = isHoveredCluster ? 1 : 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Draw Nodes
      nodes.forEach((n) => {
        const isMuted = activeCategory !== 'all' && n.cat !== activeCategory;
        const isHovered = n === hoveredNode || n === selectedNode;

        // Subtle organic float
        n.x += n.vx;
        n.y += n.vy;
        if (Math.abs(n.x - cWidth / 2) > cWidth * 0.45) n.vx *= -1;
        if (Math.abs(n.y - cHeight / 2) > cHeight * 0.45) n.vy *= -1;

        ctx.beginPath();
        ctx.arc(n.x, n.y, isHovered ? 11 : n.baseRadius, 0, Math.PI * 2);

        if (isHovered) {
          ctx.fillStyle = '#ff1a2a';
          ctx.shadowColor = '#ff1a1a';
          ctx.shadowBlur = 18;
        } else if (n.cat === 'ai') {
          ctx.fillStyle = isMuted ? 'rgba(100,20,20,0.3)' : 'rgba(255, 26, 42, 0.85)';
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = isMuted ? 'rgba(50,50,50,0.2)' : 'rgba(180, 180, 180, 0.7)';
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Label
        if (!isMuted || isHovered) {
          ctx.font = isHovered ? 'bold 11px "Space Grotesk"' : '9px "JetBrains Mono"';
          ctx.fillStyle = isHovered ? '#ffffff' : (n.cat === 'ai' ? '#ff4d5a' : '#888888');
          ctx.textAlign = 'center';
          ctx.fillText(n.name, n.x, n.y + (isHovered ? 20 : 16));
        }
      });

      requestAnimationFrame(renderConstellation);
    }
    renderConstellation();
  }

  // -------------------------------------------------------------------------
  // 02. FULLSCREEN PROJECT ARCHITECTURE MODAL SYSTEM
  // -------------------------------------------------------------------------
  const projectModal = document.getElementById('cinematic-project-modal');
  const modalMeta = document.getElementById('c-modal-meta');
  const modalTitle = document.getElementById('c-modal-title');
  const modalBody = document.getElementById('c-modal-body');
  const modalGithub = document.getElementById('c-modal-github');
  const modalDismiss = document.querySelectorAll('.modal-dismiss-btn');

  const fullProjectSpecs = {
    'rag-assistant': {
      meta: 'GENAI // LOCAL LLM // VECTOR RETRIEVAL // 2026',
      title: 'RAG-Powered Document Assistant',
      github: 'https://github.com/Ahmad-Salah-22/RAG-Powered-Document-Assistant-',
      html: `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:rgba(139,0,0,0.15); border:1px solid rgba(177,18,38,0.4); padding:20px; border-radius:8px;">
            <h4 style="color:#ff1a2a; font-family:var(--font-tech); font-size:0.85rem; letter-spacing:0.1em; margin-bottom:8px;">PIPELINE BLUEPRINT</h4>
            <p style="color:#f5f5f5; font-size:0.95rem; line-height:1.7;">
              Raw PDF Collection &rarr; <strong>PyPDF Page Extraction</strong> &rarr; <strong>Text Cleaning & Chunking (800 chars, 150 overlap)</strong> &rarr; <strong>all-MiniLM-L6-v2 Embeddings (384-dim)</strong> &rarr; <strong>Persistent ChromaDB</strong> &rarr; Cosine Similarity Top-K Retrieval &rarr; <strong>Ollama Local LLM (Llama 3 8B)</strong> &rarr; <strong>Grounded Answer with Page Citations</strong>.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-editorial); font-size:1.2rem; margin-bottom:12px;">Detailed Architectural Engineering</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:#b0b0b0;">
              <li><strong style="color:#fff;">FastAPI Backend:</strong> Engineered <code style="color:#ff1a2a;">POST /query</code> and <code style="color:#ff1a2a;">GET /health</code> endpoints with Pydantic request validation and structured logging. Loaded the vector store and embedding model once at startup using the lifespan handler to eliminate per-request latency.</li>
              <li><strong style="color:#fff;">Hallucination Guardrails:</strong> Integrated a local Ollama LLM (Llama 3 8B) with a strict grounding prompt so answers cite their source chunks and fall back to a safe fallback response instead of fabricating answers.</li>
              <li><strong style="color:#fff;">Interface & Testing:</strong> Created a Streamlit chat interface with source citations and loading states. Wrote Pytest tests (valid query, HTTP 422 validation, health check) and containerized the backend and frontend with Docker Compose.</li>
              <li><strong style="color:#fff;">Evaluation:</strong> Evaluated on 10 test questions: in-domain queries retrieved the correct source document and page, and out-of-domain queries returned a fallback message without fabricating answers.</li>
            </ul>
          </div>
        </div>
      `
    },
    'spotify-analytics': {
      meta: 'BIG DATA // API RECOVERY // TIME-SERIES // 2026',
      title: 'Spotify Analytics Dashboard',
      github: 'https://github.com/seifalmaz/spotify-analytics-dashboard',
      html: `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:rgba(139,0,0,0.15); border:1px solid rgba(177,18,38,0.4); padding:20px; border-radius:8px;">
            <h4 style="color:#ff1a2a; font-family:var(--font-tech); font-size:0.85rem; letter-spacing:0.1em; margin-bottom:8px;">DATASET SCALE & RECOVERY</h4>
            <p style="color:#f5f5f5; font-size:0.95rem; line-height:1.7;">
              Analyzed <strong>54,000+ Spotify tracks</strong> across genre clusters, audio feature relationships, popularity trends, explicit vs. clean content, and time-series insights with KPI views and a responsive dark-themed UI.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-editorial); font-size:1.2rem; margin-bottom:12px;">Implementation Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:#b0b0b0;">
              <li><strong style="color:#fff;">Metadata Recovery Pipeline:</strong> Queried the Spotify Web API using <code>track_id</code> values to recover missing release dates, closing dataset gaps required for temporal analysis.</li>
              <li><strong style="color:#fff;">Dataset Enrichment:</strong> Joined a secondary Spotify dataset with left joins and validation checks, recovering missing dates while preserving consistency; enabled year filters, decade trends, and genre evolution analysis.</li>
              <li><strong style="color:#fff;">Plotly Dash Dashboard:</strong> Built an interactive, high-framerate dashboard visualizing 3D feature scatter plots and acoustic distributions.</li>
            </ul>
          </div>
        </div>
      `
    },
    'blockchain-registry': {
      meta: 'WEB3 // SOLIDITY // ETHEREUM // 2026',
      title: 'Online Course Certificate Registry',
      github: 'https://github.com/Ahmad-Salah-22/CertificateProject',
      html: `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:rgba(139,0,0,0.15); border:1px solid rgba(177,18,38,0.4); padding:20px; border-radius:8px;">
            <h4 style="color:#ff1a2a; font-family:var(--font-tech); font-size:0.85rem; letter-spacing:0.1em; margin-bottom:8px;">ON-CHAIN IMMUTABILITY</h4>
            <p style="color:#f5f5f5; font-size:0.95rem; line-height:1.7;">
              Blockchain-based digital certificate registry where course completions are permanently recorded and publicly verifiable on-chain via Ethereum smart contracts.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-editorial); font-size:1.2rem; margin-bottom:12px;">Implementation Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:#b0b0b0;">
              <li><strong style="color:#fff;">Smart Contracts:</strong> Developed Solidity smart contracts with role-based access control (admin/user), batch operations, and emergency pause/resume circuit breakers.</li>
              <li><strong style="color:#fff;">Python Terminal Engine:</strong> Implemented Python Web3.py client with admin/user menus, live event alerts, and transaction history scanning.</li>
              <li><strong style="color:#fff;">Audits & Analytics:</strong> Wrote automated security tests, a balance snapshot CSV exporter, and an admin dashboard script for ecosystem monitoring.</li>
            </ul>
          </div>
        </div>
      `
    },
    'waste-classifier': {
      meta: 'DEEP LEARNING // COMPUTER VISION // SUSTAINABILITY',
      title: 'Waste Classifier – Intelligent Recycling',
      github: 'https://github.com/seifalmaz/waste-classifier',
      html: `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:rgba(139,0,0,0.15); border:1px solid rgba(177,18,38,0.4); padding:20px; border-radius:8px;">
            <h4 style="color:#ff1a2a; font-family:var(--font-tech); font-size:0.85rem; letter-spacing:0.1em; margin-bottom:8px;">5 MUNICIPAL CATEGORIES</h4>
            <p style="color:#f5f5f5; font-size:0.95rem; line-height:1.7;">
              Deep learning image classification system that sorts municipal waste into <strong>5 categories (plastic, paper, glass, metal, organic)</strong> to support smart recycling and environmental sustainability.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-editorial); font-size:1.2rem; margin-bottom:12px;">Implementation Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:#b0b0b0;">
              <li><strong style="color:#fff;">CNN Architecture:</strong> Trained convolutional neural networks with customized data augmentation to handle real-world lighting variance.</li>
              <li><strong style="color:#fff;">Inference Engine:</strong> High-confidence softmax output sorting recycling streams with low false-positive rates between plastics and metals.</li>
            </ul>
          </div>
        </div>
      `
    },
    'gesture-recognition': {
      meta: 'CNN // TRANSFER LEARNING // MODEL EXPLAINABILITY',
      title: 'Hand Gesture Recognition System',
      github: 'https://github.com/seifalmaz/gesture-recognition',
      html: `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:rgba(139,0,0,0.15); border:1px solid rgba(177,18,38,0.4); padding:20px; border-radius:8px;">
            <h4 style="color:#ff1a2a; font-family:var(--font-tech); font-size:0.85rem; letter-spacing:0.1em; margin-bottom:8px;">REAL-TIME VIDEO STREAMING</h4>
            <p style="color:#f5f5f5; font-size:0.95rem; line-height:1.7;">
              CNN-based classifiers using transfer learning to recognize gestures (peace, stop, help) from real-time webcam streams with Tkinter GUI and Grad-CAM explainability.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-editorial); font-size:1.2rem; margin-bottom:12px;">Implementation Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:#b0b0b0;">
              <li><strong style="color:#fff;">Model Benchmarking:</strong> Compared multiple CNN architectures to identify optimal latency versus accuracy trade-offs.</li>
              <li><strong style="color:#fff;">Model Explainability:</strong> Visualized prediction confidence and Grad-CAM saliency maps to confirm hand landmark focal points.</li>
            </ul>
          </div>
        </div>
      `
    },
    'task-manager-api': {
      meta: 'FASTAPI // REDIS CACHE // RBAC // SQLITE',
      title: 'Task Manager API',
      github: 'https://github.com/ahmedelhossary22/Task-Management-System-Python-and-R-language-project',
      html: `
        <div style="display:flex; flex-direction:column; gap:20px;">
          <div style="background:rgba(139,0,0,0.15); border:1px solid rgba(177,18,38,0.4); padding:20px; border-radius:8px;">
            <h4 style="color:#ff1a2a; font-family:var(--font-tech); font-size:0.85rem; letter-spacing:0.1em; margin-bottom:8px;">HIGH CONCURRENCY ARCHITECTURE</h4>
            <p style="color:#f5f5f5; font-size:0.95rem; line-height:1.7;">
              Backend system for managing projects and tracking tasks with workflow validation, role-based access control (Admin, Manager, Member), and in-memory Redis caching.
            </p>
          </div>
          <div>
            <h4 style="color:#fff; font-family:var(--font-editorial); font-size:1.2rem; margin-bottom:12px;">Implementation Highlights</h4>
            <ul style="list-style:none; display:flex; flex-direction:column; gap:10px; font-size:0.92rem; color:#b0b0b0;">
              <li><strong style="color:#fff;">Caching Layer:</strong> Integrated Redis caching to accelerate repetitive state queries and slash database overhead.</li>
              <li><strong style="color:#fff;">Structured Logging & RBAC:</strong> Production-ready validation schemas, error logging, and role permission validation.</li>
            </ul>
          </div>
        </div>
      `
    }
  };

  document.querySelectorAll('.open-modal-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const pKey = btn.getAttribute('data-project');
      const spec = fullProjectSpecs[pKey];
      if (spec && projectModal) {
        modalMeta.textContent = spec.meta;
        modalTitle.textContent = spec.title;
        modalBody.innerHTML = spec.html;
        modalGithub.href = spec.github;
        projectModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  // -------------------------------------------------------------------------
  // 04. CERTIFICATIONS CATEGORY FILTER
  // -------------------------------------------------------------------------
  const certFilterPills = document.querySelectorAll('.cert-filter-pill');
  const certCards = document.querySelectorAll('.cert-card-enhanced');

  certFilterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      certFilterPills.forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.getAttribute('data-filter');
      certCards.forEach((card) => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('filtered-out');
        } else {
          card.classList.add('filtered-out');
        }
      });
    });
  });

  // -------------------------------------------------------------------------
  // 05. CERTIFICATE INSPECTOR & LIGHTBOX MODAL
  // -------------------------------------------------------------------------
  const certModal = document.getElementById('cinematic-cert-modal');
  const certModalTitle = document.getElementById('c-cert-title');
  const certModalMeta = document.getElementById('c-cert-meta');
  const certModalDesc = document.getElementById('c-cert-desc');
  const certModalImg = document.getElementById('c-cert-img');
  const certModalPdf = document.getElementById('c-cert-pdf');

  // Curriculum descriptions for specialized tracks
  const trackDetails = {
    'AI 2 Intensive Training': 'Specialized intensive track completed at the Information Technology Institute (ITI). The curriculum focused on Deep Learning architectures, Neural Network training, Computer Vision CNN classifiers, and Natural Language Processing pipelines.',
    'Flutter Application Development': 'Intensive mobile architecture track completed at the Information Technology Institute (ITI). The curriculum covered advanced Dart programming, Clean Architecture patterns, BLoC state management, and enterprise REST API integrations.',
    'Flutter Mobile Engineering Diploma': 'Comprehensive professional software engineering diploma completed at Route Academy. Covered full-lifecycle cross-platform mobile engineering with Flutter, Dart OOP, local SQLite storage, Firebase backend, and Clean Architecture.',
    'Python Essentials 1': 'Certified foundational software engineering course by Cisco Networking Academy and the Python Institute. Covers procedural programming, data structures, algorithm logic, exception handling, and modular architecture.'
  };

  const openCertModal = (title, org, date, img, pdf) => {
    if (!certModal) return;
    certModalTitle.textContent = title || 'Certificate Document';
    certModalMeta.textContent = `${org || 'Verified Issuer'} // ${date || 'Accredited'}`;

    if (trackDetails[title]) {
      if (certModalDesc) {
        certModalDesc.textContent = trackDetails[title];
        certModalDesc.style.display = 'block';
      }
    } else {
      if (certModalDesc) {
        certModalDesc.style.display = 'none';
        certModalDesc.textContent = '';
      }
    }

    if (img) {
      certModalImg.src = img;
      certModalImg.style.display = 'block';
    } else {
      certModalImg.style.display = 'none';
      certModalImg.src = '';
    }

    if (pdf) {
      certModalPdf.href = pdf;
      certModalPdf.style.display = 'inline-flex';
    } else {
      certModalPdf.style.display = 'none';
    }

    certModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  document.querySelectorAll('.cert-lightbox-trigger').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const title = btn.getAttribute('data-title');
      const org = btn.getAttribute('data-org');
      const date = btn.getAttribute('data-date');
      const img = btn.getAttribute('data-img');
      const pdf = btn.getAttribute('data-pdf');
      openCertModal(title, org, date, img, pdf);
    });
  });

  document.querySelectorAll('.cert-card-enhanced').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-cert-inspect')) return;
      const btn = card.querySelector('.cert-lightbox-trigger');
      if (btn) {
        const title = btn.getAttribute('data-title');
        const org = btn.getAttribute('data-org');
        const date = btn.getAttribute('data-date');
        const img = btn.getAttribute('data-img');
        const pdf = btn.getAttribute('data-pdf');
        openCertModal(title, org, date, img, pdf);
      }
    });
  });

  // Close modals
  const closeAllModals = () => {
    document.querySelectorAll('.cinematic-modal-overlay').forEach((m) => m.classList.remove('open'));
    document.body.style.overflow = '';
  };

  modalDismiss.forEach((btn) => btn.addEventListener('click', closeAllModals));
  document.querySelectorAll('.cinematic-modal-overlay').forEach((overlay) => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeAllModals();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllModals();
  });
})();
