// === BACKGROUND NETWORK CANVAS ========================================

const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;
let scale = 1;

const NODE_COUNT = 58;
const MAX_DISTANCE = 220;
const nodes = [];

function resizeCanvas() {
  scale = window.devicePixelRatio || 1;
  width = window.innerWidth * scale;
  height = window.innerHeight * scale;

  canvas.width = width;
  canvas.height = height;

  // If nodes array is empty (first run), populate
  if (!nodes.length) {
    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push(createNode());
    }
  } else {
    // Reposition existing nodes randomly on resize
    for (const node of nodes) {
      node.x = Math.random() * width;
      node.y = Math.random() * height;
    }
  }
}

function createNode() {
  const speed = 0.08 + Math.random() * 0.12; // slow and subtle
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: Math.cos(angle) * speed * scale,
    vy: Math.sin(angle) * speed * scale,
  };
}

function updateNodes() {
  for (const node of nodes) {
    node.x += node.vx;
    node.y += node.vy;

    // bounce on edges
    if (node.x < 0 || node.x > width) node.vx *= -1;
    if (node.y < 0 || node.y > height) node.vy *= -1;
  }
}

function renderNetwork() {
  ctx.clearRect(0, 0, width, height);

  // Draw connections
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i];
      const b = nodes[j];

      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MAX_DISTANCE * scale) {
        const alpha = 1 - dist / (MAX_DISTANCE * scale);

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(124, 92, 255, ${alpha * 0.22})`;
        ctx.lineWidth = 0.8 * scale;
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (const node of nodes) {
    ctx.beginPath();
    ctx.arc(node.x, node.y, 1.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(245, 242, 235, 0.5)";
    ctx.fill();

    // restrained secondary glow
    ctx.beginPath();
    ctx.arc(node.x, node.y, 3.5 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(106, 169, 255, 0.1)";
    ctx.lineWidth = 0.5 * scale;
    ctx.stroke();
  }
}

function animate() {
  updateNodes();
  renderNetwork();
  requestAnimationFrame(animate);
}

// === CONTACT SETUP =====================================================

function setupEmailLinks() {
  // Obfuscate slightly to dodge basic scrapers
  const user = "rincorpes";
  const domain = "gmail.com";

  const emailLinks = document.querySelectorAll("[data-contact='email']");
  const href = `mailto:${user}@${domain}`;

  emailLinks.forEach((el) => {
    el.href = href;
  });
}

function setupYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// === SYSTEM MONITOR =====================================================

function setupWatcher() {
  const pet = document.querySelector(".watcher");
  const labelEl = document.getElementById("watcher-label");
  const tooltipEl = document.getElementById("watcher-tooltip");

  if (!pet || !labelEl || !tooltipEl) return;

  const states = [
    {
      label: "Idle",
      hint: "System monitor: nominal.",
    },
    {
      label: "Tracing",
      hint: "Tracing signals across projects, links, and proof surfaces.",
    },
    {
      label: "Resolving",
      hint: "Dependencies stable. Workflow graph responding as expected.",
    },
    {
      label: "Executing",
      hint: "Status: building systems that reduce friction and ship cleanly.",
    },
  ];

  let stateIndex = 0;

  function applyState() {
    const state = states[stateIndex];
    labelEl.textContent = state.label;
    tooltipEl.textContent = state.hint;
  }

  pet.addEventListener("click", () => {
    stateIndex = (stateIndex + 1) % states.length;
    applyState();
  });

  applyState();
}

// === INIT ===============================================================

window.addEventListener("resize", resizeCanvas);

window.addEventListener("load", () => {
  resizeCanvas();
  animate();
  setupEmailLinks();
  setupYear();
  setupWatcher();
});
