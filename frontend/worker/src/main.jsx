import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-center"
      toastOptions={{
        style: {
          background: '#ffffff',
          color: '#1e293b',
          border: '1px solid rgba(226,232,240,0.8)',
          borderRadius: '14px',
          fontFamily: 'Outfit, sans-serif',
          fontSize: '0.875rem',
          boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
        },
        success: {
          iconTheme: { primary: '#22c55e', secondary: '#ffffff' },
        },
        error: {
          iconTheme: { primary: '#ef4444', secondary: '#ffffff' },
        },
        duration: 3500,
      }}
    />
  </React.StrictMode>
)