import React, { useState, useEffect } from 'react'
import {
  getAdminSession,
  onAdminAuthChange,
  adminSignOut,
} from '../../services/journeyService'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import './AdminApp.css'

/**
 * AdminApp
 *
 * Top-level controller for the private administrator interface.
 * Manages Supabase Auth session state and renders either AdminLogin or AdminDashboard.
 */
export default function AdminApp({ onExitAdmin }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    // Check existing session on load
    getAdminSession()
      .then((sess) => {
        if (isMounted) {
          setSession(sess)
          setLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoading(false)
      })

    // Listen to real-time auth changes (sign-in, sign-out, token refresh)
    const unsubscribe = onAdminAuthChange((_event, newSession) => {
      if (isMounted) {
        setSession(newSession)
        setLoading(false)
      }
    })

    return () => {
      isMounted = false
      unsubscribe()
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await adminSignOut()
      setSession(null)
    } catch (err) {
      console.error('Sign out error:', err)
    }
  }

  const handleReturnToSite = () => {
    if (onExitAdmin) {
      onExitAdmin()
    } else {
      window.location.href = window.location.pathname.replace(/\/admin\/?/, '') || '/'
    }
  }

  return (
    <div className="admin-viewport" role="region" aria-label="Administrator Portal">
      {/* Admin Top Navigation Bar */}
      <header className="admin-navbar">
        <div className="admin-nav-brand">
          <span style={{ fontSize: '18px' }}>❦</span>
          <h1 className="admin-brand-title">PUNEETH &amp; CHINMAI</h1>
          <span className="admin-brand-badge">ADMIN PORTAL</span>
        </div>

        <div className="admin-nav-actions">
          {session && (
            <span
              style={{
                fontSize: '11px',
                color: '#6a441e',
                marginRight: '8px',
                display: 'none',
              }}
              className="admin-user-email"
            >
              {session.user?.email}
            </span>
          )}

          <button
            type="button"
            className="admin-btn secondary"
            onClick={handleReturnToSite}
            title="Return to Public Wedding Website"
          >
            ← View Website
          </button>

          {session && (
            <button
              type="button"
              className="admin-btn danger"
              onClick={handleSignOut}
              title="Sign Out of Admin"
            >
              Sign Out
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: '#8c6527',
            fontFamily: 'Cinzel, serif',
            fontSize: '13px',
          }}
        >
          Authenticating Administrator Session...
        </div>
      ) : session ? (
        <AdminDashboard
          onSignOut={handleSignOut}
          onViewWebsite={handleReturnToSite}
        />
      ) : (
        <AdminLogin
          onLoginSuccess={() => setLoading(false)}
          onExitAdmin={handleReturnToSite}
        />
      )}
    </div>
  )
}
