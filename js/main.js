// ============================================================
//  GraamBazaar — Main Application JS
//  Reads milestones from Firebase Firestore in real-time
// ============================================================

import { db }           from './firebase-config.js';
import {
  collection, onSnapshot, query, orderBy
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { renderPublicTimeline } from './timeline.js';
import { initParticles }        from './particles.js';
import { initCursor }           from './cursor.js';
import { runChainAnimation }    from './chain.js';

// ── Boot ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  runChainAnimation();
  subscribeToMilestones();
  initSubscribeForm();
});

// ── Firebase real-time listener ────────────────────────────
export let milestones = [];

function subscribeToMilestones() {
  const q = query(collection(db, 'milestones'), orderBy('order', 'asc'));

  onSnapshot(q, (snap) => {
    milestones = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderPublicTimeline(milestones);
  }, (err) => {
    console.error('Firestore error:', err);
  });
}

// ── Subscribe form ─────────────────────────────────────────
function initSubscribeForm() {
  const SCRIPT = 'https://script.google.com/macros/s/AKfycbxO7Z2In__CHrUecv5r8JthXRhmoBRtzKVUzvW1ipK7brrRxETGaWzZKbPkYSh3_tad/exec';
  const form   = document.getElementById('subscribe-form');
  const btn    = document.getElementById('sub-btn');
  const overlay= document.getElementById('success-overlay');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    btn.disabled   = true;
    btn.textContent = 'অপেক্ষা করুন...';

    const fd = new FormData(form);
    fetch(SCRIPT, { method: 'POST', body: fd, mode: 'no-cors' }).catch(() => {});

    setTimeout(() => {
      overlay.style.display = 'flex';
      form.reset();
    }, 1400);
  });
}
