import React, { useState } from "react";
import { mockIncidents } from "../../data/mockData";

function IncidentHistory({ newIncidents = [] }) {
  const [filter, setFilter] = useState("All");
  
  // Combine mock data with newly reported incidents from current session
  const allIncidents = [...newIncidents, ...mockIncidents.filter(i => i.createdByName === "Priya Sharma")];
  const filtered = allIncidents.filter(i => filter === "All" || i.status === filter);

  return (
    <div className="manager-layout">
      <div className="incidents-panel">
        <div className="incidents-toolbar">
          <div className="toolbar-left">
            <h2 className="panel-title">My Incident History</h2>
            <div className="search-box">
              <input 
                type="text" 
                placeholder="Search history..." 
                onChange={(e) => {/* logic for search */}}
              />
            </div>
          </div>
          
          <div className="action-btns">
            {["All", "Pending", "Approved", "Rejected"].map(f => (
              <button 
                key={f} 
                onClick={() => setFilter(f)}
                className={`btn-view ${filter === f ? 'active' : ''}`}
                style={filter === f ? { background: 'var(--brand)', color: 'white' } : {}}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="incidents-table-wrap">
          <table className="incidents-table">
            <thead>
              <tr>
                <th>Location</th>
                <th>Type</th>
                <th>Severity</th>
                <th>Status</th>
                <th>Reported On</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inc => (
                <tr key={inc.id}>
                  <td className="td-location">
                    <div>{inc.location}</div>
                    <div className="td-desc">{inc.description}</div>
                  </td>
                  <td><span className="type-chip">{inc.type}</span></td>
                  <td>
                    <span className={`severity-chip ${
                      inc.severity === "High" ? "sev-chip-high" : 
                      inc.severity === "Medium" ? "sev-chip-medium" : "sev-chip-low"
                    }`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${
                      inc.status === "Approved" ? "status-approved" : 
                      inc.status === "Pending" ? "status-pending" : "status-rejected"
                    }`}>
                      {inc.status}
                    </span>
                  </td>
                  <td className="font-mono" style={{ fontSize: '0.75rem' }}>
                    {new Date(inc.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default IncidentHistory;