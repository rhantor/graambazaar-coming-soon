// ============================================================
//  GraamBazaar — Public Timeline Renderer
//  All icons are inline SVG (Lucide) — zero emoji
// ============================================================

// Maps milestone category → Lucide SVG path data
const ICON_MAP = {
    design: `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
    domain: `<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>`,
    product: `<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>`,
    delivery: `<rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>`,
    payment: `<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>`,
    launch: `<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>`,
    mobile: `<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>`,
    social: `<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>`,
    security: `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>`,
    test: `<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>`,
    analytics: `<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>`,
    server: `<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/>`,
    users: `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,
    map: `<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>`,
    default: `<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/>`,
};

function svgIcon(key, cls = "") {
    const d = ICON_MAP[key] || ICON_MAP.default;
    return `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

function calIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;
}

function checkIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
}
function refreshIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>`;
}
function clockIcon() {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
}

function formatDate(str) {
    if (!str) return "—";
    const d = new Date(str);
    return d.toLocaleDateString("bn-BD", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

export function renderPublicTimeline(milestones) {
    const container = document.getElementById("public-timeline");
    const spineProgress = document.getElementById("tl-spine-prog");
    const progBar = document.getElementById("progress-bar");
    const progPct = document.getElementById("progress-pct");
    const phaseBanner = document.getElementById("phase-banner");
    const phaseName = document.getElementById("phase-name");
    const phaseDesc = document.getElementById("phase-desc");

    if (!container) return;

    // ── Metrics ──────────────────────────────────────────────
    const total = milestones.length;
    const doneCount = milestones.filter((m) => m.status === "done").length;
    const inProg = milestones.find((m) => m.status === "inprogress");
    const pct = total ? Math.round((doneCount / total) * 100) : 0;

    // progress bar
    setTimeout(() => {
        if (progBar) progBar.style.width = pct + "%";
        if (spineProgress) spineProgress.style.height = pct + "%";
    }, 400);
    if (progPct) progPct.textContent = pct + "%";

    // phase banner
    if (inProg && phaseBanner) {
        phaseBanner.style.display = "flex";
        phaseName.textContent = inProg.title;
        phaseDesc.textContent =
            inProg.description || "বর্তমানে এই ধাপে কাজ চলছে";
    } else if (phaseBanner) {
        phaseBanner.style.display = "none";
    }

    // ── Render entries ────────────────────────────────────────
    container.innerHTML = milestones
        .map((m, i) => {
            const icon = svgIcon(m.icon || "default");
            const dotIcon =
                m.status === "done"
                    ? checkIcon()
                    : m.status === "inprogress"
                      ? refreshIcon()
                      : clockIcon();

            const chipHtml =
                m.status === "done"
                    ? `<span class="status-chip chip-done">${checkIcon()} সম্পন্ন</span>`
                    : m.status === "inprogress"
                      ? `<span class="status-chip chip-inprogress">${refreshIcon()} চলছে
            <span class="live-chip"><span class="live-dot"></span>LIVE</span>
           </span>`
                      : `<span class="status-chip chip-pending">${clockIcon()} অপেক্ষমান</span>`;

            // added the tl dot wrapper for the dot bg so that the line is not showen through the dot
            return `
    <div class="tl-entry" data-delay="${i * 90}" id="tl-${m.id}">
      <div class="tl-dot-wrapper">
      <div class="tl-dot ${m.status}">${dotIcon}</div>
      </div>
      <div class="tl-card ${m.status}">
        <div class="tl-card-top">
          <div class="tl-card-title">
            <span style="display:inline-flex;align-items:center;gap:7px;vertical-align:middle">
              <span style="display:inline-flex;color:var(--brand)">${icon}</span>
              ${m.title}
            </span>
          </div>
          ${chipHtml}
        </div>
        ${m.description ? `<div class="tl-card-desc">${m.description}</div>` : ""}
        <div class="tl-card-date">${calIcon()} ${formatDate(m.date)}</div>
      </div>
    </div>`;
        })
        .join("");

    // ── Intersection observer for staggered reveal ────────────
    const entries = container.querySelectorAll(".tl-entry");
    const obs = new IntersectionObserver(
        (items) => {
            items.forEach((it) => {
                if (it.isIntersecting) {
                    const delay = parseInt(it.target.dataset.delay || 0);
                    setTimeout(
                        () => it.target.classList.add("revealed"),
                        delay,
                    );
                    obs.unobserve(it.target);
                }
            });
        },
        { threshold: 0.08 },
    );
    entries.forEach((el) => obs.observe(el));
}
