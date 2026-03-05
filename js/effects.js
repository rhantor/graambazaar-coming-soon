// ============================================================
//  GraamBazaar — Ambient Effects
// ============================================================

// ── CURSOR ──────────────────────────────────────────────────
export function initCursor() {
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');

  // Current real mouse position
  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;

  // Ring lags behind with lerp
  let rx = mx, ry = my;
  const LERP = 0.12;

  // Current scale state
  let scale = 1;
  let targetScale = 1;
  const SCALE_LERP = 0.15;

  // ── Move dot instantly
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  // ── Animate ring and cursor with lerp
  function animate() {
    rx += (mx - rx) * LERP;
    ry += (my - ry) * LERP;
    scale += (targetScale - scale) * SCALE_LERP;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
    cursor.style.transform = `translate(-50%, -50%) scale(${scale})`;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
    requestAnimationFrame(animate);
  }
  animate();

  // ── Scale cursor on hover
  document.querySelectorAll('a,button,input,select,.tl-card,.m-action-btn,.cta-btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      targetScale = 1.5;
    });
    el.addEventListener('mouseleave', () => {
      targetScale = 1;
    });
  });
}

// ── PARTICLES ───────────────────────────────────────────────
export function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const count = Math.min(60, Math.floor(window.innerWidth / 22));
  const pts = Array.from({ length: count }, () => ({
    x:  Math.random() * window.innerWidth,
    y:  Math.random() * window.innerHeight,
    r:  Math.random() * 2.2 + .6,
    vx: (Math.random() - .5) * .35,
    vy: (Math.random() - .5) * .35,
    o:  Math.random() * .4 + .06,
    g:  Math.random() > .5 ? '16,185,129' : '56,189,248',
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // connections
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(16,185,129,${.12 * (1 - d / 110)})`;
          ctx.lineWidth   = .7;
          ctx.stroke();
        }
      }
    }

    // dots
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.g},${p.o})`;
      ctx.fill();

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10)              p.x = canvas.width + 10;
      if (p.x > canvas.width + 10)  p.x = -10;
      if (p.y < -10)              p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;
    });

    requestAnimationFrame(draw);
  }
  draw();
}

// ── SUPPLY CHAIN ANIMATION ───────────────────────────────────
export function runChainAnimation() {
  const n1  = document.getElementById('chain-farmer');
  const n2  = document.getElementById('chain-hub');
  const n3  = document.getElementById('chain-consumer');
  const f1  = document.getElementById('chain-fill-1');
  const f2  = document.getElementById('chain-fill-2');
  if (!n1) return;

  function run() {
    [n1, n2, n3].forEach(n => n && n.classList.remove('lit'));
    if (f1) f1.style.width = '0';
    if (f2) f2.style.width = '0';

    setTimeout(() => n1 && n1.classList.add('lit'), 400);
    setTimeout(() => f1 && (f1.style.width = '100%'), 900);
    setTimeout(() => n2 && n2.classList.add('lit'), 2600);
    setTimeout(() => f2 && (f2.style.width = '100%'), 3100);
    setTimeout(() => n3 && n3.classList.add('lit'), 4800);
  }

  run();
  setInterval(run, 8500);
}
