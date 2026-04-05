import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const navItems = {
  admin: [
    { label: "Overview",         view: "overview",   icon: "◈" },
    { label: "Incident Control", view: "incidents",  icon: "⚡" },
    { label: "Fraud Detection",  view: "fraud",      icon: "🛡" },
    { label: "Map Monitoring",   view: "map",        icon: "◎" },
  ],
  manager: [
    { label: "Report Incident",  view: "report",     icon: "＋" },
    { label: "Incident History", view: "history",    icon: "☰" },
  ],
  worker: [
    { label: "My Deliveries",    view: "delivery",   icon: "⬡" },
  ],
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useApp();
  const [collapsed, setCollapsed] = useState(false);
  const items = navItems[user?.role] || [];

  const getAvatarColor = (role) => {
    if (role === 'admin') return 'var(--brand)';
    if (role === 'manager') return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        {!collapsed && (
          <div className="sidebar-brand">
            <div className="sidebar-logo">🚚</div>
            <span className="sidebar-brand-name">DevTrails</span>
          </div>
        )}
        {collapsed && <div className="sidebar-logo">🚚</div>}
        <button 
          className="sidebar-collapse-btn" 
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-user">
          <div 
            className="user-avatar" 
            style={{ background: getAvatarColor(user?.role) }}
          >
            {user?.name?.charAt(0)}
          </div>
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role" style={{ color: getAvatarColor(user?.role) }}>
              {user?.role}
            </span>
          </div>
        </div>
      )}

      <nav className="sidebar-nav">
        {items.map((item) => (
          <button
            key={item.view}
            className={`nav-item ${activeTab === item.view ? "active" : ""}`}
            onClick={() => setActiveTab(item.view)}
          >
            {activeTab === item.view && <div className="nav-active-bar" />}
            <span className="nav-icon">{item.icon}</span>
            {!collapsed && <span className="nav-label">{item.label}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span className="nav-icon">⏏</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;