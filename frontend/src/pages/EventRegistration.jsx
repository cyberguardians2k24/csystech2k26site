import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_EVENTS, CATEGORY_META } from '../data/events';
import { api } from '../lib/api';
import paymentImage from '../../Assets/images/paymentimage.jpeg';

function InputField({ label, id, type = 'text', placeholder, value, onChange, required }) {
  const isEmail = type === 'email';
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
        {label}{required && <span className="text-vibranium ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoCapitalize={isEmail ? 'none' : undefined}
        spellCheck={isEmail ? false : undefined}
        className={`w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-vibranium/60 focus:bg-vibranium/5 focus:shadow-[0_0_16px_rgba(157,0,255,0.15)] transition-all duration-300 ${isEmail ? 'font-sans normal-case lowercase tracking-normal' : 'font-body'}`}
      />
    </div>
  );
}

function SelectField({ label, id, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">{label}</label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body focus:outline-none focus:border-vibranium/60 focus:bg-vibranium/5 transition-all duration-300 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff40' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
      >
        <option value="" className="bg-[#0a0612]">Select…</option>
        {options.map(({ v, l }) => <option key={v} value={v} className="bg-[#0a0612]">{l}</option>)}
      </select>
    </div>
  );
}

function FileUploadField({ label, id, onChange, helper, preview, required }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
        {label}{required && <span className="ml-1 text-vibranium">*</span>}
      </label>
      <label htmlFor={id} className="group cursor-pointer rounded-2xl border border-dashed border-vibranium/25 bg-white/[0.02] p-4 transition-all duration-300 hover:border-vibranium/50 hover:bg-vibranium/5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-body text-sm text-white/75">Upload payment screenshot</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">jpg, png, webp · max 3mb</p>
          </div>
          <span className="rounded-full border border-vibranium/25 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-vibranium transition-colors group-hover:border-vibranium/50 group-hover:text-white">Choose</span>
        </div>
        <input id={id} type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={onChange} required={required} className="hidden" />
      </label>
      {helper && <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/25">{helper}</p>}
      {preview && (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2">
          <img src={preview} alt="Payment screenshot preview" className="h-44 w-full rounded-xl object-cover" />
        </div>
      )}
    </div>
  );
}

export default function EventRegistration() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const event = ALL_EVENTS.find((e) => e.id === eventId);

  const [form, setForm] = useState({
    name: '', email: '', phone: '', college: '', department: '', yearOfStudy: '', teamName: '', notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [expandRules, setExpandRules] = useState(false);
  const [paymentScreenshot, setPaymentScreenshot] = useState('');
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentFileName, setPaymentFileName] = useState('');
  const [paymentRef, setPaymentRef] = useState('');

  if (!event) {
    return (
      <div className="min-h-screen bg-wakanda-dark flex flex-col items-center justify-center text-white gap-4">
        <span className="text-5xl">⚡</span>
        <h2 className="font-heading font-black text-2xl">Event not found</h2>
        <Link to="/#events" className="text-vibranium font-mono text-sm underline">← Back to Events</Link>
      </div>
    );
  }

  const set = (key) => (e) => {
    const value = key === 'email' ? e.target.value.toLowerCase() : e.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handlePaymentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      setError('Payment screenshot must be under 3 MB.');
      return;
    }

    try {
      const previewUrl = URL.createObjectURL(file);
      setPaymentScreenshot(previewUrl);
      setPaymentFile(file);
      setPaymentFileName(file.name);
      setError('');
    } catch {
      setError('Could not read the payment screenshot. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const normalizedEmail = form.email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError('Please enter your email address.');
      return;
    }
    if (!paymentFile) {
      setError('Please upload your payment screenshot before submitting.');
      return;
    }
    setLoading(true);
    try {
      const signed = await api.createPaymentUploadUrl({
        fileName: paymentFile.name,
        contentType: paymentFile.type || 'application/octet-stream',
        participantEmail: normalizedEmail,
        event: event.title,
      });

      const uploadRes = await fetch(signed.uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': paymentFile.type || 'application/octet-stream',
        },
        body: paymentFile,
      });

      if (!uploadRes.ok) {
        throw new Error('Failed to upload payment screenshot to storage.');
      }

      await api.register({
        name:     form.name,
        email:    normalizedEmail,
        phone:    form.phone,
        college:  form.college,
        teamName: form.teamName || undefined,
        event:    event.title,
        notes:    [form.department, form.yearOfStudy ? `Year ${form.yearOfStudy}` : '', form.notes].filter(Boolean).join(' | ') || undefined,
        paymentScreenshot: signed.storageUrl,
        paymentRef: paymentRef || undefined,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categoryMeta = CATEGORY_META[event.category];

  return (
    <div className="min-h-screen bg-wakanda-dark text-white overflow-x-hidden">
      {/* Scanlines */}
      <div className="fixed inset-0 scanlines opacity-5 pointer-events-none z-0" />
      {/* Background glows */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(157,0,255,0.12),transparent_60%)] pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_70%_80%,rgba(0,240,255,0.06),transparent_60%)] pointer-events-none z-0" />

      <div className="relative z-10 flex items-center justify-between px-6 py-3 border-b border-vibranium/10 mt-24">
        <div className="flex items-center gap-2 font-mono text-xs text-white/30 tracking-widest uppercase">
          <span className={categoryMeta.chip.split(' ').find(c => c.startsWith('text-'))}>{categoryMeta.label}</span>
          <span>/</span>
          <span className="text-white/60">{event.title}</span>
        </div>
        <button onClick={() => navigate(-1)} className="text-white/30 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors">
          ← Back
        </button>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* ── LEFT: Event Details ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-6"
        >
          {/* Event header */}
          <div className="holographic-panel p-7 relative overflow-hidden">
            <span className="bracket-tl" />
            <span className="bracket-br" />
            <div className={`absolute inset-0 bg-gradient-to-br ${event.color} opacity-[0.07] pointer-events-none`} />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span className={`font-mono text-[9px] tracking-[0.25em] uppercase border px-2.5 py-1 rounded-full ${categoryMeta.chip}`}>
                  {categoryMeta.label}
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-vibranium/60 uppercase border border-vibranium/20 px-2.5 py-1 rounded-full">
                  {event.tag}
                </span>
              </div>
              <div className="flex items-center gap-4 mb-3">
                <span className="text-5xl">{event.icon}</span>
                <div>
                  <h1 className="text-3xl font-black font-heading tracking-tight text-white">{event.title}</h1>
                  <p className="text-vibranium-light/70 font-mono text-xs tracking-widest mt-0.5 italic">{event.tagline}</p>
                </div>
              </div>
              <p className="text-white/55 text-sm font-body leading-relaxed">{event.desc}</p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📅', label: 'Date & Time', value: event.date },
              { icon: '📍', label: 'Venue', value: event.venue },
              { icon: '👥', label: 'Team Size', value: `${event.teamSize} member${event.teamSize === '1' ? '' : 's'}` },
              { icon: '⏳', label: 'Duration', value: event.duration },
            ].map(({ icon, label, value }) => (
              <div key={label} className="holographic-panel p-4 border-vibranium/15">
                <p className="font-mono text-[9px] tracking-[0.2em] text-white/25 uppercase mb-1">{icon} {label}</p>
                <p className="text-sm text-white/75 font-body">{value}</p>
              </div>
            ))}
          </div>

          {/* Prize breakdown */}
          <div className="holographic-panel p-5 border-vibranium/20">
            <p className="font-mono text-[9px] tracking-[0.25em] text-vibranium/60 uppercase mb-4">🏆 Prize Pool — {event.prize}</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { place: '1st', amount: event.firstPrize, cls: 'text-vibranium border-vibranium/40 bg-vibranium/5' },
                { place: '2nd', amount: event.secondPrize, cls: 'text-white/70 border-white/15 bg-white/[0.02]' },
                { place: '3rd', amount: event.thirdPrize, cls: 'text-vibranium-light border-vibranium-light/30 bg-vibranium/5' },
              ].map(({ place, amount, cls }) => (
                <div key={place} className={`rounded-xl border p-3 text-center ${cls}`}>
                  <p className="font-mono text-[9px] opacity-50 uppercase">{place} Place</p>
                  <p className="font-heading font-black text-lg mt-0.5">{amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rules accordion */}
          <div className="holographic-panel overflow-hidden">
            <button
              onClick={() => setExpandRules((v) => !v)}
              className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/50">Rules &amp; Guidelines</span>
              <motion.span animate={{ rotate: expandRules ? 180 : 0 }} className="text-vibranium/50 text-lg">⌄</motion.span>
            </button>
            <AnimatePresence>
              {expandRules && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden px-6 pb-5 space-y-2"
                >
                  {event.rules.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/55">
                      <span className="text-holo-cyan shrink-0 mt-0.5">›</span>
                      {r}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Coordinators */}
          <div className="holographic-panel p-5 border-white/8">
            <p className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/30 mb-3">📞 Coordinators</p>
            <div className="flex flex-wrap gap-2">
              {event.coordinators.map((c) => (
                <a
                  key={c.phone}
                  href={`tel:${c.phone}`}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-sm text-white/60 hover:text-holo-cyan hover:border-holo-cyan/30 transition-all duration-200"
                >
                  <span>📞</span>
                  <span>{c.name}</span>
                  <span className="text-white/30 text-xs">{c.phone}</span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── RIGHT: Registration Form ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="holographic-panel p-7 md:p-10 border-vibranium/25 shadow-vibranium-glow relative overflow-hidden sticky top-6">
            {/* Corner brackets */}
            <span className="absolute top-5 left-5 w-6 h-6 border-t-2 border-l-2 border-holo-cyan/40" />
            <span className="absolute top-5 right-5 w-6 h-6 border-t-2 border-r-2 border-holo-cyan/40" />
            <span className="absolute bottom-5 left-5 w-6 h-6 border-b-2 border-l-2 border-holo-cyan/40" />
            <span className="absolute bottom-5 right-5 w-6 h-6 border-b-2 border-r-2 border-holo-cyan/40" />

            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col items-center gap-6 py-8 text-center"
                >
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                    className="w-20 h-20 rounded-full border-2 border-holo-cyan shadow-[0_0_40px_rgba(0,240,255,0.35)] flex items-center justify-center text-4xl bg-holo-cyan/10"
                  >
                    ✓
                  </motion.div>

                  {/* Heading */}
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-vibranium/70 mb-1">Registration Received</p>
                    <h3 className="text-3xl font-black font-heading text-white mb-2">You're Registered!</h3>
                    <p className="text-white/45 font-mono text-sm max-w-sm">
                      Your spot for <span className="text-holo-cyan font-bold">{event.title}</span> has been reserved.
                    </p>
                  </div>

                  {/* Pending Approval Banner */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35 }}
                    className="w-full rounded-2xl border border-amber-400/25 bg-[linear-gradient(135deg,rgba(251,191,36,0.08),rgba(10,16,32,0.6))] px-5 py-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-xl">⏳</span>
                      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400 font-bold">Pending Admin Approval</p>
                    </div>
                    <p className="text-white/45 font-mono text-[11px] text-left leading-relaxed">
                      Your payment screenshot has been uploaded. An admin will review and verify it. You will receive a confirmation once approved.
                    </p>
                  </motion.div>

                  {/* What Happens Next Steps */}
                  <div className="w-full rounded-2xl border border-white/8 bg-black/20 p-5 text-left">
                    <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30 mb-4">What Happens Next</p>
                    <div className="space-y-4">
                      {[
                        { step: '01', label: 'Registration Received', desc: 'Your details and payment screenshot are saved.', done: true, color: 'text-green-400 border-green-400/30 bg-green-400/10' },
                        { step: '02', label: 'Payment Under Review', desc: 'Admin verifies your payment proof (usually within 24 hrs).', done: false, color: 'text-amber-400 border-amber-400/30 bg-amber-400/10' },
                        { step: '03', label: 'Confirmation Sent', desc: 'Once approved, your registration is confirmed.', done: false, color: 'text-white/25 border-white/10 bg-white/5' },
                      ].map(({ step, label, desc, done, color }) => (
                        <div key={step} className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full border font-mono text-[9px] font-bold flex items-center justify-center ${color}`}>
                            {done ? '✓' : step}
                          </div>
                          <div>
                            <p className={`font-mono text-xs font-bold ${done ? 'text-green-400' : 'text-white/60'}`}>{label}</p>
                            <p className="font-mono text-[10px] text-white/30 mt-0.5">{desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Registered email note */}
                  <p className="font-mono text-[10px] text-white/25 tracking-widest">
                    Registration linked to <span className="text-vibranium/60 font-sans normal-case lowercase tracking-normal">{form.email}</span>
                  </p>

                  {/* Action buttons */}
                  <div className="flex gap-3 flex-wrap justify-center">
                    <Link
                      to={event.category === 'technical' ? '/technical' : '/non-technical'}
                      className="px-5 py-2.5 rounded-full border border-vibranium/40 text-vibranium font-mono text-xs tracking-widest uppercase hover:bg-vibranium/20 transition-all"
                    >
                      View All {CATEGORY_META[event.category].label} Events
                    </Link>
                    <Link
                      to="/"
                      className="px-5 py-2.5 rounded-full bg-vibranium text-white font-mono text-xs tracking-widest uppercase hover:shadow-vibranium-glow transition-all"
                    >
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-5"
                >
                  <div className="mb-6">
                    <h2 className="text-2xl font-black font-heading tracking-tight text-white">Register for</h2>
                    <p className="text-vibranium font-heading font-black text-xl leading-tight">{event.title}</p>
                    <p className="text-white/30 font-mono text-[10px] tracking-widest mt-1 uppercase">April 8, 2026 · Payment verification required</p>
                  </div>

                  <div className="rounded-[1.6rem] border border-vibranium/20 bg-[linear-gradient(180deg,rgba(157,0,255,0.08),rgba(255,255,255,0.02))] p-5">
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-vibranium/80">Payment Step</p>
                        <h3 className="mt-2 font-heading text-lg font-black text-white">Scan and pay before submitting</h3>
                        <p className="mt-1 text-sm text-white/45">Use the payment QR below, then upload your payment screenshot for admin verification.</p>
                      </div>
                      <div className="hidden rounded-2xl border border-vibranium/25 bg-vibranium/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-vibranium sm:block">
                        Payment Proof Required
                      </div>
                    </div>

                    <div className="grid gap-5 md:grid-cols-[220px_1fr] md:items-start">
                      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white p-3 shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
                        <img src={paymentImage} alt="Payment QR" className="w-full rounded-xl object-cover" />
                      </div>
                      <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/30">Instructions</p>
                          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-white/55">
                            <li>1. Scan the QR code and complete the payment.</li>
                            <li>2. Take a clear screenshot showing successful payment.</li>
                            <li>3. Upload the screenshot below and submit the registration.</li>
                            <li>4. Admin will verify the payment before confirming your registration.</li>
                          </ul>
                        </div>
                        <InputField label="Payment Reference / UTR (optional)" id="reg-payment-ref" placeholder="Enter UTR / payment reference" value={paymentRef} onChange={(e) => setPaymentRef(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Full Name" id="reg-name" placeholder="Your name" value={form.name} onChange={set('name')} required />
                    <InputField label="Email" id="reg-email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Phone" id="reg-phone" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} required />
                    <InputField label="College" id="reg-college" placeholder="College name" value={form.college} onChange={set('college')} required />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <InputField label="Department" id="reg-dept" placeholder="e.g. Computer Science" value={form.department} onChange={set('department')} />
                    <SelectField
                      label="Year of Study"
                      id="reg-year"
                      value={form.yearOfStudy}
                      onChange={set('yearOfStudy')}
                      options={[
                        { v: '1', l: '1st Year' }, { v: '2', l: '2nd Year' },
                        { v: '3', l: '3rd Year' }, { v: '4', l: '4th Year' }, { v: 'pg', l: 'Post Graduate' },
                      ]}
                    />
                  </div>

                  {/* Team name — only if teamSize allows teams */}
                  {event.teamSize !== '1' && (
                    <InputField label={`Team Name (optional — ${event.teamSize} members max)`} id="reg-team" placeholder="Team name" value={form.teamName} onChange={set('teamName')} />
                  )}

                  <InputField label="Additional Notes" id="reg-notes" placeholder="Anything we should know?" value={form.notes} onChange={set('notes')} />

                  <FileUploadField
                    label="Payment Screenshot"
                    id="reg-payment-screenshot"
                    onChange={handlePaymentUpload}
                    required
                    helper={paymentFileName ? `Selected: ${paymentFileName}` : 'Upload the screenshot used for payment verification.'}
                    preview={paymentScreenshot}
                  />

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs"
                      >
                        <span>⚠</span> {error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full py-4 rounded-full bg-vibranium disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold font-heading tracking-widest uppercase text-sm shadow-vibranium-glow hover:shadow-[0_0_50px_rgba(157,0,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Registering…
                      </>
                    ) : (
                      <>Confirm Registration<span className="text-holo-cyan">⚡</span></>
                    )}
                  </motion.button>

                  <p className="text-center text-white/20 font-mono text-[9px] tracking-widest uppercase">
                    One registration per email per event · Confirmation happens after admin verifies payment
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
