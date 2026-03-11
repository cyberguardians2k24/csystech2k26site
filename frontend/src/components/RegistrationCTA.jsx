import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ALL_EVENTS, CATEGORY_META, EVENT_STATS } from '../data/events';

function SeatsCounter() {
  const [seats, setSeats] = useState(47);
  useEffect(() => {
    const id = setInterval(() => {
      setSeats(prev => {
        if (prev <= 12) return prev;
        return Math.random() > 0.7 ? prev - 1 : prev;
      });
    }, 8000);
    return () => clearInterval(id);
  }, []);
  return (
    <motion.div
      key={seats}
      initial={{ scale: 1.2 }}
      animate={{ scale: 1 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-vibranium/30 bg-vibranium/5"
    >
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="w-1.5 h-1.5 rounded-full bg-vibranium"
      />
      <span className="font-mono text-xs tracking-widest text-vibranium uppercase">
        Only <span className="font-black text-sm">{seats}</span> spots remaining
      </span>
    </motion.div>
  );
}

function SelectField({ label, id, value, onChange, options, required }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
        {label}{required && <span className="text-vibranium ml-1">*</span>}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body focus:outline-none focus:border-vibranium/60 focus:bg-vibranium/5 focus:shadow-[0_0_16px_rgba(157,0,255,0.15)] transition-all duration-300 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23ffffff40' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}
      >
        <option value="" disabled className="bg-[#0a0612] text-white/40">{options[0].placeholder ?? 'Select…'}</option>
        {options.map(({ value: v, label: l }) => (
          <option key={v} value={v} className="bg-[#0a0612] text-white">{l}</option>
        ))}
      </select>
    </div>
  );
}

function InputField({ label, id, type = 'text', placeholder, value, onChange, required }) {
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
        className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder-white/20 focus:outline-none focus:border-vibranium/60 focus:bg-vibranium/5 focus:shadow-[0_0_16px_rgba(157,0,255,0.15)] transition-all duration-300"
      />
    </div>
  );
}

export default function RegistrationCTA() {
  const [form, setForm] = useState({ name: '', email: '', college: '', phone: '', department: '', yearOfStudy: '', events: [] });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const toggleEvent = (ev) => setForm(f => ({
    ...f,
    events: f.events.includes(ev) ? f.events.filter(x => x !== ev) : [...f.events, ev]
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.college) return;
    setLoading(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="register" className="section-shell relative py-16 md:py-32 bg-wakanda-dark overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgba(123,44,255,0.2),transparent_55%)] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='100'%3E%3Cpath d='M28 66L0 50V18L28 2l28 16v32L28 66zm0-92L0 -10V-42L28-58l28 16v32L28-26z' fill='none' stroke='%239d00ff' stroke-width='1'/%3E%3C/svg%3E")`,
          backgroundSize: '56px 100px'
        }}
      />
      <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#9D00FF]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <div className="panel-sheen rounded-[2.2rem] border border-[#7b2cff]/28 bg-[#09020f]/78 backdrop-blur-2xl p-6 md:p-10 lg:p-16 relative overflow-hidden shadow-[0_0_60px_rgba(123,44,255,0.14)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(123,44,255,0.18),transparent_24%),radial-gradient(circle_at_82%_82%,rgba(212,175,55,0.12),transparent_26%)] pointer-events-none" />
          <span className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-[#67e8f9]/45 transition-all duration-300 hover:w-12 hover:h-12" />
          <span className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-[#67e8f9]/45 transition-all duration-300 hover:w-12 hover:h-12" />
          <span className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-[#67e8f9]/45 transition-all duration-300 hover:w-12 hover:h-12" />
          <span className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-[#67e8f9]/45 transition-all duration-300 hover:w-12 hover:h-12" />

          <div className="text-center mb-10 relative z-10">
            <SeatsCounter />
            <motion.h2
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              whileInView={{ scale: 1, opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-4xl sm:text-5xl md:text-[5rem] font-black font-heading tracking-tighter text-slate-50 uppercase leading-[0.9]"
            >
              Secure <br />
              <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #67e8f9 0%, #9D00FF 54%, #7b2cff 100%)' }}>
                Your Access
              </span>
            </motion.h2>
            <p className="mt-4 text-white/50 font-mono text-sm max-w-md mx-auto tracking-wide leading-relaxed">
              March 15–16, 2026 · Limited slots · Fill in your details below.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-6 relative z-10"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Full Name" id="name" placeholder="e.g. T'Challa Vanguard" value={form.name} onChange={set('name')} required />
                  <InputField label="Email Address" id="email" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="College / Institution" id="college" placeholder="Name of your college" value={form.college} onChange={set('college')} required />
                  <InputField label="Phone Number" id="phone" type="tel" placeholder="+91 00000 00000" value={form.phone} onChange={set('phone')} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField label="Department" id="department" placeholder="e.g. Computer Science" value={form.department} onChange={set('department')} />
                  <SelectField
                    label="Year of Study"
                    id="yearOfStudy"
                    value={form.yearOfStudy}
                    onChange={set('yearOfStudy')}
                    options={[
                      { value: '1', label: '1st Year' },
                      { value: '2', label: '2nd Year' },
                      { value: '3', label: '3rd Year' },
                      { value: '4', label: '4th Year' },
                      { value: 'pg', label: 'Post Graduate' },
                    ]}
                  />
                </div>

                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">Select Events <span className="text-[#9D00FF]">*</span></p>
                  <div className="flex items-center justify-between mb-3 gap-4 flex-wrap">
                    <p className="text-white/30 font-mono text-[10px] tracking-[0.2em] uppercase">
                      Choose from {EVENT_STATS.totalCount} updated events
                    </p>
                    <p className="text-white/30 font-mono text-[10px] tracking-[0.2em] uppercase">
                      Selected: {form.events.length}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {ALL_EVENTS.map((event) => {
                      const active = form.events.includes(event.title);
                      return (
                        <motion.button
                          key={event.id}
                          type="button"
                          onClick={() => toggleEvent(event.title)}
                          whileTap={{ scale: 0.95 }}
                          className={`relative flex items-start gap-2 px-3 py-3 rounded-xl border text-left text-xs font-mono tracking-wide transition-all duration-300 ${active ? 'border-[#9D00FF]/60 bg-[linear-gradient(135deg,rgba(123,44,255,0.18),rgba(212,175,55,0.12))] text-white shadow-[0_0_28px_rgba(123,44,255,0.18)]' : 'border-white/10 bg-white/[0.02] text-white/40 hover:border-[#7b2cff]/30 hover:text-white/70'}`}
                        >
                          <span className={`w-3 h-3 rounded-full flex-shrink-0 border transition-all duration-300 ${active ? 'bg-[#9D00FF] border-[#9D00FF] shadow-[0_0_12px_rgba(212,175,55,0.42)]' : 'border-white/20'}`} />
                          <span className="flex-1">
                            <span className="block text-white/80">{event.title}</span>
                            <span className={`mt-1 inline-flex px-2 py-0.5 rounded-full border text-[9px] uppercase tracking-[0.2em] ${CATEGORY_META[event.category].chip}`}>
                              {CATEGORY_META[event.category].label}
                            </span>
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <motion.button
                    type="submit"
                    disabled={loading || form.events.length === 0}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="relative inline-flex items-center gap-3 px-12 py-5 rounded-full font-bold font-heading tracking-widest uppercase text-sm text-white disabled:opacity-40 disabled:cursor-not-allowed bg-[linear-gradient(135deg,rgba(212,175,55,0.9),rgba(123,44,255,0.9))] shadow-[0_0_40px_rgba(212,175,55,0.24)] hover:shadow-[0_0_60px_rgba(212,175,55,0.35)] transition-all duration-300 overflow-hidden"
                  >
                    <span className="absolute inset-0 gold-sweep opacity-40 pointer-events-none" />
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Processing…
                      </>
                    ) : (
                      <>
                        Initialize Registration
                        <motion.span
                          animate={{ opacity: [1, 0.3, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                            className="w-2 h-2 rounded-full bg-[#67e8f9]"
                        />
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-6 py-12 text-center relative z-10"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                  className="w-20 h-20 rounded-full border-2 border-[#67e8f9] shadow-[0_0_30px_rgba(103,232,249,0.4)] flex items-center justify-center text-3xl bg-[#67e8f9]/10"
                >
                  ✓
                </motion.div>
                <div>
                  <h3 className="text-3xl font-black font-heading text-white mb-2">Access Granted</h3>
                  <p className="text-white/50 font-mono text-sm">Confirmation has been sent to <span className="text-[#67e8f9]">{form.email}</span>.</p>
                  <p className="text-white/30 font-mono text-xs mt-2 tracking-widest">Your event shortlist is locked in for CYSTECH 2026.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

