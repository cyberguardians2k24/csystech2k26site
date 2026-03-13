import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../../lib/api';

/* ─── constants ─── */
const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: 'grid' },
  { id: 'approvals', label: 'Approvals', icon: 'check-circle' },
  { id: 'registrations', label: 'Registrations', icon: 'clipboard' },
  { id: 'participants', label: 'Participants', icon: 'users' },
  { id: 'events', label: 'Events', icon: 'calendar' },
];

const STATUS_OPTIONS = ['CONFIRMED', 'PENDING', 'CANCELLED', 'WAITLISTED'];
const EVENT_CATEGORIES = ['TECHNICAL', 'CODING', 'KNOWLEDGE', 'SKILL', 'KEYNOTE'];
const EMPTY_EVENT_FORM = {
  name: '',
  slug: '',
  description: '',
  category: 'TECHNICAL',
  maxTeamSize: 1,
  prizeAmount: '',
  venue: '',
  isActive: true,
};

/* ─── helpers ─── */
function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function fmt(iso) {
  return iso
    ? new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';
}

function normalizeRegistration(reg) {
  const participant = reg.participant ?? {};
  const eventObj = typeof reg.event === 'object' && reg.event !== null ? reg.event : null;
  const eventName = eventObj?.name ?? reg.eventName ?? reg.event ?? '—';
  const eventSlug = eventObj?.slug ?? reg.eventSlug ?? '';
  return { ...reg, participant, event: eventName, eventName, eventSlug, eventCategory: eventObj?.category ?? reg.eventCategory };
}

/* ─── icons (inline SVG) ─── */
function Icon({ name, className = 'w-5 h-5' }) {
  const paths = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></>,
    'check-circle': <><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></>,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
    check: <><polyline points="20 6 9 17 4 12" /></>,
    x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
    'chevron-left': <polyline points="15 18 9 12 15 6" />,
    'chevron-right': <polyline points="9 18 15 12 9 6" />,
    menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
    image: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
    activity: <><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></>,
    'bar-chart': <><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></>,
  };
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      {paths[name]}
    </svg>
  );
}

/* ─── UI primitives ─── */
function Card({ children, className = '', noPad = false }) {
  return (
    <div className={`rounded-2xl border border-slate-700/50 bg-slate-800/40 ${noPad ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    CONFIRMED: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    CANCELLED: 'bg-red-500/15 text-red-400 border-red-500/25',
    WAITLISTED: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
    ACTIVE: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    INACTIVE: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${styles[status] ?? styles.PENDING}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    PAID: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
    PENDING: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
    UNPAID: 'bg-slate-500/15 text-slate-400 border-slate-500/25',
    REFUNDED: 'bg-red-500/15 text-red-400 border-red-500/25',
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${styles[status] ?? styles.UNPAID}`}>
      {status}
    </span>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-500/20 border-t-indigo-400" />
    </div>
  );
}

function EmptyState({ icon = 'clipboard', message = 'No data found' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-500">
      <Icon name={icon} className="mb-3 h-10 w-10 opacity-40" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

function StatCard({ label, value, icon, accent = 'indigo' }) {
  const accents = {
    indigo: 'border-indigo-500/30 bg-indigo-500/5 text-indigo-400',
    sky: 'border-sky-500/30 bg-sky-500/5 text-sky-400',
    emerald: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
    amber: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
  };
  return (
    <div className={`rounded-2xl border p-5 ${accents[accent]}`}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
        <Icon name={icon} className="h-5 w-5 opacity-60" />
      </div>
      <p className="text-3xl font-bold text-white">{value ?? '—'}</p>
    </div>
  );
}

/* ─── Poster Modal (canvas generator) ─── */
function PosterModal({ event, onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !event) return;
    const ctx = canvas.getContext('2d');
    const W = 800, H = 1120;
    canvas.width = W;
    canvas.height = H;

    function roundRect(x, y, w, h, r) {
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
    }

    function wrapText(text, x, y, maxWidth, lineH) {
      const words = text.split(' ');
      let line = '', lineY = y;
      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + ' ';
        if (ctx.measureText(test).width > maxWidth && i > 0) {
          ctx.fillText(line.trim(), x, lineY); line = words[i] + ' '; lineY += lineH;
        } else { line = test; }
      }
      ctx.fillText(line.trim(), x, lineY);
    }

    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#05001A'); bg.addColorStop(0.45, '#0E0030'); bg.addColorStop(1, '#030008');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(157,0,255,0.07)'; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 36) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 36) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const topGlow = ctx.createRadialGradient(W / 2, -40, 0, W / 2, -40, 420);
    topGlow.addColorStop(0, 'rgba(157,0,255,0.22)'); topGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGlow; ctx.fillRect(0, 0, W, H * 0.5);

    const botGlow = ctx.createRadialGradient(W / 2, H + 40, 0, W / 2, H + 40, 360);
    botGlow.addColorStop(0, 'rgba(0,240,255,0.12)'); botGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = botGlow; ctx.fillRect(0, H * 0.6, W, H * 0.4);

    ctx.strokeStyle = 'rgba(157,0,255,0.65)'; ctx.lineWidth = 2.5;
    const bLen = 52, bOff = 28;
    [[bOff, bOff, 1, 1], [W - bOff, bOff, -1, 1], [bOff, H - bOff, 1, -1], [W - bOff, H - bOff, -1, -1]].forEach(([x, y, sx, sy]) => {
      ctx.beginPath(); ctx.moveTo(x + sx * bLen, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * bLen); ctx.stroke();
    });

    const makeLineGrad = (c) => { const g = ctx.createLinearGradient(0, 0, W, 0); g.addColorStop(0, 'transparent'); g.addColorStop(0.5, c); g.addColorStop(1, 'transparent'); return g; };
    ctx.strokeStyle = makeLineGrad('rgba(157,0,255,0.7)'); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 148); ctx.lineTo(W, 148); ctx.stroke();

    ctx.fillStyle = 'rgba(180,79,255,0.9)'; ctx.font = 'bold 13px \'Courier New\', monospace'; ctx.textAlign = 'center';
    ctx.fillText('CYSTECH 2026  \u00b7  SYMPO SYMPOSIUM', W / 2, 88);
    ctx.fillStyle = 'rgba(255,255,255,0.22)'; ctx.font = '11px \'Courier New\', monospace';
    ctx.fillText('DEPT. OF COMPUTER SCIENCE', W / 2, 118);

    const catLabel = (event.category || 'EVENT').toUpperCase();
    const catW = ctx.measureText(catLabel).width + 56;
    roundRect(W / 2 - catW / 2, 168, catW, 38, 19);
    ctx.fillStyle = 'rgba(157,0,255,0.12)'; ctx.fill();
    ctx.strokeStyle = 'rgba(180,79,255,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(200,120,255,0.95)'; ctx.font = 'bold 11px \'Courier New\', monospace';
    ctx.fillText(catLabel, W / 2, 192);

    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 60px \'Arial Black\', \'Arial\', sans-serif'; ctx.textAlign = 'center';
    wrapText(event.name || 'Event', W / 2, 288, W - 110, 68);

    ctx.strokeStyle = makeLineGrad('rgba(0,240,255,0.6)'); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(60, 428); ctx.lineTo(W - 60, 428); ctx.stroke();

    let contentY = 468;
    if (event.prizeAmount) {
      ctx.fillStyle = 'rgba(180,79,255,0.6)'; ctx.font = 'bold 11px \'Courier New\', monospace';
      ctx.fillText('\u2606 TOTAL PRIZE POOL \u2606', W / 2, contentY); contentY += 12;
      const prizeGrad = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0);
      prizeGrad.addColorStop(0, '#B44FFF'); prizeGrad.addColorStop(0.5, '#FFFFFF'); prizeGrad.addColorStop(1, '#00f0ff');
      ctx.fillStyle = prizeGrad; ctx.font = 'bold 56px \'Arial Black\', sans-serif';
      ctx.fillText('\u20b9' + event.prizeAmount, W / 2, contentY + 58); contentY += 90;
    }

    const infos = [
      event.venue ? { icon: '\uD83D\uDCCD', key: 'VENUE', val: event.venue } : null,
      { icon: '\uD83D\uDC65', key: 'TEAM SIZE', val: `Up to ${event.maxTeamSize || 1} member${(event.maxTeamSize || 1) > 1 ? 's' : ''}` },
      { icon: '\uD83D\uDCC5', key: 'EVENT DATE', val: 'March 15\u201316, 2026' },
    ].filter(Boolean);

    contentY += 20;
    infos.forEach((info, i) => {
      const cardY = contentY + i * 78;
      roundRect(70, cardY, W - 140, 60, 14);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      ctx.strokeStyle = 'rgba(157,0,255,0.18)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.textAlign = 'left'; ctx.fillStyle = 'rgba(157,0,255,0.75)'; ctx.font = 'bold 10px \'Courier New\', monospace';
      ctx.fillText(`${info.icon}  ${info.key}`, 100, cardY + 22);
      ctx.fillStyle = 'rgba(255,255,255,0.88)'; ctx.font = '15px Arial, sans-serif';
      ctx.fillText(info.val, 100, cardY + 44); ctx.textAlign = 'center';
    });

    ctx.strokeStyle = makeLineGrad('rgba(157,0,255,0.55)'); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 148); ctx.lineTo(W, H - 148); ctx.stroke();

    const ctaText = `REGISTER @ CYSTECH2026 / ${(event.name || 'event').toLowerCase().split(' ').join('-')}`;
    ctx.fillStyle = 'rgba(180,79,255,0.8)'; ctx.font = 'bold 12px \'Courier New\', monospace';
    ctx.fillText(ctaText, W / 2, H - 102);
    ctx.fillStyle = 'rgba(0,240,255,0.4)'; ctx.font = '11px \'Courier New\', monospace';
    ctx.fillText('Scan QR or visit the registration desk on event day', W / 2, H - 74);
    ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.font = '10px \'Courier New\', monospace';
    ctx.fillText('\u00a9 Sympo Organizing Committee \u00b7 All rights reserved', W / 2, H - 48);
  }, [event]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `cystech-poster-${(event.name || 'event').toLowerCase().replace(/\s+/g, '-')}.png`;
    a.click();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
        className="flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-slate-700/50 bg-slate-900 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Poster Preview</p>
            <h3 className="mt-1 text-lg font-bold text-white">{event.name}</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={handleDownload} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
              Download PNG
            </button>
            <button onClick={onClose} className="rounded-lg border border-slate-600 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800">
              Close
            </button>
          </div>
        </div>
        <div className="overflow-auto rounded-xl border border-slate-700/50 bg-black/40 p-3">
          <canvas ref={canvasRef} className="mx-auto block rounded-lg" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Sidebar ─── */
function Sidebar({ tab, setTab, admin, onLogout, pendingCount }) {
  return (
    <aside className="hidden lg:flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-700/50 bg-slate-900/80">
      {/* Brand */}
      <div className="border-b border-slate-700/50 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">
            CS
          </div>
          <div>
            <p className="text-sm font-bold text-white">CYSTECH 2026</p>
            <p className="text-[11px] text-slate-500">Admin Console</p>
          </div>
        </div>
      </div>

      {/* Admin info */}
      <div className="border-b border-slate-700/50 px-5 py-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Online
        </div>
        <p className="mt-1 text-sm font-medium text-white">{admin?.name}</p>
        <p className="truncate text-xs text-slate-500">{admin?.email}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
              tab === item.id
                ? 'bg-indigo-600/15 text-indigo-400 font-medium'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Icon name={item.icon} className="h-[18px] w-[18px]" />
            <span className="flex-1">{item.label}</span>
            {item.id === 'approvals' && pendingCount > 0 && (
              <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-slate-700/50 px-3 py-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-500 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <Icon name="logout" className="h-[18px] w-[18px]" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
   ════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ── state ── */
  const [admin, setAdmin] = useState(null);
  const [tab, setTab] = useState('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [error, setError] = useState('');

  const [dashboard, setDashboard] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [events, setEvents] = useState([]);

  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingRegs, setLoadingRegs] = useState(false);
  const [loadingParticipants, setLoadingParticipants] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [savingEvent, setSavingEvent] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [posterEvent, setPosterEvent] = useState(null);

  const [search, setSearch] = useState('');
  const [filterEvent, setFilterEvent] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [participantSearch, setParticipantSearch] = useState('');
  const [eventForm, setEventForm] = useState(EMPTY_EVENT_FORM);
  const [currentPage, setCurrentPage] = useState(1);

  const PER_PAGE = 20;

  /* ── auth check ── */
  useEffect(() => {
    const stored = localStorage.getItem('cystech_admin');
    if (!stored) { navigate('/admin', { replace: true }); return; }
    try { setAdmin(JSON.parse(stored)); }
    catch { localStorage.removeItem('cystech_admin'); navigate('/admin', { replace: true }); }
  }, [navigate]);

  /* ── data loaders ── */
  const handleError = useCallback((err) => setError(err?.message || 'Something went wrong'), []);
  const handleLogout = useCallback(() => { localStorage.removeItem('cystech_admin'); navigate('/admin', { replace: true }); }, [navigate]);

  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try { setDashboard(await api.getDashboard()); } catch (err) { handleError(err); }
    finally { setLoadingDashboard(false); }
  }, [handleError]);

  const loadRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    try { const data = await api.getRegistrations(1, 500); setRegistrations((data.data ?? []).map(normalizeRegistration)); }
    catch (err) { handleError(err); }
    finally { setLoadingRegs(false); }
  }, [handleError]);

  const loadParticipants = useCallback(async () => {
    setLoadingParticipants(true);
    try { const data = await api.getParticipants(1, 500); setParticipants(data.data ?? []); }
    catch (err) { handleError(err); }
    finally { setLoadingParticipants(false); }
  }, [handleError]);

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    try { setEvents((await api.getEvents(true)) ?? []); }
    catch (err) { handleError(err); }
    finally { setLoadingEvents(false); }
  }, [handleError]);

  useEffect(() => {
    if (!admin) return;
    loadDashboard();
    loadEvents();
  }, [admin, loadDashboard, loadEvents]);

  useEffect(() => {
    if (!admin) return;
    if (tab === 'registrations' || tab === 'approvals') loadRegistrations();
    if (tab === 'participants') loadParticipants();
    if (tab === 'events') loadEvents();
  }, [admin, tab, loadEvents, loadParticipants, loadRegistrations]);

  /* ── derived data ── */
  const eventCountMap = useMemo(
    () => Object.fromEntries((dashboard?.registrationsByEvent ?? []).map((item) => [item.event, item.count])),
    [dashboard],
  );

  const pendingApprovals = useMemo(
    () => registrations.filter((r) => r.paymentStatus === 'PENDING' || r.status === 'PENDING'),
    [registrations],
  );
  const pendingCount = pendingApprovals.length;

  const registrationEventOptions = useMemo(() => {
    const fromRegs = registrations.map((r) => r.eventName);
    const fromDash = (dashboard?.registrationsByEvent ?? []).map((r) => r.event);
    return [...new Set([...fromRegs, ...fromDash].filter(Boolean))].sort();
  }, [dashboard, registrations]);

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return registrations.filter((reg) => {
      const p = reg.participant ?? {};
      const matchesSearch = !query || [p.name, p.email, p.college, reg.eventName].filter(Boolean).some((v) => v.toLowerCase().includes(query));
      const matchesEvent = !filterEvent || reg.eventName === filterEvent;
      const matchesStatus = !filterStatus || reg.status === filterStatus;
      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [filterEvent, filterStatus, registrations, search]);

  const paginatedRegistrations = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredRegistrations.slice(start, start + PER_PAGE);
  }, [currentPage, filteredRegistrations]);

  const totalPages = Math.max(1, Math.ceil(filteredRegistrations.length / PER_PAGE));

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(1); }, [currentPage, totalPages]);

  const filteredParticipants = useMemo(() => {
    const query = participantSearch.trim().toLowerCase();
    return participants.filter((p) => {
      if (!query) return true;
      return [p.name, p.email, p.college, p.phone, p.teamName].filter(Boolean).some((v) => v.toLowerCase().includes(query));
    });
  }, [participantSearch, participants]);

  /* ── handlers ── */
  const handleRefresh = async () => {
    await loadDashboard();
    if (tab === 'registrations' || tab === 'approvals') await loadRegistrations();
    if (tab === 'participants') await loadParticipants();
    if (tab === 'events') await loadEvents();
  };

  const handleQuickApprove = async (id) => {
    try {
      const updated = normalizeRegistration(await api.updatePaymentStatus(id, 'PAID'));
      setRegistrations((cur) => cur.map((item) => (item.id === id ? { ...updated, status: 'CONFIRMED' } : item)));
      await api.updateRegistrationStatus(id, 'CONFIRMED');
      await loadDashboard();
    } catch (err) { handleError(err); }
  };

  const handleQuickReject = async (id) => {
    try {
      const updated = normalizeRegistration(await api.updateRegistrationStatus(id, 'CANCELLED'));
      setRegistrations((cur) => cur.map((item) => (item.id === id ? updated : item)));
      await loadDashboard();
    } catch (err) { handleError(err); }
  };

  const handleExport = async () => {
    try {
      const data = await api.exportEvent(filterEvent || undefined);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `cystech-export-${filterEvent || 'all'}.json`;
      a.click(); URL.revokeObjectURL(url);
    } catch (err) { handleError(err); }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = normalizeRegistration(await api.updateRegistrationStatus(id, status));
      setRegistrations((cur) => cur.map((item) => (item.id === id ? updated : item)));
      await loadDashboard();
    } catch (err) { handleError(err); }
  };

  const handlePaymentStatusChange = async (id, paymentStatus) => {
    try {
      const updated = normalizeRegistration(await api.updatePaymentStatus(id, paymentStatus));
      setRegistrations((cur) => cur.map((item) => (item.id === id ? updated : item)));
      await loadDashboard();
    } catch (err) { handleError(err); }
  };

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      await api.deleteRegistration(id);
      setRegistrations((cur) => cur.filter((item) => item.id !== id));
      await Promise.all([loadDashboard(), loadParticipants()]);
    } catch (err) { handleError(err); }
  };

  const handleDeleteParticipant = async (id) => {
    if (!window.confirm('Delete this participant and related registrations?')) return;
    try {
      await api.deleteParticipant(id);
      setParticipants((cur) => cur.filter((item) => item.id !== id));
      setRegistrations((cur) => cur.filter((item) => item.participant?.id !== id));
      await loadDashboard();
    } catch (err) { handleError(err); }
  };

  const handleEventField = (key) => (e) => {
    const value = key === 'isActive' ? e.target.checked : e.target.value;
    setEventForm((cur) => {
      const next = { ...cur, [key]: value };
      if (key === 'name' && !cur.slug) next.slug = slugify(value);
      return next;
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      await api.createEvent({ ...eventForm, slug: eventForm.slug || slugify(eventForm.name), maxTeamSize: Number(eventForm.maxTeamSize) || 1 });
      setEventForm(EMPTY_EVENT_FORM);
      await Promise.all([loadEvents(), loadDashboard()]);
      setTab('events');
    } catch (err) { handleError(err); }
    finally { setSavingEvent(false); }
  };

  const handleToggleEvent = async (event) => {
    try {
      const updated = await api.updateEvent(event.id, { isActive: !event.isActive });
      setEvents((cur) => cur.map((item) => (item.id === event.id ? updated : item)));
      await loadDashboard();
    } catch (err) { handleError(err); }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event? Registrations linked to it will also be removed.')) return;
    try {
      await api.deleteEvent(id);
      setEvents((cur) => cur.filter((item) => item.id !== id));
      setRegistrations((cur) => cur.filter((item) => item.eventId !== id));
      await Promise.all([loadDashboard(), loadParticipants()]);
    } catch (err) { handleError(err); }
  };

  /* ── page meta ── */
  const pageMeta = {
    overview: { title: 'Dashboard', subtitle: 'Overview of your symposium operations' },
    approvals: { title: 'Pending Approvals', subtitle: `${pendingCount} registration${pendingCount !== 1 ? 's' : ''} waiting for review` },
    registrations: { title: 'Registrations', subtitle: 'Manage all participant registrations' },
    participants: { title: 'Participants', subtitle: 'Directory of all registered participants' },
    events: { title: 'Events', subtitle: 'Create and manage symposium events' },
  }[tab];

  const activeEventsCount = events.filter((e) => e.isActive).length;

  if (!admin) return null;

  /* ════════════════════ RENDER ════════════════════ */
  return (
    <div className="flex min-h-screen bg-[#0f1729] text-white">
      <Sidebar tab={tab} setTab={(next) => { setTab(next); setMobileMenuOpen(false); }} admin={admin} onLogout={handleLogout} pendingCount={pendingCount} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Header ── */}
        <header className="flex items-center justify-between border-b border-slate-700/50 bg-slate-900/60 px-4 py-3 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileMenuOpen((v) => !v)} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 lg:hidden">
              <Icon name="menu" className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">{pageMeta.title}</h1>
              <p className="text-xs text-slate-500">{pageMeta.subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tab === 'registrations' && (
              <button onClick={handleExport} className="hidden items-center gap-1.5 rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800 sm:flex">
                <Icon name="download" className="h-3.5 w-3.5" /> Export
              </button>
            )}
            <button onClick={handleRefresh} className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white" title="Refresh data">
              <Icon name="refresh" className="h-4 w-4" />
            </button>
            <button onClick={handleLogout} className="hidden rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 sm:block lg:hidden">
              Sign Out
            </button>
          </div>
        </header>

        {/* ── Mobile nav overlay ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-[#0f1729]/95 px-6 py-8 backdrop-blur-md lg:hidden">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{admin.name}</p>
                  <p className="text-xs text-slate-500">{admin.email}</p>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="rounded-lg p-2 text-slate-400 hover:text-white">
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-1">
                {NAV_ITEMS.map((item) => (
                  <button key={item.id} onClick={() => { setTab(item.id); setMobileMenuOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left ${tab === item.id ? 'bg-indigo-600/15 text-indigo-400 font-medium' : 'text-slate-400'}`}>
                    <Icon name={item.icon} className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'approvals' && pendingCount > 0 && (
                      <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-black">{pendingCount}</span>
                    )}
                  </button>
                ))}
              </div>
              <button onClick={handleLogout} className="mt-6 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-red-400 hover:bg-red-500/10">
                <Icon name="logout" className="h-5 w-5" /> Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Error banner ── */}
        <AnimatePresence>
          {!!error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mx-4 mt-3 flex items-center justify-between rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 sm:mx-6">
              <span className="text-sm text-red-400">{error}</span>
              <button onClick={() => setError('')} className="ml-3 rounded p-1 text-red-400/60 hover:text-red-400">
                <Icon name="x" className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main Content ── */}
        <main className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">

          {/* ════ OVERVIEW TAB ════ */}
          {tab === 'overview' && (
            <>
              {loadingDashboard ? <Spinner /> : dashboard && (
                <>
                  {/* Stat cards */}
                  <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                    <StatCard label="Participants" value={dashboard.stats.totalParticipants} icon="users" accent="indigo" />
                    <StatCard label="Registrations" value={dashboard.stats.totalRegistrations} icon="clipboard" accent="sky" />
                    <StatCard label="Active Events" value={activeEventsCount} icon="calendar" accent="amber" />
                    <StatCard label="Pending" value={pendingCount} icon="check-circle" accent="emerald" />
                  </div>

                  {/* Charts + Recent */}
                  <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {/* Registrations by event */}
                    <Card>
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white">Registrations by Event</h3>
                          <p className="text-xs text-slate-500">Distribution across events</p>
                        </div>
                        <Icon name="bar-chart" className="h-5 w-5 text-slate-600" />
                      </div>
                      {(dashboard.registrationsByEvent ?? []).length === 0 ? (
                        <EmptyState message="No registration data yet" />
                      ) : (
                        <div className="space-y-3">
                          {dashboard.registrationsByEvent.slice().sort((a, b) => b.count - a.count).map((item, idx, arr) => {
                            const max = Math.max(...arr.map((x) => x.count), 1);
                            const pct = Math.round((item.count / max) * 100);
                            return (
                              <div key={item.event}>
                                <div className="mb-1 flex items-center justify-between">
                                  <span className="text-sm text-slate-300 truncate max-w-[70%]">{item.event}</span>
                                  <span className="text-sm font-semibold text-white">{item.count}</span>
                                </div>
                                <div className="h-2 overflow-hidden rounded-full bg-slate-700/50">
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </Card>

                    {/* Recent registrations */}
                    <Card>
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-semibold text-white">Recent Registrations</h3>
                          <p className="text-xs text-slate-500">Latest submissions</p>
                        </div>
                        <button onClick={() => setTab('registrations')} className="text-xs font-medium text-indigo-400 hover:text-indigo-300">
                          View All &rarr;
                        </button>
                      </div>
                      {(dashboard.recentRegistrations ?? []).length === 0 ? (
                        <EmptyState message="No registrations yet" />
                      ) : (
                        <div className="space-y-2">
                          {dashboard.recentRegistrations.map((item) => (
                            <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-700/40 bg-slate-800/30 px-4 py-3">
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-white">{item.participant?.name}</p>
                                <p className="truncate text-xs text-slate-500">{item.participant?.email}</p>
                                <p className="mt-0.5 text-xs text-indigo-400/80">{item.event}</p>
                              </div>
                              <div className="ml-3 flex shrink-0 flex-col items-end gap-1">
                                <StatusBadge status={item.status} />
                                <PaymentBadge status={item.paymentStatus ?? 'UNPAID'} />
                                <span className="text-[10px] text-slate-600">{fmt(item.createdAt)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </Card>
                  </div>
                </>
              )}
            </>
          )}

          {/* ════ APPROVALS TAB ════ */}
          {tab === 'approvals' && (
            <>
              {loadingRegs ? <Spinner /> : pendingApprovals.length === 0 ? (
                <Card>
                  <EmptyState icon="check-circle" message="No pending approvals — all caught up!" />
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
                  {pendingApprovals.map((reg) => {
                    const p = reg.participant ?? {};
                    return (
                      <Card key={reg.id} className="flex flex-col">
                        {/* Header */}
                        <div className="mb-4 flex items-start justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-white">{p.name || '—'}</p>
                            <p className="truncate text-xs text-slate-500">{p.email}</p>
                          </div>
                          <div className="ml-3 flex flex-col items-end gap-1 shrink-0">
                            <StatusBadge status={reg.status} />
                            <PaymentBadge status={reg.paymentStatus ?? 'UNPAID'} />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="mb-4 grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <span className="text-slate-500">Event</span>
                            <p className="mt-0.5 font-medium text-indigo-400">{reg.eventName}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">College</span>
                            <p className="mt-0.5 text-slate-300 truncate">{p.college || '—'}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Phone</span>
                            <p className="mt-0.5 text-slate-300">{p.phone || '—'}</p>
                          </div>
                          <div>
                            <span className="text-slate-500">Registered</span>
                            <p className="mt-0.5 text-slate-300">{fmt(reg.createdAt)}</p>
                          </div>
                        </div>

                        {/* Payment proof */}
                        {reg.paymentScreenshot && (
                          <button onClick={() => setPreviewImage(reg.paymentScreenshot)}
                            className="mb-4 flex items-center gap-2 rounded-lg border border-sky-500/25 bg-sky-500/5 px-3 py-2 text-xs text-sky-400 hover:bg-sky-500/10">
                            <Icon name="eye" className="h-3.5 w-3.5" /> View Payment Proof
                          </button>
                        )}

                        {/* Actions */}
                        <div className="mt-auto flex gap-2">
                          <button onClick={() => handleQuickApprove(reg.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-500">
                            <Icon name="check" className="h-4 w-4" /> Approve
                          </button>
                          <button onClick={() => handleQuickReject(reg.id)}
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10">
                            <Icon name="x" className="h-4 w-4" /> Reject
                          </button>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ════ REGISTRATIONS TAB ════ */}
          {tab === 'registrations' && (
            <>
              {/* Filters */}
              <Card>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px] flex-1">
                    <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                      placeholder="Search name, email, college..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <select value={filterEvent} onChange={(e) => { setFilterEvent(e.target.value); setCurrentPage(1); }}
                    className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
                    <option value="">All Events</option>
                    {registrationEventOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                    className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none">
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                  <span className="ml-auto text-xs text-slate-500">{filteredRegistrations.length} results</span>
                </div>
              </Card>

              {/* Table */}
              {loadingRegs ? <Spinner /> : (
                <>
                  <Card noPad>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[1100px]">
                        <thead>
                          <tr className="border-b border-slate-700/50 bg-slate-800/50">
                            {['#', 'Name', 'Email', 'College', 'Event', 'Status', 'Payment', 'Proof', 'Date', 'Actions'].map((h) => (
                              <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/30">
                          {paginatedRegistrations.length === 0 ? (
                            <tr><td colSpan={10} className="py-16 text-center text-sm text-slate-500">No registrations found</td></tr>
                          ) : paginatedRegistrations.map((reg, idx) => {
                            const p = reg.participant ?? {};
                            const globalIdx = (currentPage - 1) * PER_PAGE + idx + 1;
                            return (
                              <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                                <td className="px-4 py-3 text-xs text-slate-500">{globalIdx}</td>
                                <td className="px-4 py-3 text-sm font-medium text-white">{p.name ?? '—'}</td>
                                <td className="px-4 py-3 text-xs text-slate-400">{p.email ?? '—'}</td>
                                <td className="max-w-[160px] truncate px-4 py-3 text-xs text-slate-400">{p.college ?? '—'}</td>
                                <td className="px-4 py-3 text-xs font-medium text-indigo-400">{reg.eventName}</td>
                                <td className="px-4 py-3">
                                  <select value={reg.status} onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                                    className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none">
                                    {STATUS_OPTIONS.map((item) => <option key={item} value={item}>{item}</option>)}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <select value={reg.paymentStatus ?? 'UNPAID'} onChange={(e) => handlePaymentStatusChange(reg.id, e.target.value)}
                                    className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-white focus:border-indigo-500 focus:outline-none">
                                    {['UNPAID', 'PENDING', 'PAID', 'REFUNDED'].map((item) => <option key={item} value={item}>{item}</option>)}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  {reg.paymentScreenshot ? (
                                    <button onClick={() => setPreviewImage(reg.paymentScreenshot)}
                                      className="flex items-center gap-1 rounded-md border border-sky-500/25 px-2 py-1 text-xs text-sky-400 hover:bg-sky-500/10">
                                      <Icon name="eye" className="h-3 w-3" /> View
                                    </button>
                                  ) : <span className="text-xs text-slate-600">—</span>}
                                </td>
                                <td className="px-4 py-3 text-[11px] text-slate-500">{fmt(reg.createdAt)}</td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    {reg.paymentStatus !== 'PAID' && (
                                      <button onClick={() => handlePaymentStatusChange(reg.id, 'PAID')} title="Mark as Paid"
                                        className="rounded-md border border-emerald-500/25 p-1.5 text-emerald-400 hover:bg-emerald-500/10">
                                        <Icon name="check" className="h-3.5 w-3.5" />
                                      </button>
                                    )}
                                    <button onClick={() => handleDeleteRegistration(reg.id)} title="Delete"
                                      className="rounded-md border border-red-500/25 p-1.5 text-red-400 hover:bg-red-500/10">
                                      <Icon name="trash" className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30">
                        <Icon name="chevron-left" className="h-4 w-4" />
                      </button>
                      <span className="text-xs text-slate-500">Page {currentPage} of {totalPages}</span>
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-400 hover:bg-slate-800 disabled:opacity-30">
                        <Icon name="chevron-right" className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {/* ════ PARTICIPANTS TAB ════ */}
          {tab === 'participants' && (
            <>
              <Card>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative min-w-[200px] flex-1">
                    <Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                    <input value={participantSearch} onChange={(e) => setParticipantSearch(e.target.value)}
                      placeholder="Search participants..."
                      className="w-full rounded-lg border border-slate-700 bg-slate-800/50 py-2 pl-9 pr-3 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <span className="text-xs text-slate-500">{filteredParticipants.length} participants</span>
                </div>
              </Card>

              {loadingParticipants ? <Spinner /> : (
                <Card noPad>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                      <thead>
                        <tr className="border-b border-slate-700/50 bg-slate-800/50">
                          {['Name', 'Email', 'Phone', 'College', 'Team', 'Events', 'Actions'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {filteredParticipants.length === 0 ? (
                          <tr><td colSpan={7} className="py-16 text-center text-sm text-slate-500">No participants found</td></tr>
                        ) : filteredParticipants.map((participant) => (
                          <tr key={participant.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3 text-sm font-medium text-white">{participant.name}</td>
                            <td className="px-4 py-3 text-xs text-slate-400">{participant.email}</td>
                            <td className="px-4 py-3 text-xs text-slate-400">{participant.phone}</td>
                            <td className="max-w-[200px] truncate px-4 py-3 text-xs text-slate-400">{participant.college}</td>
                            <td className="px-4 py-3 text-xs text-slate-400">{participant.teamName || '—'}</td>
                            <td className="max-w-[200px] truncate px-4 py-3 text-xs text-indigo-400">
                              {(participant.registrations ?? []).length > 0
                                ? participant.registrations.map((reg) => reg.event?.name).filter(Boolean).join(', ')
                                : '—'}
                            </td>
                            <td className="px-4 py-3">
                              <button onClick={() => handleDeleteParticipant(participant.id)} title="Delete participant"
                                className="rounded-md border border-red-500/25 p-1.5 text-red-400 hover:bg-red-500/10">
                                <Icon name="trash" className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          )}

          {/* ════ EVENTS TAB ════ */}
          {tab === 'events' && (
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[400px_1fr]">
              {/* Create event form */}
              <Card>
                <div className="mb-5">
                  <div className="mb-1 flex items-center gap-2">
                    <Icon name="plus" className="h-4 w-4 text-indigo-400" />
                    <h3 className="text-base font-semibold text-white">Create Event</h3>
                  </div>
                  <p className="text-xs text-slate-500">Add a new event to your symposium</p>
                </div>

                <form onSubmit={handleCreateEvent} className="space-y-3">
                  <input value={eventForm.name} onChange={handleEventField('name')} placeholder="Event name" required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none" />
                  <input value={eventForm.slug} onChange={handleEventField('slug')} placeholder="event-slug" required
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none" />
                  <textarea value={eventForm.description} onChange={handleEventField('description')} placeholder="Description" required rows={3}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none" />
                  <div className="grid grid-cols-2 gap-3">
                    <select value={eventForm.category} onChange={handleEventField('category')}
                      className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none">
                      {EVENT_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <input value={eventForm.maxTeamSize} onChange={handleEventField('maxTeamSize')} type="number" min="1" placeholder="Team size"
                      className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input value={eventForm.prizeAmount} onChange={handleEventField('prizeAmount')} placeholder="Prize amount"
                      className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none" />
                    <input value={eventForm.venue} onChange={handleEventField('venue')} placeholder="Venue"
                      className="rounded-lg border border-slate-700 bg-slate-800/50 px-3 py-2.5 text-sm text-white placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none" />
                  </div>
                  <label className="flex items-center gap-2.5 rounded-lg border border-slate-700 bg-slate-800/30 px-3 py-2.5 text-sm text-slate-300 cursor-pointer">
                    <input type="checkbox" checked={eventForm.isActive} onChange={handleEventField('isActive')} className="accent-indigo-500" />
                    Active on creation
                  </label>
                  <button type="submit" disabled={savingEvent}
                    className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-50">
                    {savingEvent ? 'Saving...' : 'Create Event'}
                  </button>
                </form>
              </Card>

              {/* Events list */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">All Events</h3>
                  <span className="text-xs text-slate-500">{events.length} event{events.length !== 1 ? 's' : ''}</span>
                </div>

                {loadingEvents ? <Spinner /> : events.length === 0 ? (
                  <Card><EmptyState icon="calendar" message="No events created yet" /></Card>
                ) : (
                  <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
                    {events.map((event) => {
                      const regCount = eventCountMap[event.name] ?? event._count?.registrations ?? 0;
                      return (
                        <Card key={event.id}>
                          <div className="mb-3 flex items-start justify-between">
                            <div className="min-w-0">
                              <div className="mb-1 flex items-center gap-2">
                                <span className="rounded-md bg-slate-700/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                                  {event.category}
                                </span>
                                <StatusBadge status={event.isActive ? 'ACTIVE' : 'INACTIVE'} />
                              </div>
                              <h4 className="text-base font-semibold text-white">{event.name}</h4>
                              <p className="text-xs text-slate-500">/{event.slug}</p>
                            </div>
                          </div>

                          <p className="mb-4 line-clamp-2 text-sm text-slate-400">{event.description}</p>

                          <div className="mb-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                            <div className="flex justify-between"><span className="text-slate-500">Team Size</span><span className="text-white">{event.maxTeamSize ?? 1}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Registrations</span><span className="text-white">{regCount}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Prize</span><span className="text-white">{event.prizeAmount || '—'}</span></div>
                            <div className="flex justify-between"><span className="text-slate-500">Venue</span><span className="text-white">{event.venue || '—'}</span></div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleToggleEvent(event)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${event.isActive ? 'border-amber-500/25 text-amber-400 hover:bg-amber-500/10' : 'border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/10'}`}>
                              {event.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => setPosterEvent(event)}
                              className="rounded-lg border border-indigo-500/25 px-3 py-1.5 text-xs font-medium text-indigo-400 hover:bg-indigo-500/10">
                              Poster
                            </button>
                            <button onClick={() => { setTab('registrations'); setFilterEvent(event.name); }}
                              className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800">
                              View Registrations
                            </button>
                            <button onClick={() => handleDeleteEvent(event.id)}
                              className="rounded-lg border border-red-500/25 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/10">
                              Delete
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Image preview modal ── */}
      <AnimatePresence>
        {!!previewImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm" onClick={() => setPreviewImage('')}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
              className="w-full max-w-3xl rounded-2xl border border-slate-700/50 bg-slate-900 p-5" onClick={(e) => e.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Payment Proof</h3>
                  <p className="text-xs text-slate-500">Uploaded screenshot preview</p>
                </div>
                <button onClick={() => setPreviewImage('')} className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-800">
                  Close
                </button>
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-700/50 bg-black/30 p-2">
                <img src={previewImage} alt="Payment proof" className="max-h-[75vh] w-full rounded-lg object-contain" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Poster modal ── */}
      <AnimatePresence>
        {posterEvent && <PosterModal event={posterEvent} onClose={() => setPosterEvent(null)} />}
      </AnimatePresence>
    </div>
  );
}
