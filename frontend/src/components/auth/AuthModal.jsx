import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, Leaf } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function AuthModal({ isOpen, onClose }) {
  const [mode, setMode]       = useState('login')
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const { login, signup }     = useAuth()

  const submit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const r = mode === 'login'
        ? await login(form.email, form.password)
        : await signup(form.name, form.email, form.password)
      if (r.success) onClose()
      else setError(r.error || 'Something went wrong')
    } catch { setError('An error occurred. Please try again.') }
    finally { setLoading(false) }
  }

  const upd = f => e => setForm(p => ({ ...p, [f]: e.target.value }))

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} onClick={onClose}
            className="fixed inset-0 z-[300]"
            style={{ background: 'rgba(28,26,24,0.65)', backdropFilter: 'blur(14px)' }} />

          <motion.div
            initial={{ opacity: 0, scale: 0.93, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.93, y: 24 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4"
          >
            <div onClick={e => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
              style={{ background: '#fff', border: '1.5px solid #D4CCBC' }}>

              {/* Header */}
              <div className="px-8 pt-8 pb-6 relative" style={{ borderBottom: '1.5px solid #E8E2D8' }}>
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: 'rgba(77,122,82,0.1)', border: '1.5px solid rgba(77,122,82,0.25)' }}>
                    <Leaf className="w-4 h-4 text-sage-500" />
                  </div>
                  <span className="font-bold tracking-[0.2em] text-ink text-sm">SYLEX</span>
                </div>
                <h2 className="text-2xl font-bold text-ink">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h2>
                <p className="text-ink-muted text-sm mt-1">
                  {mode === 'login' ? 'Sign in to save your favorites' : 'Start discovering what you love'}
                </p>
                <button onClick={onClose}
                  className="absolute top-6 right-6 p-2 rounded-xl text-ink-muted hover:text-ink hover:bg-ink/5 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={submit} className="px-8 py-6 space-y-4">
                {mode === 'signup' && (
                  <Field label="Name" icon={User} type="text" placeholder="Your name"
                    value={form.name} onChange={upd('name')} required />
                )}
                <Field label="Email" icon={Mail} type="email" placeholder="you@example.com"
                  value={form.email} onChange={upd('email')} required />
                <div className="relative">
                  <Field label="Password" icon={Lock} type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••" value={form.password} onChange={upd('password')} required minLength={6} />
                  <button type="button" onClick={() => setShowPwd(v => !v)}
                    className="absolute right-3.5 top-[34px] text-ink-muted hover:text-ink transition-colors">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <p className="text-red-600 text-sm px-3.5 py-2.5 rounded-xl"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                  {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
                </button>
              </form>

              <div className="px-8 pb-7 text-center">
                <p className="text-sm text-ink-muted">
                  {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
                  <button onClick={() => { setMode(m => m === 'login' ? 'signup' : 'login'); setError('') }}
                    className="text-sage-500 hover:text-sage-600 font-medium transition-colors">
                    {mode === 'login' ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function Field({ label, icon: Icon, ...props }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-widest mb-1.5 text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
        <input {...props}
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm text-ink outline-none transition-all"
          style={{ background: '#FAF7F2', border: '1.5px solid #D4CCBC' }}
          onFocus={e => { e.currentTarget.style.borderColor = '#4D7A52'; e.currentTarget.style.background = 'rgba(77,122,82,0.04)' }}
          onBlur={e => { e.currentTarget.style.borderColor = '#D4CCBC'; e.currentTarget.style.background = '#FAF7F2' }}
        />
      </div>
    </div>
  )
}
