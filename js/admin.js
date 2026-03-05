// ============================================================
//  GraamBazaar — Admin Panel
//  Firebase Email/Password Auth + Firestore CRUD
// ============================================================

import { auth, db } from './firebase-config.js';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  collection, addDoc, updateDoc, deleteDoc,
  doc, getDocs, query, orderBy, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ── Icon options (Lucide key → label) ──────────────────────
export const ICON_OPTIONS = [
  { key: 'design',   label: 'Design',   d: `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>` },
  { key: 'domain',   label: 'Globe',    d: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>` },
  { key: 'product',  label: 'Package',  d: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>` },
  { key: 'delivery', label: 'Truck',    d: `<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>` },
  { key: 'payment',  label: 'Card',     d: `<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>` },
  { key: 'launch',   label: 'Rocket',   d: `<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>` },
  { key: 'mobile',   label: 'Phone',    d: `<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>` },
  { key: 'security', label: 'Shield',   d: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>` },
  { key: 'test',     label: 'CheckSq',  d: `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>` },
  { key: 'analytics',label: 'BarChart', d: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>` },
  { key: 'server',   label: 'Server',   d: `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>` },
  { key: 'users',    label: 'Users',    d: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` },
  { key: 'map',      label: 'Map',      d: `<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>` },
  { key: 'social',   label: 'Facebook', d: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>` },
  { key: 'default',  label: 'Star',     d: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>` },
];

function mkSVG(d) {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

// ── State ────────────────────────────────────────────────────
let editingId     = null;
let selectedIcon  = 'default';
let cachedMilestones = [];

// ── Auth gate ────────────────────────────────────────────────
export function initAdmin() {
  onAuthStateChanged(auth, user => {
    if (user) showPanel();
    else      showLogin();
  });

  // Login form
  document.getElementById('login-btn').addEventListener('click', doLogin);
  ['admin-email','admin-pass'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') doLogin();
    });
  });

  // Close modal
  document.getElementById('admin-close').addEventListener('click', () => {
    document.getElementById('admin-modal').classList.remove('open');
  });

  // Open modal (secret hotkey: Ctrl+Shift+A)
  document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
      document.getElementById('admin-modal').classList.add('open');
    }
  });

  // Tabs
  document.querySelectorAll('.a-tab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // Add button
  document.getElementById('add-milestone-btn').addEventListener('click', () => openForm());
  document.getElementById('f-cancel').addEventListener('click', closeForm);
  document.getElementById('f-save').addEventListener('click', saveMilestone);

  // Build icon picker
  buildIconPicker();
}

async function doLogin() {
  const email = document.getElementById('admin-email').value.trim();
  const pass  = document.getElementById('admin-pass').value;
  const err   = document.getElementById('login-err');
  const btn   = document.getElementById('login-btn');

  err.style.display = 'none';
  btn.textContent   = 'লগইন হচ্ছে...';
  btn.disabled      = true;

  try {
    await signInWithEmailAndPassword(auth, email, pass);
  } catch(e) {
    err.style.display = 'block';
    err.textContent   = 'ভুল ইমেইল বা পাসওয়ার্ড। আবার চেষ্টা করুন।';
    btn.textContent   = 'লগইন করুন';
    btn.disabled      = false;
  }
}

function showLogin() {
  document.getElementById('admin-login-view').style.display  = 'flex';
  document.getElementById('admin-panel-view').style.display  = 'none';
}

function showPanel() {
  document.getElementById('admin-login-view').style.display  = 'none';
  document.getElementById('admin-panel-view').style.display  = 'flex';
  loadMilestones();
}

// ── Tabs ─────────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.a-tab').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  document.querySelectorAll('.a-panel').forEach(p => p.classList.toggle('on', p.id === 'panel-' + tab));
  if (tab === 'stats') renderStats();
}

// ── Firestore CRUD ───────────────────────────────────────────
async function loadMilestones() {
  const snap = await getDocs(query(collection(db, 'milestones'), orderBy('order', 'asc')));
  cachedMilestones = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  renderAdminList();
  renderStats();
}

async function saveMilestone() {
  const title  = document.getElementById('f-title').value.trim();
  const desc   = document.getElementById('f-desc').value.trim();
  const date   = document.getElementById('f-date').value;
  const status = document.getElementById('f-status').value;
  const order  = parseInt(document.getElementById('f-order').value) || 99;

  if (!title) { alert('নাম দিন!'); return; }

  const payload = { title, description: desc, date, status, icon: selectedIcon, order, updatedAt: serverTimestamp() };

  if (editingId) {
    await updateDoc(doc(db, 'milestones', editingId), payload);
  } else {
    payload.createdAt = serverTimestamp();
    await addDoc(collection(db, 'milestones'), payload);
  }

  closeForm();
  loadMilestones();
}

async function deleteMilestone(id) {
  if (!confirm('এই মাইলস্টোনটি মুছে ফেলবেন?')) return;
  await deleteDoc(doc(db, 'milestones', id));
  loadMilestones();
}

// ── Form helpers ─────────────────────────────────────────────
function openForm(id = null) {
  editingId = id;
  const form = document.getElementById('m-form');
  form.classList.add('open');

  if (id) {
    const m = cachedMilestones.find(x => x.id === id);
    document.getElementById('f-title').value  = m.title || '';
    document.getElementById('f-desc').value   = m.description || '';
    document.getElementById('f-date').value   = m.date || '';
    document.getElementById('f-status').value = m.status || 'pending';
    document.getElementById('f-order').value  = m.order ?? 99;
    setSelectedIcon(m.icon || 'default');
    document.getElementById('m-form-title-text').textContent = 'মাইলস্টোন সম্পাদনা';
  } else {
    document.getElementById('f-title').value  = '';
    document.getElementById('f-desc').value   = '';
    document.getElementById('f-date').value   = '';
    document.getElementById('f-status').value = 'pending';
    document.getElementById('f-order').value  = '';
    setSelectedIcon('default');
    document.getElementById('m-form-title-text').textContent = 'নতুন মাইলস্টোন';
  }

  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeForm() {
  document.getElementById('m-form').classList.remove('open');
  editingId = null;
}

// ── Icon picker ──────────────────────────────────────────────
function buildIconPicker() {
  const grid    = document.getElementById('icon-grid');
  const preview = document.getElementById('icon-preview-svg');

  grid.innerHTML = ICON_OPTIONS.map(o =>
    `<button class="icon-opt" data-key="${o.key}" title="${o.label}">${mkSVG(o.d)}</button>`
  ).join('');

  grid.querySelectorAll('.icon-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      setSelectedIcon(btn.dataset.key);
      document.getElementById('icon-dropdown').classList.remove('open');
      document.getElementById('icon-preview-btn').classList.remove('open');
    });
  });

  document.getElementById('icon-preview-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const dd = document.getElementById('icon-dropdown');
    dd.classList.toggle('open');
    e.currentTarget.classList.toggle('open');
  });

  document.addEventListener('click', () => {
    document.getElementById('icon-dropdown').classList.remove('open');
    document.getElementById('icon-preview-btn')?.classList.remove('open');
  });
}

function setSelectedIcon(key) {
  selectedIcon = key;
  const o = ICON_OPTIONS.find(x => x.key === key) || ICON_OPTIONS[0];
  const preview = document.getElementById('icon-preview-svg');
  if (preview) preview.innerHTML = mkSVG(o.d);
  document.querySelectorAll('.icon-opt').forEach(b => b.classList.toggle('sel', b.dataset.key === key));
}

// ── Render admin list ─────────────────────────────────────────
function renderAdminList() {
  const list = document.getElementById('m-list');
  if (!cachedMilestones.length) {
    list.innerHTML = `<div style="color:rgba(255,255,255,.25);text-align:center;padding:32px;font-size:.85rem">কোনো মাইলস্টোন নেই।</div>`;
    return;
  }

  list.innerHTML = cachedMilestones.map(m => {
    const o    = ICON_OPTIONS.find(x => x.key === m.icon) || ICON_OPTIONS[0];
    const icon = mkSVG(o.d);
    const chipCls = m.status === 'done' ? 'mc-done' : m.status === 'inprogress' ? 'mc-inprogress' : 'mc-pending';
    const chipTxt = m.status === 'done' ? 'সম্পন্ন' : m.status === 'inprogress' ? 'চলছে' : 'অপেক্ষমান';

    return `
    <div class="m-item ${m.status}">
      <div class="m-item-icon">${icon}</div>
      <div class="m-item-body">
        <span class="m-chip ${chipCls}">${chipTxt}</span>
        <div class="m-item-title">${m.title}</div>
        <div class="m-item-desc">${m.description || 'কোনো বিবরণ নেই'}</div>
        <div class="m-item-date">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          ${m.date ? new Date(m.date).toLocaleDateString('bn-BD', {year:'numeric',month:'long',day:'numeric'}) : '—'}
        </div>
      </div>
      <div class="m-item-actions">
        <button class="m-action-btn btn-edit" onclick="window._adminEdit('${m.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
        <button class="m-action-btn btn-del" onclick="window._adminDel('${m.id}')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  // expose to inline handlers
  window._adminEdit = openForm;
  window._adminDel  = deleteMilestone;
}

// ── Stats ─────────────────────────────────────────────────────
function renderStats() {
  const done   = cachedMilestones.filter(m => m.status === 'done').length;
  const inprog = cachedMilestones.filter(m => m.status === 'inprogress').length;
  const pend   = cachedMilestones.filter(m => m.status === 'pending').length;

  const set = (id, val) => { const el = document.getElementById(id); if(el) el.textContent = val; };
  set('stat-done', done);
  set('stat-inprog', inprog);
  set('stat-pending', pend);
}
