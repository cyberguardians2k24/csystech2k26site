import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../lib/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  // Already logged in → redirect
  useEffect(() => {
    if (localStorage.getItem('cystech_admin')) navigate('/admin/dashboard', { replace: true });
  }, [navigate]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const admin = await api.adminLogin(form.email, form.password);
      localStorage.setItem('cystech_admin', JSON.stringify(admin));
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050310] flex items-center justify-center overflow-hidden relative px-4 pt-24">
      {/* Background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(157,0,255,0.15),transparent_65%)] pointer-events-none" />
      <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />

      {/* Rotating ring bg */}
      <div className="absolute w-[600px] h-[600px] rounded-full border border-vibranium/5 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute w-[400px] h-[400px] rounded-full border border-vibranium/8 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Card */}
        <div className="holographic-panel p-8 md:p-10 border-vibranium/30 shadow-vibranium-glow relative overflow-hidden">
          <span className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-holo-cyan/50" />
          <span className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-holo-cyan/50" />
          <span className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-holo-cyan/50" />
          <span className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-holo-cyan/50" />

          {/* Brand */}
          <div className="flex flex-col items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-full bg-vibranium/20 border border-vibranium/50 flex items-center justify-center shadow-vibranium-glow">
              <span className="font-heading font-black text-white text-2xl">C</span>
            </div>
            <div className="text-center">
              <h1 className="font-heading font-black text-white text-2xl tracking-tight">CYSTECH<span className="text-vibranium">26</span></h1>
              <p className="font-mono text-[10px] tracking-[0.3em] text-white/30 uppercase mt-0.5">Admin Control Panel</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="adm-email" className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                Admin Email <span className="text-vibranium">*</span>
              </label>
              <input
                id="adm-email"
                type="email"
                placeholder="admin@cystech.edu"
                value={form.email}
                onChange={set('email')}
                required
                autoComplete="email"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-vibranium/60 focus:bg-vibranium/5 focus:shadow-[0_0_16px_rgba(157,0,255,0.15)] transition-all duration-300"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="adm-pw" className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">
                Password <span className="text-vibranium">*</span>
              </label>
              <input
                id="adm-pw"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={set('password')}
                required
                autoComplete="current-password"
                className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-vibranium/60 focus:bg-vibranium/5 focus:shadow-[0_0_16px_rgba(157,0,255,0.15)] transition-all duration-300"
              />
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs"
                >
                  <span>⚠</span> {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-full bg-vibranium text-white font-bold font-heading tracking-widest uppercase text-sm shadow-vibranium-glow hover:shadow-[0_0_50px_rgba(157,0,255,0.6)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Authenticating…
                </>
              ) : (
                'Access Dashboard'
              )}
            </motion.button>
          </form>

          <p className="text-center text-white/15 font-mono text-[9px] tracking-widest uppercase mt-6">
            Restricted Access · CYSTECH 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
