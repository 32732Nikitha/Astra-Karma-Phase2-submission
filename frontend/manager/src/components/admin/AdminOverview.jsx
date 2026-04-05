import React from "react";
import { mockStats, mockIncidents, mockPayouts } from "../../data/mockData";

const statCards = [
  { id: "zones", label: "Active Risk Zones", value: "04", sub: "+1 since yesterday", color: "var(--danger)" },
  { id: "workers", label: "Workers Affected", value: "128", sub: "Across 2 zones", color: "var(--warning)" },
  { id: "payouts", label: "Total Payouts", value: "₹42K", sub: "This month", color: "var(--success)" },
  { id: "pending", label: "Pending Incidents", value: "09", sub: "Awaiting review", color: "var(--brand)" },
];

export default function AdminOverview() {
  return (
    <div className="admin-overview">
      {/* Metrics Grid */}
      <div className="stat-cards-grid">
        {statCards.map((card) => (
          <div key={card.id} className="stat-card" style={{ "--card-color": card.color }}>
            <div className="stat-card-top">
              <div className="stat-card-icon" style={{ background: `${card.color}15`, color: card.color }}>
                ◈
              </div>
              <span className="stat-card-trend">ACTIVE</span>
            </div>
            <div className="stat-card-value">{card.value}</div>
            <div className="stat-card-label">{card.label}</div>
            <div className="stat-card-sub">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick Stats Bar */}
      <div className="quick-stats-bar">
        <div className="quick-stat">
          <span className="qs-icon">🛡️</span>
          <span className="qs-value">12</span>
          <span className="qs-label">Fraud Prevented</span>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">✅</span>
          <span className="qs-value">45</span>
          <span className="qs-label">Resolved Today</span>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">📍</span>
          <span className="qs-value">94%</span>
          <span className="qs-label">GPS Verified</span>
        </div>
        <div className="quick-stat">
          <span className="qs-icon">🚴</span>
          <span className="qs-value">32</span>
          <span className="qs-label">Live Riders</span>
        </div>
      </div>

      <div className="overview-panels">
        {/* Recent Incidents Panel */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Recent Incidents</h3>
              <p className="panel-sub">Latest reported risk events</p>
            </div>
            <span className="status-badge status-pending">Pending</span>
          </div>
          <div className="panel-list">
            {mockIncidents.slice(0, 4).map((inc) => (
              <div key={inc.id} className="panel-row">
                <div className={`severity-dot ${inc.severity === 'High' ? 'sev-high' : 'sev-medium'}`} />
                <div className="row-body">
                  <span className="row-title">{inc.location}</span>
                  <span className="row-meta">{inc.type} • {inc.createdByName}</span>
                </div>
                <span className="status-badge status-pending">Review</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payout Panel */}
        <div className="panel">
          <div className="panel-header">
            <div>
              <h3 className="panel-title">Payout Requests</h3>
              <p className="panel-sub">Insurance & risk compensation</p>
            </div>
            <span className="status-badge status-rejected">Urgent</span>
          </div>
          <div className="panel-list">
            {mockPayouts.slice(0, 4).map((pay) => (
              <div key={pay.id} className="panel-row">
                <div className="row-avatar">{pay.workerName.charAt(0)}</div>
                <div className="row-body">
                  <span className="row-title">{pay.workerName}</span>
                  <span className="row-meta">{pay.deliveryLocation}</span>
                </div>
                <div className="row-right">
                  <span className="payout-amount">₹{pay.amount}</span>
                  <span className="status-badge status-pending">Verify</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}