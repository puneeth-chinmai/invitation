import React, { useState } from 'react'
import { adminSignIn } from '../../services/journeyService'
import { isSupabaseConfigured } from '../../services/supabaseClient'

/**
 * AdminLogin
 *
 * Secure authentication form for authorized administrator sign-in.
 * Prevents unauthorized public access to administrative data operations.
 */
export default function AdminLogin({ onLoginSuccess, onExitAdmin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState(null)

  const isConfigured = isSupabaseConfigured()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.')
      return
    }

    setLoading(true)
    setErrorMsg(null)

    try {
      await adminSignIn(email.trim(), password)
      onLoginSuccess()
    } catch (err) {
      setErrorMsg(err.message || 'Invalid administrator credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
        padding: '24px 16px',
      }}
    >
      <div
        className="admin-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          boxShadow: '0 12px 36px rgba(45, 22, 6, 0.12)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              fontFamily: 'Noto Serif Kannada',
              fontSize: '15px',
              color: '#8c6527',
              marginBottom: '4px',
            }}
          >
            ಪ್ರೀತಿಯ ಪಯಣ · ನಿರ್ವಹಣೆ
          </div>
          <h1
            style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '20px',
              fontWeight: 700,
              color: '#6d1620',
              margin: '4px 0',
              letterSpacing: '0.1em',
            }}
          >
            ADMINISTRATOR PORTAL
          </h1>
          <p
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontStyle: 'italic',
              fontSize: '14px',
              color: '#6a441e',
              margin: 0,
            }}
          >
            Puneeth &amp; Chinmai — Memories &amp; Milestones Management
          </p>
        </div>

        {!isConfigured && (
          <div className="admin-notice warning" style={{ textAlign: 'left' }}>
            <strong>Configuration Needed:</strong>
            <br />
            Supabase environment variables are not detected.
            <br />
            Please configure <code>VITE_SUPABASE_URL</code> and{' '}
            <code>VITE_SUPABASE_ANON_KEY</code> in your <code>.env</code> file.
          </div>
        )}

        {errorMsg && <div className="admin-notice error">{errorMsg}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-email">
              Administrator Email
            </label>
            <input
              id="admin-email"
              type="email"
              className="admin-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wedding.com"
              required
              disabled={loading || !isConfigured}
            />
          </div>

          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-password">
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              className="admin-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              disabled={loading || !isConfigured}
            />
          </div>

          <button
            type="submit"
            className="admin-btn primary"
            disabled={loading || !isConfigured}
            style={{ padding: '12px', marginTop: '6px' }}
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(196, 150, 76, 0.25)' }}>
          <button
            type="button"
            className="admin-btn secondary"
            onClick={onExitAdmin}
            style={{ fontSize: '10px' }}
          >
            ← Return to Wedding Invitation
          </button>
        </div>
      </div>
    </div>
  )
}
