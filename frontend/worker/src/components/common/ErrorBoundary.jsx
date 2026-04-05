import React from 'react'
import { appPath } from '../../utils/appPath'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            padding: '24px',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Background accent shape */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, #6B21E8 0%, #7C3AED 50%, #8B5CF6 100%)',
            }}
          />

          {/* Soft purple glow blob behind icon */}
          <div
            style={{
              position: 'absolute',
              width: '280px',
              height: '280px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          {/* Logo / Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '40px',
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6B21E8 0%, #7C3AED 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '14px',
                letterSpacing: '-0.5px',
              }}
            >
              G
            </div>
            <span
              style={{
                fontWeight: '700',
                fontSize: '16px',
                color: '#1a1a2e',
                letterSpacing: '-0.3px',
              }}
            >
              GigShield
            </span>
          </div>

          {/* Icon */}
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, rgba(107,33,232,0.1) 0%, rgba(139,92,246,0.15) 100%)',
              border: '1.5px solid rgba(124,58,237,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px',
              position: 'relative',
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#1a1a2e',
              marginBottom: '10px',
              letterSpacing: '-0.4px',
              lineHeight: 1.3,
            }}
          >
            Something went wrong
          </h2>

          {/* Error message */}
          <p
            style={{
              fontSize: '14px',
              color: '#64748b',
              marginBottom: '32px',
              maxWidth: '300px',
              lineHeight: '1.6',
            }}
          >
            {this.state.error?.message || 'An unexpected error occurred. Please try returning to the dashboard.'}
          </p>

          {/* CTA Button */}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null })
              window.location.href = appPath('/dashboard')
            }}
            style={{
              background: 'linear-gradient(135deg, #6B21E8 0%, #7C3AED 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              letterSpacing: '-0.2px',
              boxShadow: '0 4px 20px rgba(107,33,232,0.35)',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              maxWidth: '280px',
              width: '100%',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(107,33,232,0.45)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(107,33,232,0.35)'
            }}
          >
            Return to Dashboard
          </button>

          {/* Support link */}
          <p
            style={{
              marginTop: '20px',
              fontSize: '13px',
              color: '#94a3b8',
            }}
          >
            Need help?{' '}
            <a
              href="/support"
              style={{
                color: '#7C3AED',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Contact Support
            </a>
          </p>
        </div>
      )
    }
    return this.props.children
  }
}