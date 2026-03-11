import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../../lib/api';

const NAV_ITEMS = [
  { id: 'overview', label: 'Dashboard', icon: '⚡' },
  { id: 'approvals', label: 'Approvals', icon: '✅' },
  { id: 'registrations', label: 'Registrations', icon: '📋' },
  { id: 'participants', label: 'Participants', icon: '👥' },
  { id: 'events', label: 'Events', icon: '🎯' },
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

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fmt(iso) {
  return iso
    ? new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';
}

function normalizeRegistration(reg) {
  const participant = reg.participant ?? {};
  const eventObj = typeof reg.event === 'object' && reg.event !== null ? reg.event : null;
  const eventName = eventObj?.name ?? reg.eventName ?? reg.event ?? '—';
  const eventSlug = eventObj?.slug ?? reg.eventSlug ?? '';

  return {
    ...reg,
    participant,
    event: eventName,
    eventName,
    eventSlug,
    eventCategory: eventObj?.category ?? reg.eventCategory,
  };
}

function GlassPanel({ children, className = '' }) {
  return (
    <section className={`rounded-[1.7rem] border border-indigo-500/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(10,16,32,0.95))] shadow-[0_8px_40px_rgba(0,0,0,0.4),0_0_0_1px_rgba(99,102,241,0.06)] backdrop-blur-xl ${className}`}>
      {children}
    </section>
  );
}

function SectionHeader({ eyebrow, title, meta, action }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-indigo-400/70">{eyebrow}</p>}
        <h3 className="mt-2 font-heading text-xl font-black tracking-tight text-white">{title}</h3>
        {meta && <p className="mt-1 text-sm text-white/40">{meta}</p>}
      </div>
      {action}
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent = 'vibranium' }) {
  const map = {
    vibranium: 'from-indigo-500/14 via-indigo-500/6 to-transparent border-indigo-500/25 text-indigo-300 shadow-[0_0_24px_rgba(99,102,241,0.35)]',
    cyan: 'from-sky-400/12 via-sky-400/5 to-transparent border-sky-400/20 text-sky-400 shadow-[0_0_22px_rgba(56,189,248,0.12)]',
    green: 'from-green-400/10 via-green-400/5 to-transparent border-green-400/20 text-green-400 shadow-[0_0_22px_rgba(74,222,128,0.08)]',
    gold: 'from-amber-400/12 via-amber-400/5 to-transparent border-amber-400/20 text-amber-400 shadow-[0_0_22px_rgba(251,191,36,0.08)]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-[1.6rem] border bg-gradient-to-br p-6 ${map[accent]}`}
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/35">{label}</p>
          <p className="mt-3 font-heading text-4xl font-black text-white">{value ?? '—'}</p>
          {sub && <p className="mt-2 font-mono text-[9px] tracking-[0.18em] uppercase text-white/25">{sub}</p>}
        </div>
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">{icon}</span>
      </div>
    </motion.div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    CONFIRMED: 'border-green-400/25 bg-green-400/10 text-green-400',
    PENDING: 'border-amber-400/25 bg-amber-400/10 text-amber-400',
    CANCELLED: 'border-red-500/25 bg-red-500/10 text-red-400',
    WAITLISTED: 'border-sky-400/25 bg-sky-400/10 text-sky-400',
    ACTIVE: 'border-green-400/25 bg-green-400/10 text-green-400',
    INACTIVE: 'border-white/15 bg-white/5 text-white/55',
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase ${styles[status] ?? styles.PENDING}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    PAID: 'border-green-400/25 bg-green-400/10 text-green-400',
    PENDING: 'border-amber-400/25 bg-amber-400/10 text-amber-400',
    UNPAID: 'border-white/15 bg-white/5 text-white/55',
    REFUNDED: 'border-red-500/25 bg-red-500/10 text-red-400',
  };

  return (
    <span className={`rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-[0.18em] uppercase ${styles[status] ?? styles.UNPAID}`}>
      {status}
    </span>
  );
}

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
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();
    }

    function wrapText(text, x, y, maxWidth, lineH) {
      const words = text.split(' ');
      let line = '';
      let lineY = y;
      for (let i = 0; i < words.length; i++) {
        const test = line + words[i] + ' ';
        if (ctx.measureText(test).width > maxWidth && i > 0) {
          ctx.fillText(line.trim(), x, lineY);
          line = words[i] + ' ';
          lineY += lineH;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), x, lineY);
    }

    // Background
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#05001A');
    bg.addColorStop(0.45, '#0E0030');
    bg.addColorStop(1, '#030008');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Grid overlay
    ctx.strokeStyle = 'rgba(157,0,255,0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 36) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += 36) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // Top glow blob
    const topGlow = ctx.createRadialGradient(W / 2, -40, 0, W / 2, -40, 420);
    topGlow.addColorStop(0, 'rgba(157,0,255,0.22)');
    topGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, W, H * 0.5);

    // Bottom accent
    const botGlow = ctx.createRadialGradient(W / 2, H + 40, 0, W / 2, H + 40, 360);
    botGlow.addColorStop(0, 'rgba(0,240,255,0.12)');
    botGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = botGlow;
    ctx.fillRect(0, H * 0.6, W, H * 0.4);

    // Corner brackets
    ctx.strokeStyle = 'rgba(157,0,255,0.65)';
    ctx.lineWidth = 2.5;
    const bLen = 52, bOff = 28;
    [[bOff, bOff, 1, 1], [W - bOff, bOff, -1, 1], [bOff, H - bOff, 1, -1], [W - bOff, H - bOff, -1, -1]].forEach(([x, y, sx, sy]) => {
      ctx.beginPath(); ctx.moveTo(x + sx * bLen, y); ctx.lineTo(x, y); ctx.lineTo(x, y + sy * bLen); ctx.stroke();
    });

    // Horizontal accent lines
    const makeLineGrad = (c1, c2) => {
      const g = ctx.createLinearGradient(0, 0, W, 0);
      g.addColorStop(0, 'transparent'); g.addColorStop(0.5, c1); g.addColorStop(1, 'transparent');
      return g;
    };
    ctx.strokeStyle = makeLineGrad('rgba(157,0,255,0.7)', 'rgba(157,0,255,0.7)');
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 148); ctx.lineTo(W, 148); ctx.stroke();

    // Symposium / org label
    ctx.fillStyle = 'rgba(180,79,255,0.9)';
    ctx.font = 'bold 13px \'Courier New\', monospace';
    ctx.textAlign = 'center';
    ctx.fillText('CYSTECH 2026  ·  SYMPHO SYMPOSIUM', W / 2, 88);
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    ctx.font = '11px \'Courier New\', monospace';
    ctx.fillText('DEPT. OF COMPUTER SCIENCE', W / 2, 118);

    // Category chip
    const catLabel = (event.category || 'EVENT').toUpperCase();
    const catW = ctx.measureText(catLabel).width + 56;
    roundRect(W / 2 - catW / 2, 168, catW, 38, 19);
    ctx.fillStyle = 'rgba(157,0,255,0.12)'; ctx.fill();
    ctx.strokeStyle = 'rgba(180,79,255,0.5)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = 'rgba(200,120,255,0.95)';
    ctx.font = 'bold 11px \'Courier New\', monospace';
    ctx.fillText(catLabel, W / 2, 192);

    // Event name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 60px \'Arial Black\', \'Arial\', sans-serif';
    ctx.textAlign = 'center';
    wrapText(event.name || 'Event', W / 2, 288, W - 110, 68);

    // Cyan divider
    ctx.strokeStyle = makeLineGrad('rgba(0,240,255,0.6)', 'rgba(0,240,255,0.6)');
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(60, 428); ctx.lineTo(W - 60, 428); ctx.stroke();

    // Prize block
    let contentY = 468;
    if (event.prizeAmount) {
      ctx.fillStyle = 'rgba(180,79,255,0.6)';
      ctx.font = 'bold 11px \'Courier New\', monospace';
      ctx.fillText('☆ TOTAL PRIZE POOL ☆', W / 2, contentY);
      contentY += 12;
      const prizeGrad = ctx.createLinearGradient(W / 2 - 120, 0, W / 2 + 120, 0);
      prizeGrad.addColorStop(0, '#B44FFF');
      prizeGrad.addColorStop(0.5, '#FFFFFF');
      prizeGrad.addColorStop(1, '#00f0ff');
      ctx.fillStyle = prizeGrad;
      ctx.font = 'bold 56px \'Arial Black\', sans-serif';
      ctx.fillText('\u20b9' + event.prizeAmount, W / 2, contentY + 58);
      contentY += 90;
    }

    // Info cards
    const infos = [
      event.venue ? { icon: '\uD83D\uDCCD', key: 'VENUE', val: event.venue } : null,
      { icon: '\uD83D\uDC65', key: 'TEAM SIZE', val: `Up to ${event.maxTeamSize || 1} member${(event.maxTeamSize || 1) > 1 ? 's' : ''}` },
      { icon: '\uD83D\uDCC5', key: 'EVENT DATE', val: 'March 15–16, 2026' },
    ].filter(Boolean);

    contentY += 20;
    infos.forEach((info, i) => {
      const cardY = contentY + i * 78;
      roundRect(70, cardY, W - 140, 60, 14);
      ctx.fillStyle = 'rgba(255,255,255,0.04)'; ctx.fill();
      ctx.strokeStyle = 'rgba(157,0,255,0.18)'; ctx.lineWidth = 1; ctx.stroke();

      ctx.textAlign = 'left';
      ctx.fillStyle = 'rgba(157,0,255,0.75)';
      ctx.font = 'bold 10px \'Courier New\', monospace';
      ctx.fillText(`${info.icon}  ${info.key}`, 100, cardY + 22);
      ctx.fillStyle = 'rgba(255,255,255,0.88)';
      ctx.font = '15px Arial, sans-serif';
      ctx.fillText(info.val, 100, cardY + 44);
      ctx.textAlign = 'center';
    });

    // Bottom line
    ctx.strokeStyle = makeLineGrad('rgba(157,0,255,0.55)', 'rgba(157,0,255,0.55)');
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, H - 148); ctx.lineTo(W, H - 148); ctx.stroke();

    // CTA
    const ctaText = `REGISTER @ CYSTECH2026 / ${(event.name || 'event').toLowerCase().split(' ').join('-')}`;
    ctx.fillStyle = 'rgba(180,79,255,0.8)';
    ctx.font = 'bold 12px \'Courier New\', monospace';
    ctx.fillText(ctaText, W / 2, H - 102);

    ctx.fillStyle = 'rgba(0,240,255,0.4)';
    ctx.font = '11px \'Courier New\', monospace';
    ctx.fillText('Scan QR or visit the registration desk on event day', W / 2, H - 74);

    ctx.fillStyle = 'rgba(255,255,255,0.18)';
    ctx.font = '10px \'Courier New\', monospace';
    ctx.fillText('\u00a9 Sympho Organizing Committee · All rights reserved', W / 2, H - 48);
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22 }}
        className="flex w-full max-w-5xl flex-col gap-4 rounded-[1.8rem] border border-indigo-500/15 bg-[#0B1526] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-indigo-400/70">Event Poster Generator</p>
            <h3 className="mt-1 font-heading text-xl font-black text-white">{event.name}</h3>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              className="rounded-full bg-indigo-600 px-6 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all hover:bg-indigo-500"
            >
              ↓ Download PNG
            </button>
            <button
              onClick={onClose}
              className="rounded-full border border-white/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 transition-all hover:border-white/25 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
        <div className="overflow-auto rounded-[1.2rem] border border-white/8 bg-black/40 p-3">
          <canvas ref={canvasRef} className="mx-auto block rounded-xl" style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Sidebar({ tab, setTab, admin, onLogout, pendingCount }) {
  return (
    <aside className="hidden lg:flex min-h-screen w-[272px] shrink-0 flex-col border-r border-indigo-500/10 bg-[linear-gradient(180deg,#091220,#0B1628)]">
      <div className="border-b border-indigo-500/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-indigo-500/35 bg-[linear-gradient(135deg,rgba(99,102,241,0.2),rgba(255,255,255,0.06))] shadow-[0_0_24px_rgba(99,102,241,0.35)]">
            <span className="font-heading text-lg font-black text-white">C</span>
          </div>
          <div>
            <p className="font-heading text-sm font-black tracking-wide text-white">CYSTECH<span className="text-indigo-400">26</span></p>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-white/25">Operations Console</p>
          </div>
        </div>
      </div>

      <div className="border-b border-indigo-500/10 px-6 py-5">
        <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-green-400/80">System Online</span>
          </div>
          <p className="text-sm font-medium text-white/80">{admin?.name}</p>
          <p className="mt-1 truncate font-mono text-[9px] tracking-[0.2em] text-white/25">{admin?.email}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setTab(item.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition-all ${
              tab === item.id
                ? 'border border-indigo-500/25 bg-[linear-gradient(135deg,rgba(99,102,241,0.18),rgba(255,255,255,0.04))] text-white shadow-[0_0_24px_rgba(99,102,241,0.35)]'
                : 'text-white/40 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/8 bg-black/20 text-base">{item.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span>{item.label}</span>
                {item.id === 'approvals' && pendingCount > 0 && (
                  <span className="ml-2 rounded-full bg-amber-400/90 px-2 py-0.5 font-mono text-[9px] font-bold text-black">
                    {pendingCount}
                  </span>
                )}
              </div>
              <div className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/25">Management</div>
            </div>
          </button>
        ))}
      </nav>

      <div className="border-t border-indigo-500/10 px-3 py-4">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-white/35 transition-all hover:bg-red-500/5 hover:text-red-400"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/15 bg-red-500/5">🚪</span>
          <div>
            <div>Logout</div>
            <div className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.18em] text-white/20">Secure Exit</div>
          </div>
        </button>
      </div>
    </aside>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();

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

  useEffect(() => {
    const stored = localStorage.getItem('cystech_admin');
    if (!stored) {
      navigate('/admin', { replace: true });
      return;
    }
    try {
      setAdmin(JSON.parse(stored));
    } catch {
      localStorage.removeItem('cystech_admin');
      navigate('/admin', { replace: true });
    }
  }, [navigate]);

  const handleError = useCallback((err) => {
    setError(err?.message || 'Something went wrong');
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('cystech_admin');
    navigate('/admin', { replace: true });
  }, [navigate]);

  const loadDashboard = useCallback(async () => {
    setLoadingDashboard(true);
    try {
      const data = await api.getDashboard();
      setDashboard(data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingDashboard(false);
    }
  }, [handleError]);

  const loadRegistrations = useCallback(async () => {
    setLoadingRegs(true);
    try {
      const data = await api.getRegistrations(1, 500);
      setRegistrations((data.data ?? []).map(normalizeRegistration));
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingRegs(false);
    }
  }, [handleError]);

  const loadParticipants = useCallback(async () => {
    setLoadingParticipants(true);
    try {
      const data = await api.getParticipants(1, 500);
      setParticipants(data.data ?? []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingParticipants(false);
    }
  }, [handleError]);

  const loadEvents = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const data = await api.getEvents(true);
      setEvents(data ?? []);
    } catch (err) {
      handleError(err);
    } finally {
      setLoadingEvents(false);
    }
  }, [handleError]);

  useEffect(() => {
    if (!admin) return;
    loadDashboard();
    loadEvents();
  }, [admin, loadDashboard, loadEvents]);

  useEffect(() => {
    if (!admin) return;
    if (tab === 'registrations') loadRegistrations();
    if (tab === 'approvals') loadRegistrations();
    if (tab === 'participants') loadParticipants();
    if (tab === 'events') loadEvents();
  }, [admin, tab, loadEvents, loadParticipants, loadRegistrations]);

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
      const matchesSearch = !query || [p.name, p.email, p.college, reg.eventName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
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

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const filteredParticipants = useMemo(() => {
    const query = participantSearch.trim().toLowerCase();
    return participants.filter((p) => {
      if (!query) return true;
      return [p.name, p.email, p.college, p.phone, p.teamName]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));
    });
  }, [participantSearch, participants]);

  const handleRefresh = async () => {
    await loadDashboard();
    if (tab === 'registrations') await loadRegistrations();
    if (tab === 'participants') await loadParticipants();
    if (tab === 'events') await loadEvents();
  };

  const handleQuickApprove = async (id) => {
    try {
      const updated = normalizeRegistration(await api.updatePaymentStatus(id, 'PAID'));
      setRegistrations((current) => current.map((item) => (item.id === id ? updated : item)));
      await loadDashboard();
    } catch (err) {
      handleError(err);
    }
  };

  const handleQuickReject = async (id) => {
    try {
      const updated = normalizeRegistration(await api.updateRegistrationStatus(id, 'CANCELLED'));
      setRegistrations((current) => current.map((item) => (item.id === id ? updated : item)));
      await loadDashboard();
    } catch (err) {
      handleError(err);
    }
  };

  const handleExport = async () => {
    try {
      const data = await api.exportEvent(filterEvent || undefined);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cystech-export-${filterEvent || 'all'}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      handleError(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const updated = normalizeRegistration(await api.updateRegistrationStatus(id, status));
      setRegistrations((current) => current.map((item) => (item.id === id ? updated : item)));
      await loadDashboard();
    } catch (err) {
      handleError(err);
    }
  };

  const handlePaymentStatusChange = async (id, paymentStatus) => {
    try {
      const updated = normalizeRegistration(await api.updatePaymentStatus(id, paymentStatus));
      setRegistrations((current) => current.map((item) => (item.id === id ? updated : item)));
      await loadDashboard();
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteRegistration = async (id) => {
    if (!window.confirm('Delete this registration?')) return;
    try {
      await api.deleteRegistration(id);
      setRegistrations((current) => current.filter((item) => item.id !== id));
      await Promise.all([loadDashboard(), loadParticipants()]);
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteParticipant = async (id) => {
    if (!window.confirm('Delete this participant and related registrations?')) return;
    try {
      await api.deleteParticipant(id);
      setParticipants((current) => current.filter((item) => item.id !== id));
      setRegistrations((current) => current.filter((item) => item.participant?.id !== id));
      await loadDashboard();
    } catch (err) {
      handleError(err);
    }
  };

  const handleEventField = (key) => (e) => {
    const value = key === 'isActive' ? e.target.checked : e.target.value;
    setEventForm((current) => {
      const next = { ...current, [key]: value };
      if (key === 'name' && !current.slug) next.slug = slugify(value);
      return next;
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    try {
      await api.createEvent({
        ...eventForm,
        slug: eventForm.slug || slugify(eventForm.name),
        maxTeamSize: Number(eventForm.maxTeamSize) || 1,
      });
      setEventForm(EMPTY_EVENT_FORM);
      await Promise.all([loadEvents(), loadDashboard()]);
      setTab('events');
    } catch (err) {
      handleError(err);
    } finally {
      setSavingEvent(false);
    }
  };

  const handleToggleEvent = async (event) => {
    try {
      const updated = await api.updateEvent(event.id, { isActive: !event.isActive });
      setEvents((current) => current.map((item) => (item.id === event.id ? updated : item)));
      await loadDashboard();
    } catch (err) {
      handleError(err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm('Delete this event? Registrations linked to it will also be removed.')) return;
    try {
      await api.deleteEvent(id);
      setEvents((current) => current.filter((item) => item.id !== id));
      setRegistrations((current) => current.filter((item) => item.eventId !== id));
      await Promise.all([loadDashboard(), loadParticipants()]);
    } catch (err) {
      handleError(err);
    }
  };

  const pageMeta = {
    overview: {
      title: 'Executive Dashboard',
      subtitle: 'Live symposium operations, participation flow, and administrative health in one place.',
      badge: 'Live Control',
    },
    approvals: {
      title: 'Pending Approvals',
      subtitle: 'Review payment proofs and approve or reject participant registrations.',
      badge: 'Approvals',
    },
    registrations: {
      title: 'Registration Operations',
      subtitle: 'Review participant signups, update statuses, and export operational data instantly.',
      badge: 'Workflow',
    },
    participants: {
      title: 'Participant Directory',
      subtitle: 'Search, audit, and maintain your complete attendee database.',
      badge: 'People',
    },
    events: {
      title: 'Event Management',
      subtitle: 'Create, activate, monitor, and manage every event from a single admin console.',
      badge: 'Scheduling',
    },
  }[tab];

  const activeEventsCount = events.filter((event) => event.isActive).length;
  const pendingRegistrationsCount = registrations.filter((item) => item.paymentStatus === 'PENDING' || item.status === 'PENDING').length;
  const currentTabCount = {
    overview: dashboard?.stats?.totalRegistrations ?? 0,
    approvals: pendingCount,
    registrations: filteredRegistrations.length,
    participants: filteredParticipants.length,
    events: events.length,
  }[tab];

  if (!admin) return null;

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-[#0D1526] pt-24 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.12),transparent_26%),radial-gradient(circle_at_85%_14%,rgba(56,189,248,0.08),transparent_18%),linear-gradient(180deg,rgba(255,255,255,0.015),transparent_35%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.045] [background-image:linear-gradient(rgba(99,102,241,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.18)_1px,transparent_1px)] [background-size:48px_48px]" />
      <Sidebar tab={tab} setTab={(next) => { setTab(next); setMobileMenuOpen(false); }} admin={admin} onLogout={handleLogout} pendingCount={pendingCount} />

      <div className="relative z-[1] flex flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-indigo-500/10 bg-[#0D1526]/80 px-6 py-4 backdrop-blur-2xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setMobileMenuOpen((v) => !v)} className="flex flex-col gap-1.5 lg:hidden">
              <span className="h-[2px] w-5 rounded-full bg-white/70" />
              <span className="h-[2px] w-3.5 rounded-full bg-white/40" />
            </button>
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.24em] text-indigo-400">{pageMeta.badge}</span>
                <span className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/20">CYSTECH 2026</span>
              </div>
              <h1 className="font-heading text-xl font-black text-white">
                {pageMeta.title}
              </h1>
              <p className="mt-1 text-sm text-white/40">
                {pageMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-2.5 xl:flex">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">Active Events</p>
                <p className="mt-1 font-heading text-lg font-black text-white">{activeEventsCount}</p>
              </div>
              <div className="h-8 w-px bg-white/8" />
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/25">Pending</p>
                <p className="mt-1 font-heading text-lg font-black text-white">{pendingRegistrationsCount}</p>
              </div>
            </div>
            {tab === 'registrations' && (
              <button
                onClick={handleExport}
                className="hidden rounded-full border border-amber-400/25 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-amber-400 transition-all hover:bg-amber-400/10 sm:flex"
              >
                Export
              </button>
            )}
            <button
              onClick={handleRefresh}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/40 transition-all hover:border-white/30 hover:text-white"
              title="Refresh"
            >
              ↺
            </button>
            <button
              onClick={handleLogout}
              className="hidden rounded-full border border-red-500/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] text-red-400/70 transition-all hover:bg-red-500/10 sm:flex"
            >
              Logout
            </button>
          </div>
        </header>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-[#0D1526]/95 px-8 py-12 backdrop-blur-xl lg:hidden"
            >
              <button onClick={() => setMobileMenuOpen(false)} className="absolute right-6 top-6 text-2xl text-white/50">✕</button>
              <div className="mb-8">
                <p className="font-heading text-xl font-black text-white">{admin.name}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.22em] text-white/25">{admin.email}</p>
              </div>
              <div className="space-y-3">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setTab(item.id); setMobileMenuOpen(false); }}
                    className={`flex w-full items-center gap-3 rounded-xl px-5 py-4 text-left text-lg ${tab === item.id ? 'border border-indigo-500/25 bg-indigo-500/20 text-white' : 'text-white/45'}`}
                  >
                    <span>{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.id === 'approvals' && pendingCount > 0 && (
                      <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 font-mono text-[9px] font-bold text-black">{pendingCount}</span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!!error && (
            <motion.div
              initial={{ opacity: 0, y: -18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mx-6 mt-4 flex items-center justify-between gap-3 rounded-xl border border-red-500/25 bg-red-500/10 px-5 py-3 text-red-400"
            >
              <span className="font-mono text-xs">⚠ {error}</span>
              <button onClick={() => setError('')} className="text-red-400/55">✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 space-y-6 overflow-y-auto p-6">
          <GlassPanel className="overflow-hidden p-0">
            <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1.35fr_0.9fr] lg:px-8">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-indigo-400/75">Administration Suite</p>
                <h2 className="mt-3 max-w-2xl font-heading text-[1.8rem] font-black leading-tight text-white sm:text-[2.15rem]">
                  Welcome back, {admin.name}. Your symposium command center is live and synchronized.
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/45">
                  Monitor registrations, manage participants, and control events through a unified interface designed for fast operational decisions.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/25">Current View</p>
                  <p className="mt-2 font-heading text-2xl font-black text-white">{currentTabCount}</p>
                  <p className="mt-1 text-xs text-white/35">items in this workspace</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/25">Admin Role</p>
                  <p className="mt-2 font-heading text-2xl font-black text-white">{admin.role}</p>
                  <p className="mt-1 text-xs text-white/35">secured session active</p>
                </div>
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/25">System Status</p>
                  <p className="mt-2 font-heading text-2xl font-black text-green-400">ONLINE</p>
                  <p className="mt-1 text-xs text-white/35">frontend and backend synced</p>
                </div>
              </div>
            </div>
          </GlassPanel>

          {tab === 'overview' && (
            <>
              {loadingDashboard ? (
                <div className="flex justify-center py-24">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, ease: 'linear', repeat: Infinity }} className="h-10 w-10 rounded-full border-2 border-indigo-500/25 border-t-indigo-500" />
                </div>
              ) : dashboard && (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard label="Total Participants" value={dashboard.stats.totalParticipants} icon="👥" accent="vibranium" />
                    <StatCard label="Registrations" value={dashboard.stats.totalRegistrations} icon="📋" accent="cyan" />
                    <StatCard label="Events" value={events.length || dashboard.stats.totalEvents} icon="🎯" accent="gold" />
                    <StatCard
                      label="Confirmed"
                      value={(dashboard.recentRegistrations ?? []).filter((item) => item.status === 'CONFIRMED').length}
                      sub="recent 10"
                      icon="✅"
                      accent="green"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <GlassPanel className="p-6">
                      <SectionHeader eyebrow="Analytics" title="Registrations by Event" meta="Live distribution of attendee volume across symposium events." />

                      {(dashboard.registrationsByEvent ?? []).length === 0 ? (
                        <p className="py-10 text-center font-mono text-xs text-white/25">No registration data yet</p>
                      ) : (
                        <div className="space-y-3">
                          {dashboard.registrationsByEvent
                            .slice()
                            .sort((a, b) => b.count - a.count)
                            .map((item, index, arr) => {
                              const maxCount = Math.max(...arr.map((x) => x.count), 1);
                              const pct = Math.round((item.count / maxCount) * 100);
                              return (
                                <div key={item.event} className="grid grid-cols-[1fr_3fr_46px] items-center gap-3">
                                  <p className="truncate text-right font-mono text-xs text-white/55">{item.event}</p>
                                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${pct}%` }}
                                      transition={{ duration: 0.8, delay: index * 0.05 }}
                                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-400"
                                    />
                                  </div>
                                  <p className="font-heading text-sm font-bold text-white/80">{item.count}</p>
                                </div>
                              );
                            })}
                        </div>
                      )}
                      </GlassPanel>

                      <GlassPanel className="p-6">
                        <SectionHeader
                          eyebrow="Activity"
                          title="Recent Registrations"
                          meta="Most recent participant submissions and confirmation status."
                          action={<button onClick={() => setTab('registrations')} className="font-mono text-[9px] uppercase tracking-[0.22em] text-indigo-400/65 transition-colors hover:text-indigo-400">View All →</button>}
                        />

                      <div className="space-y-2">
                        {(dashboard.recentRegistrations ?? []).length === 0 ? (
                          <p className="py-10 text-center font-mono text-xs text-white/25">No registrations yet</p>
                        ) : (
                          dashboard.recentRegistrations.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: 8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.04 }}
                              className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/[0.03] px-4 py-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate text-sm text-white/80">{item.participant?.name}</p>
                                <p className="truncate font-mono text-[9px] text-white/30">{item.participant?.email}</p>
                                <p className="mt-1 font-mono text-[9px] text-indigo-400/60">{item.event}</p>
                              </div>
                              <div className="flex shrink-0 flex-col items-end gap-1">
                                <StatusBadge status={item.status} />
                                <PaymentBadge status={item.paymentStatus ?? 'UNPAID'} />
                                <span className="font-mono text-[8px] text-white/22">{fmt(item.createdAt)}</span>
                              </div>
                            </motion.div>
                          ))
                        )}
                      </div>
                    </GlassPanel>
                  </div>
                </>
              )}
            </>
          )}

          {tab === 'registrations' && (
            <>
              <GlassPanel className="p-5">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                  placeholder="Search name, email, college, event..."
                  className="min-w-[220px] flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/45 focus:outline-none"
                />
                <select
                  value={filterEvent}
                  onChange={(e) => { setFilterEvent(e.target.value); setCurrentPage(1); }}
                  className="min-w-[170px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white focus:border-indigo-500/45 focus:outline-none"
                >
                  <option value="" className="bg-[#0D1526]">All Events</option>
                  {registrationEventOptions.map((item) => (
                    <option key={item} value={item} className="bg-[#0D1526]">{item}</option>
                  ))}
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
                  className="min-w-[150px] rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white focus:border-indigo-500/45 focus:outline-none"
                >
                  <option value="" className="bg-[#0D1526]">All Statuses</option>
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item} value={item} className="bg-[#0D1526]">{item}</option>
                  ))}
                </select>
                <p className="ml-auto font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">{filteredRegistrations.length} results</p>
              </div>
              </GlassPanel>

              {loadingRegs ? (
                <div className="flex justify-center py-24">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, ease: 'linear', repeat: Infinity }} className="h-10 w-10 rounded-full border-2 border-indigo-500/25 border-t-indigo-500" />
                </div>
              ) : (
                <>
                  <GlassPanel className="overflow-hidden p-0">
                    <div className="overflow-x-auto">
                      <table className="min-w-[1380px] w-full">
                        <thead>
                          <tr className="border-b border-indigo-500/12 bg-indigo-900/20">
                            {['#', 'Name', 'Email', 'College', 'Phone', 'Event', 'Status', 'Payment', 'Proof', 'Registered', 'Actions'].map((head) => (
                              <th key={head} className="whitespace-nowrap px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">{head}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {paginatedRegistrations.length === 0 ? (
                            <tr>
                              <td colSpan={11} className="py-16 text-center font-mono text-sm text-white/25">No registrations found</td>
                            </tr>
                          ) : (
                            paginatedRegistrations.map((reg, index) => {
                              const p = reg.participant ?? {};
                              const globalIndex = (currentPage - 1) * PER_PAGE + index + 1;
                              return (
                                <tr key={reg.id} className="transition-colors hover:bg-white/[0.02]">
                                  <td className="px-4 py-3 font-mono text-xs text-white/25">{globalIndex}</td>
                                  <td className="px-4 py-3 text-sm text-white/85">{p.name ?? '—'}</td>
                                  <td className="px-4 py-3 font-mono text-xs text-white/55">{p.email ?? '—'}</td>
                                  <td className="max-w-[180px] truncate px-4 py-3 text-xs text-white/55">{p.college ?? '—'}</td>
                                  <td className="px-4 py-3 font-mono text-xs text-white/45">{p.phone ?? '—'}</td>
                                  <td className="px-4 py-3 font-mono text-xs text-indigo-400/75">{reg.eventName}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <StatusBadge status={reg.status} />
                                      <select
                                        value={reg.status}
                                        onChange={(e) => handleStatusChange(reg.id, e.target.value)}
                                        className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white focus:border-indigo-500/45 focus:outline-none"
                                      >
                                        {STATUS_OPTIONS.map((item) => (
                                          <option key={item} value={item} className="bg-[#0D1526]">{item}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <PaymentBadge status={reg.paymentStatus ?? 'UNPAID'} />
                                      <select
                                        value={reg.paymentStatus ?? 'UNPAID'}
                                        onChange={(e) => handlePaymentStatusChange(reg.id, e.target.value)}
                                        className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 font-mono text-[10px] text-white focus:border-indigo-500/45 focus:outline-none"
                                      >
                                        {['UNPAID', 'PENDING', 'PAID', 'REFUNDED'].map((item) => (
                                          <option key={item} value={item} className="bg-[#0D1526]">{item}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3">
                                    {reg.paymentScreenshot ? (
                                      <button
                                        onClick={() => setPreviewImage(reg.paymentScreenshot)}
                                        className="rounded-lg border border-sky-400/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-sky-400 transition-all hover:bg-sky-400/10"
                                      >
                                        View Proof
                                      </button>
                                    ) : (
                                      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">No file</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 font-mono text-[10px] text-white/25">{fmt(reg.createdAt)}</td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      {reg.paymentStatus !== 'PAID' && (
                                        <button
                                          onClick={() => handlePaymentStatusChange(reg.id, 'PAID')}
                                          className="rounded-lg border border-green-400/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-green-400 transition-all hover:bg-green-400/10"
                                        >
                                          Verify
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleDeleteRegistration(reg.id)}
                                        className="rounded-lg border border-red-500/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-red-400/70 transition-all hover:bg-red-500/10"
                                      >
                                        Delete
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </GlassPanel>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-all hover:border-indigo-500/30 hover:text-white disabled:opacity-25"
                      >
                        ← Prev
                      </button>
                      <span className="px-2 font-mono text-xs text-white/30">{currentPage} / {totalPages}</span>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="rounded-xl border border-white/10 px-4 py-2 font-mono text-xs text-white/40 transition-all hover:border-indigo-500/30 hover:text-white disabled:opacity-25"
                      >
                        Next →
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {tab === 'participants' && (
            <>
              <GlassPanel className="p-5">
              <div className="flex flex-wrap items-center gap-3">
                <input
                  value={participantSearch}
                  onChange={(e) => setParticipantSearch(e.target.value)}
                  placeholder="Search participants..."
                  className="min-w-[240px] flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/45 focus:outline-none"
                />
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">{filteredParticipants.length} participants</p>
              </div>
              </GlassPanel>

              {loadingParticipants ? (
                <div className="flex justify-center py-24">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, ease: 'linear', repeat: Infinity }} className="h-10 w-10 rounded-full border-2 border-indigo-500/25 border-t-indigo-500" />
                </div>
              ) : (
                <GlassPanel className="overflow-hidden p-0">
                  <div className="overflow-x-auto">
                    <table className="min-w-[920px] w-full">
                      <thead>
                        <tr className="border-b border-indigo-500/12 bg-indigo-900/20">
                          {['Name', 'Email', 'Phone', 'College', 'Team', 'Registered Events', 'Actions'].map((head) => (
                            <th key={head} className="px-4 py-3 text-left font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">{head}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {filteredParticipants.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-16 text-center font-mono text-sm text-white/25">No participants found</td>
                          </tr>
                        ) : (
                          filteredParticipants.map((participant) => (
                            <tr key={participant.id} className="hover:bg-white/[0.02]">
                              <td className="px-4 py-3 text-sm text-white/85">{participant.name}</td>
                              <td className="px-4 py-3 font-mono text-xs text-white/55">{participant.email}</td>
                              <td className="px-4 py-3 font-mono text-xs text-white/45">{participant.phone}</td>
                              <td className="max-w-[220px] truncate px-4 py-3 text-xs text-white/55">{participant.college}</td>
                              <td className="px-4 py-3 text-xs text-white/45">{participant.teamName || '—'}</td>
                              <td className="px-4 py-3 text-xs text-indigo-400/70">
                                {(participant.registrations ?? []).length > 0
                                  ? participant.registrations.map((reg) => reg.event?.name).filter(Boolean).join(', ')
                                  : '—'}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  onClick={() => handleDeleteParticipant(participant.id)}
                                  className="rounded-lg border border-red-500/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-red-400/70 transition-all hover:bg-red-500/10"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </GlassPanel>
              )}
            </>
          )}

          {tab === 'events' && (
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
              <GlassPanel className="p-6">
                <SectionHeader eyebrow="Create" title="Create Event" meta="Launch new symposium experiences with clean metadata and instant activation." />

                <form onSubmit={handleCreateEvent} className="space-y-4">
                  <input value={eventForm.name} onChange={handleEventField('name')} placeholder="Event name" required className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/45 focus:outline-none" />
                  <input value={eventForm.slug} onChange={handleEventField('slug')} placeholder="event-slug" required className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/45 focus:outline-none" />
                  <textarea value={eventForm.description} onChange={handleEventField('description')} placeholder="Event description" required rows={4} className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/45 focus:outline-none" />

                  <div className="grid grid-cols-2 gap-3">
                    <select value={eventForm.category} onChange={handleEventField('category')} className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-indigo-500/45 focus:outline-none">
                      {EVENT_CATEGORIES.map((item) => <option key={item} value={item} className="bg-[#0D1526]">{item}</option>)}
                    </select>
                    <input value={eventForm.maxTeamSize} onChange={handleEventField('maxTeamSize')} type="number" min="1" placeholder="Max team size" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white focus:border-indigo-500/45 focus:outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input value={eventForm.prizeAmount} onChange={handleEventField('prizeAmount')} placeholder="Prize amount" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/45 focus:outline-none" />
                    <input value={eventForm.venue} onChange={handleEventField('venue')} placeholder="Venue" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-white/20 focus:border-indigo-500/45 focus:outline-none" />
                  </div>

                  <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/75">
                    <input type="checkbox" checked={eventForm.isActive} onChange={handleEventField('isActive')} className="accent-indigo-500" />
                    Create as active event
                  </label>

                  <button
                    type="submit"
                    disabled={savingEvent}
                    className="w-full rounded-full bg-indigo-600 py-3 font-heading text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all disabled:opacity-50"
                  >
                    {savingEvent ? 'Saving…' : 'Create Event'}
                  </button>
                </form>
                </GlassPanel>

                <GlassPanel className="p-6">
                  <SectionHeader
                    eyebrow="Manage"
                    title="Manage Events"
                    meta="Track live event health, activation state, and registration volume."
                    action={<p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/30">{events.length} events</p>}
                  />

                {loadingEvents ? (
                  <div className="flex justify-center py-24">
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, ease: 'linear', repeat: Infinity }} className="h-10 w-10 rounded-full border-2 border-indigo-500/25 border-t-indigo-500" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 2xl:grid-cols-2">
                    {events.map((event) => {
                      const registrationsCount = eventCountMap[event.name] ?? event._count?.registrations ?? 0;
                      return (
                        <div key={event.id} className="rounded-2xl border border-slate-700/50 bg-slate-800/30 p-5">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">{event.category}</p>
                              <h4 className="mt-1 font-heading text-lg font-bold text-white">{event.name}</h4>
                              <p className="mt-1 font-mono text-[10px] text-indigo-400/65">/{event.slug}</p>
                            </div>
                            <StatusBadge status={event.isActive ? 'ACTIVE' : 'INACTIVE'} />
                          </div>

                          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/55">{event.description}</p>

                          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-white/45">
                            <div>Team Size: <span className="text-white/80">{event.maxTeamSize ?? 1}</span></div>
                            <div>Registrations: <span className="text-white/80">{registrationsCount}</span></div>
                            <div>Prize: <span className="text-white/80">{event.prizeAmount || '—'}</span></div>
                            <div>Venue: <span className="text-white/80">{event.venue || '—'}</span></div>
                          </div>

                          <div className="mt-5 flex flex-wrap gap-2">
                            <button
                              onClick={() => handleToggleEvent(event)}
                              className="rounded-full border border-sky-400/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-sky-400 transition-all hover:bg-sky-400/10"
                            >
                              {event.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => setPosterEvent(event)}
                              className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-300 transition-all hover:bg-indigo-500/20"
                            >
                              🖼️ Poster
                            </button>
                            <button
                              onClick={() => { setTab('registrations'); setFilterEvent(event.name); }}
                              className="rounded-full border border-indigo-500/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-indigo-400 transition-all hover:bg-indigo-500/10"
                            >
                              View Registrations
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="rounded-full border border-red-500/20 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-red-400/75 transition-all hover:bg-red-500/10"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {events.length === 0 && (
                      <div className="col-span-full py-20 text-center font-mono text-sm text-white/25">No events available</div>
                    )}
                  </div>
                )}
              </GlassPanel>
            </div>
          )}
        </main>

        <AnimatePresence>
          {!!previewImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 p-6 backdrop-blur-md"
              onClick={() => setPreviewImage('')}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.22 }}
                className="w-full max-w-4xl rounded-[1.8rem] border border-indigo-500/15 bg-[#0B1526] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.6),0_0_0_1px_rgba(99,102,241,0.08)]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between gap-4 px-2 pt-1">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-indigo-400/70">Payment Proof</p>
                    <h3 className="mt-1 font-heading text-xl font-black text-white">Uploaded Screenshot Preview</h3>
                  </div>
                  <button onClick={() => setPreviewImage('')} className="rounded-full border border-white/10 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 transition-all hover:border-white/25 hover:text-white">Close</button>
                </div>
                <div className="overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/30 p-2">
                  <img src={previewImage} alt="Payment proof" className="max-h-[75vh] w-full rounded-[1rem] object-contain" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {posterEvent && (
            <PosterModal event={posterEvent} onClose={() => setPosterEvent(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
