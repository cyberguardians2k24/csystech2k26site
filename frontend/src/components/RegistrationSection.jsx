import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const EVENTS_LIST = [
  'Paper Presentation',
  'Hackathon',
  'Technical Quiz',
  'Workshop – AI/ML',
  'Workshop – Cybersecurity',
]

export default function RegistrationSection() {
  const sectionRef = useRef(null)
  const isInView   = useInView(sectionRef, { once: false, margin: '-10%' })

  const [form, setForm]       = useState({ name: '', email: '', college: '', phone: '', event: '', teamName: '' })
  const [status, setStatus]   = useState('idle')  // idle | loading | success | error
  const [errorMsg, setErrMsg] = useState('')

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('http://localhost:3001/api/registrations', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      if (!res.ok) throw new Error((await res.json()).message || 'Failed')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrMsg(err.message)
    }
  }

  return (
    <section
      ref={sectionRef}
      id="register"
      className="relative py-24 bg-wakanda-dark overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_35%_35%,rgba(100,0,150,0.18),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_80%,rgba(191,0,255,0.08),transparent_55%)]" />
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-vibranium-700/40 to-transparent" />

      <div className="relative z-10 container mx-auto px-6 max-w-5xl">

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12"
        >
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-vibranium-500" />
            <span className="font-mono text-vibranium-400 text-xs tracking-[0.5em]">REGISTER</span>
          </div>

          <div className="mt-6 flex items-center gap-4">
            <img
              src="/cystech-logo.png"
              alt="CYSTECH 2K26"
              className="w-20 object-contain"
              style={{ filter: 'drop-shadow(0 0 14px rgba(191,0,255,0.65))' }}
            />
            <h2 className="font-orbitron font-black text-white" style={{ fontSize: 'clamp(1.9rem, 4.2vw, 3.6rem)' }}>
              Join{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #bf00ff, #e040fb)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                CYSTECH
              </span>
            </h2>
          </div>

          <p className="mt-3 max-w-2xl font-rajdhani text-white/55 text-lg">
            Seats are limited. Secure your spot for CYSTECH 2K26.
          </p>
        </motion.div>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="holo-panel rounded-sm p-8 md:p-10"
          style={{ border: '1px solid rgba(191,0,255,0.28)', boxShadow: '0 0 60px rgba(191,0,255,0.12)' }}
        >
          {status === 'success' ? (
            <SuccessState />
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <FormField label="Full Name"     name="name"     value={form.name}     onChange={handleChange} placeholder="T'Challa Wakanda" />
                <FormField label="Email Address" name="email"    value={form.email}    onChange={handleChange} placeholder="you@wakanda.edu" type="email" />
                <FormField label="College / Institution" name="college" value={form.college} onChange={handleChange} placeholder="Wakanda Institute of Tech" />
                <FormField label="Phone Number"  name="phone"    value={form.phone}    onChange={handleChange} placeholder="+91 98765 43210" type="tel" />
                <FormField label="Team Name (if applicable)" name="teamName" value={form.teamName} onChange={handleChange} placeholder="Team Vibranium" />
                <FormSelect label="Event" name="event" value={form.event} onChange={handleChange} options={EVENTS_LIST} />
              </div>

              {status === 'error' && (
                <p className="font-mono text-red-400 text-xs text-center">{errorMsg}</p>
              )}

              <div className="text-center pt-4">
                <motion.button
                  type="submit"
                  disabled={status === 'loading'}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-neon btn-neon-fill px-16 py-4 text-sm relative overflow-hidden"
                  style={{ fontSize: '0.85rem' }}
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-3">
                      <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      TRANSMITTING…
                    </span>
                  ) : (
                    <>
                      <span className="relative z-10">⚡ REGISTER NOW</span>
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full hover:translate-x-full transition-transform duration-1000" />
                    </>
                  )}
                </motion.button>
              </div>

              <p className="font-mono text-vibranium-600 text-xs text-center">
                By registering you agree to our terms. Once confirmed, registration fee is non-refundable.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}

function FormField({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-xs text-vibranium-400 tracking-widest block">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={name !== 'teamName'}
        className="w-full bg-transparent border border-vibranium-800/60 px-4 py-3 font-rajdhani text-white placeholder-white/20 focus:outline-none focus:border-vibranium-500 transition-colors duration-300 text-sm backdrop-blur-sm"
        style={{ boxShadow: 'inset 0 0 10px rgba(191,0,255,0.05)' }}
      />
    </div>
  )
}

function FormSelect({ label, name, value, onChange, options }) {
  return (
    <div className="space-y-2">
      <label className="font-mono text-xs text-vibranium-400 tracking-widest block">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required
        className="w-full bg-wakanda-black border border-vibranium-800/60 px-4 py-3 font-rajdhani text-white focus:outline-none focus:border-vibranium-500 transition-colors duration-300 text-sm"
        style={{ boxShadow: 'inset 0 0 10px rgba(191,0,255,0.05)' }}
      >
        <option value="">-- Select Event --</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-16 text-center space-y-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        className="w-24 h-24 rounded-full mx-auto flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #4a0080, #bf00ff)', boxShadow: '0 0 40px rgba(191,0,255,0.6)' }}
      >
        <span className="text-4xl">✓</span>
      </motion.div>
      <h3 className="font-orbitron font-bold text-white text-2xl text-vibranium-glow">
        REGISTRATION SUCCESSFUL
      </h3>
      <p className="font-rajdhani text-white/60 text-lg">
        Welcome to CYSTECH 2K26. A confirmation has been sent to your email.
        <br />The vibranium awaits you.
      </p>
      <div className="font-mono text-vibranium-500 text-xs tracking-[0.3em] animate-pulse-slow">
        VIBRANIUM CORE ACCESS GRANTED
      </div>
    </motion.div>
  )
}
