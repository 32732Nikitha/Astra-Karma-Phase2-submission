import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

function Topbar({ title, subtitle }) {
  const { user } = useApp();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getRoleColor = (role) => {
    if (role === 'admin') return 'var(--brand)';
    if (role === 'manager') return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-title-group">
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div className="topbar-status">
          <div className="status-dot active" />
          <span className="status-text">LIVE</span>
        </div>

        <div className="topbar-time">
          <span className="time-clock">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
          <span className="time-date">
            {time.toLocaleDateString([], { day: '2-digit', month: 'short' })}
          </span>
        </div>

        <div 
          className="topbar-avatar" 
          style={{ background: getRoleColor(user?.role) }}
        >
          {user?.name?.charAt(0)}
        </div>
      </div>
    </header>
  );
}

export default Topbar;