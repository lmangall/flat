'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/')
      router.refresh()
    } else {
      setError(true)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen relative flex items-center justify-center px-6 overflow-hidden">
      {/* Warm gradient background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(160deg, #FDFBF7 0%, #F6F2EB 30%, #E8F4F3 70%, #d9ece9 100%)',
        }}
      />
      {/* Grain */}
      <div className="grain absolute inset-0" />

      {/* Decorative corner accents */}
      <div className="login-corner login-corner--tl" />
      <div className="login-corner login-corner--br" />

      <div className="relative z-10 w-full max-w-[360px]">
        {/* Header — staggered entrance */}
        <div className="text-center mb-12 animate-fade-up" style={{ opacity: 0 }}>
          <p className="font-sans text-[0.55rem] font-medium tracking-[0.35em] uppercase text-mer/60 mb-4">
            Private access
          </p>
          <h1 className="font-display text-7xl text-night leading-[0.9] tracking-tight">
            Antibes
          </h1>
          <div className="flex items-center justify-center gap-4 mt-5">
            <div className="w-8 h-px bg-gradient-to-r from-transparent to-dune/50" />
            <p className="font-display text-[1.05rem] text-clay/60 italic">
              Antibes, Araki &amp; you
            </p>
            <div className="w-8 h-px bg-gradient-to-l from-transparent to-dune/50" />
          </div>
        </div>

        {/* Form — no card, just form elements floating on the page */}
        <form
          onSubmit={handleSubmit}
          className="animate-fade-up stagger-2"
          style={{ opacity: 0 }}
        >
          <div className="relative mb-6">
            <label className="block mb-3 font-sans text-[0.55rem] font-medium tracking-[0.22em] uppercase text-clay/50 text-center">
              Password / Hasło
            </label>
            <div className={`login-input-wrap ${focused ? 'is-focused' : ''} ${error ? 'has-error' : ''}`}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                placeholder="••••••••"
                className="w-full bg-transparent px-5 py-3.5 font-sans text-night text-center text-[0.95rem] tracking-widest placeholder-dune/30 focus:outline-none"
                autoFocus
                required
              />
            </div>

            {error && (
              <p className="font-sans text-[0.72rem] text-sunset text-center mt-3 animate-fade-in">
                Wrong password. / Złe hasło.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-button"
          >
            <span className="relative z-10">
              {loading ? (
                <span className="login-spinner" />
              ) : (
                'Enter'
              )}
            </span>
          </button>
        </form>
      </div>
    </main>
  )
}
