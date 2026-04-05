import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import { validatePhone } from '../utils/helpers'
import toast from 'react-hot-toast'

const PLATFORMS = ['Swiggy Instamart', 'BigBasket Now', 'Flipkart Minutes', 'Amazon Now', 'FreshToHome Express', 'Zepto', 'Blinkit']

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const [step, setStep] = useState('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef([])

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer((s) => s - 1), 1000)
      return () => clearTimeout(t)
    }
  }, [resendTimer])

  const goToOtpStep = () => {
    setStep('otp')
    setTimeout(() => inputRefs.current[0]?.focus(), 100)
  }

  const handleDemoOtpStep = () => {
    if (!validatePhone(phone)) {
      toast.error('Enter a valid 10-digit mobile number')
      return
    }
    setResendTimer(0)
    goToOtpStep()
    toast.success('Enter OTP 123456 to sign in (demo)')
  }

  const handleSendOtp = async () => {
    if (!validatePhone(phone)) {
      toast.error('Enter a valid 10-digit mobile number')
      return
    }
    setLoading(true)
    try {
      await authApi.sendOtp(`+91${phone}`)
      setResendTimer(30)
      goToOtpStep()
      toast.success('OTP sent to your number')
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        'Could not send OTP. Is the API running?'
      toast.error(typeof msg === 'string' ? msg : 'Could not send OTP')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (val, idx) => {
    const digit = val.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[idx] = digit
    setOtp(next)
    if (digit && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  const handleOtpKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
  }

  const handleVerifyOtp = async () => {
    const otpStr = otp.join('')
    if (otpStr.length < 6) {
      toast.error('Enter the 6-digit OTP')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.verifyOtp(`+91${phone}`, otpStr)
      const { user, access_token, refresh_token } = res.data
      setAuth(user, access_token, refresh_token)
      toast.success('Welcome back!')
      navigate(user.onboarding_complete ? '/dashboard' : '/onboarding')
    } catch (e) {
      const msg =
        e?.response?.data?.detail ||
        e?.message ||
        'Invalid OTP or number not registered. Demo: 9876543210 + 123456.'
      toast.error(typeof msg === 'string' ? msg : 'Sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-24px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        .login-root {
          min-height: 100dvh;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          background: #f8f7ff;
        }

        /* ── LEFT PANEL ── */
        .login-left {
          width: 45%;
          position: relative;
          overflow: hidden;
          animation: fadeSlideLeft 0.7s cubic-bezier(0.34,1.2,0.64,1) both;
          /* Purple gradient shows through wherever image is transparent */
          background: linear-gradient(150deg, #4c1d95 0%, #6d28d9 40%, #7c3aed 70%, #8b5cf6 100%);
        }

        /* ── Image fills entire left panel ── */
        .rider-img-wrap {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .rider-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
          
        }

        /* Optional: subtle purple overlay on top of image for depth */
        .rider-overlay {
          position: absolute;
          inset: 0;
          z-index: 3;
          background: linear-gradient(
            160deg,
            rgba(76, 29, 149, 0.18) 0%,
            rgba(109, 40, 217, 0.12) 50%,
            rgba(139, 92, 246, 0.08) 100%
          );
          pointer-events: none;
        }

        /* ── RIGHT PANEL ── */
        .login-right {
          width: 55%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2.5rem 3rem;
          background: #ffffff;
          overflow-y: auto;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          animation: fadeSlideUp 0.65s 0.2s cubic-bezier(0.34,1.2,0.64,1) both;
        }

        /* Logo */
        .logo-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 2rem;
        }
        .logo-icon {
          width: 46px; height: 46px;
          border-radius: 13px;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          box-shadow: 0 6px 20px rgba(124,58,237,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .logo-name {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          font-size: 1.1rem;
          color: #111827;
          letter-spacing: -0.01em;
        }
        .logo-sub {
          font-size: 0.71rem;
          color: #9ca3af;
          margin-top: 1px;
        }

        /* Headline */
        .headline {
          font-family: 'Syne', sans-serif;
          font-size: 1.7rem;
          font-weight: 800;
          color: #111827;
          line-height: 1.2;
          margin-bottom: 0.55rem;
          letter-spacing: -0.025em;
        }
        .headline-accent {
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .desc-text {
          color: #6b7280;
          font-size: 0.85rem;
          line-height: 1.65;
          margin-bottom: 1rem;
        }

        /* Chips */
        .chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1.75rem;
        }
        .chip {
          font-size: 0.71rem;
          padding: 0.22rem 0.58rem;
          border-radius: 9999px;
          font-weight: 500;
          background: #f5f3ff;
          color: #7c3aed;
          border: 1px solid #ede9fe;
        }

        .divider {
          height: 1px;
          background: #f3f4f6;
          margin-bottom: 1.6rem;
        }

        /* Label */
        .form-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.5rem;
        }

        /* Phone row */
        .phone-row {
          display: flex;
          gap: 8px;
          margin-bottom: 1rem;
        }
        .country-badge {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 0.85rem;
          border-radius: 12px;
          font-family: monospace;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          height: 52px;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .phone-input {
          flex: 1;
          height: 52px;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          color: #111827;
          font-family: monospace;
          font-size: 1.05rem;
          letter-spacing: 0.1em;
          padding: 0 1rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          width: 100%;
        }
        .phone-input:focus {
          border-color: #7c3aed;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }
        .phone-input::placeholder { color: #d1d5db; }

        /* CTA */
        .cta-btn {
          height: 52px;
          width: 100%;
          background: linear-gradient(135deg, #7c3aed, #6d28d9);
          color: white;
          font-family: 'Syne', sans-serif;
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(124,58,237,0.32);
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          margin-bottom: 1.25rem;
        }
        .cta-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 7px 22px rgba(124,58,237,0.4);
        }
        .cta-btn:active:not(:disabled) { transform: translateY(0); }
        .cta-btn:disabled {
          background: #c4b5fd;
          cursor: not-allowed;
          box-shadow: none;
        }

        .hint-text {
          text-align: center;
          font-size: 0.84rem;
          color: #9ca3af;
        }
        .hint-text a {
          color: #7c3aed;
          font-weight: 600;
          text-decoration: none;
        }
        .hint-text a:hover { text-decoration: underline; }

        /* OTP */
        .otp-row {
          display: flex;
          gap: 8px;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }
        .otp-box {
          flex: 1;
          max-width: 52px;
          height: 56px;
          border: 1.5px solid #e5e7eb;
          border-radius: 12px;
          background: #f9fafb;
          color: #111827;
          font-weight: 700;
          font-size: 1.45rem;
          text-align: center;
          outline: none;
          transition: all 0.15s ease;
          font-family: 'Syne', sans-serif;
        }
        .otp-box:focus {
          border-color: #7c3aed;
          background: #f5f3ff;
          box-shadow: 0 0 0 3px rgba(124,58,237,0.1);
        }

        .back-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 0.875rem;
          color: #6b7280;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 1.25rem;
          font-family: 'DM Sans', sans-serif;
          transition: color 0.15s;
        }
        .back-btn:hover { color: #374151; }

        .resend-timer {
          font-size: 0.77rem;
          color: #9ca3af;
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .resend-btn {
          font-size: 0.77rem;
          color: #7c3aed;
          font-weight: 600;
          text-align: center;
          width: 100%;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
          margin-bottom: 1.5rem;
          font-family: 'DM Sans', sans-serif;
        }
        .resend-btn:hover { text-decoration: underline; }

        /* ── RESPONSIVE ── */
        @media (max-width: 768px) {
          .login-root    { flex-direction: column; }
          .login-left    { width: 100%; height: 300px; flex-shrink: 0; }
          .login-right   { width: 100%; padding: 2rem 1.25rem 3rem; justify-content: flex-start; }
          .login-card    { max-width: 100%; }
          .headline      { font-size: 1.45rem; }
          .otp-box       { max-width: 44px; height: 50px; font-size: 1.3rem; }
        }
      `}</style>

      <div className="login-root">

        {/* ══ LEFT PANEL — image fills entire panel ═══════════════ */}
        <div className="login-left">

          {/* Full-cover image */}
          <div className="rider-img-wrap">
            <img
              src="/Gemini_Generated_Image_viksa2viksa2viks.png"
              alt="Delivery rider on bike"
              className="rider-img"
            />
          </div>

          {/* Subtle purple tint overlay on top of image */}
          <div className="rider-overlay" />

        </div>

        {/* ══ RIGHT PANEL ═════════════════════════════════════════ */}
        <div className="login-right">
          <div className="login-card">

            {/* Logo */}
            <div className="logo-row">
              <div className="logo-icon">
                <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
                  <path d="M16 4L6 9.5V22.5L16 28L26 22.5V9.5L16 4Z" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
                  <path d="M16 4V28M6 9.5L26 22.5M26 9.5L6 22.5" stroke="white" strokeWidth="1.5" strokeOpacity="0.4" />
                </svg>
              </div>
              <div>
                <div className="logo-name">BHIMA ASTRA</div>
                <div className="logo-sub">The Gig Workers Shield</div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="headline">
              Your income,<br />
              <span className="headline-accent">always protected</span>
            </h1>

            <p className="desc-text">
              AI-powered parametric insurance for delivery partners. No paperwork. Instant payouts.
            </p>

            {/* Platform chips */}
            <div className="chips-wrap">
              {PLATFORMS.map((p) => (
                <span key={p} className="chip">{p}</span>
              ))}
            </div>

            <div className="divider" />

            {/* ── PHONE STEP ── */}
            {step === 'phone' && (
              <>
                <label className="form-label">Mobile Number</label>
                <div className="phone-row">
                  <div className="country-badge">🇮🇳 +91</div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendOtp()}
                    maxLength={10}
                    className="phone-input"
                  />
                </div>

                <button
                  className="cta-btn"
                  onClick={handleSendOtp}
                  disabled={loading || phone.length < 10}
                >
                  {loading ? (
                    <>
                      <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Sending OTP…
                    </>
                  ) : 'Send OTP →'}
                </button>

                <button
                  type="button"
                  className="resend-btn"
                  style={{ marginTop: '-0.25rem', marginBottom: '1rem' }}
                  onClick={handleDemoOtpStep}
                >
                  Continue with demo OTP (123456) →
                </button>

                <p className="hint-text">
                  New here? <Link to="/register">Create account</Link>
                </p>
              </>
            )}

            {/* ── OTP STEP ── */}
            {step === 'otp' && (
              <>
                <button
                  className="back-btn"
                  onClick={() => { setStep('phone'); setOtp(['', '', '', '', '', '']) }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  +91 {phone}
                </button>

                <label className="form-label">Enter 6-digit OTP</label>
                <p className="resend-timer" style={{ color: '#6d28d9', marginBottom: '0.75rem', lineHeight: 1.45 }}>
                  Demo: mobile <strong>9876543210</strong> and OTP <strong>123456</strong> (seeded on API startup). Other numbers work if they exist in the database.
                </p>
                <div className="otp-row">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (inputRefs.current[idx] = el)}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, idx)}
                      onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                      className="otp-box"
                      style={{
                        borderColor: digit ? '#7c3aed' : undefined,
                        background: digit ? '#f5f3ff' : undefined,
                      }}
                    />
                  ))}
                </div>

                {resendTimer > 0 ? (
                  <p className="resend-timer">Resend OTP in {resendTimer}s</p>
                ) : (
                  <button className="resend-btn" onClick={handleSendOtp}>
                    Resend OTP
                  </button>
                )}

                <button
                  className="cta-btn"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.join('').length < 6}
                >
                  {loading ? (
                    <>
                      <svg style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3" />
                        <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                      </svg>
                      Verifying…
                    </>
                  ) : 'Verify & Login →'}
                </button>

                <p className="hint-text">
                  New here? <Link to="/register">Create account</Link>
                </p>
              </>
            )}

          </div>
        </div>
      </div>
    </>
  )
}