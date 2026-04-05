import React, { useState } from "react";
import { mockIncidents } from "../../data/mockData";

export default function IncidentControl() {
  const [incidents, setIncidents] = useState(mockIncidents);
  const [filter, setFilter] = useState("All");

  const filtered = incidents.filter(i => filter === "All" || i.status === filter);

  return (
    <div className="animate-fade-up space-y-6">
      {/* Control Bar */}
      <div className="card p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2">
          {["All", "Pending", "Approved", "Rejected"].map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`nav-item !py-1.5 !px-4 ${filter === f ? 'active' : ''}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex gap-3">
          <span className="badge badge-yellow font-jetbrains">{incidents.filter(i => i.status === "Pending").length} Pending</span>
        </div>
      </div>

      {/* Table Container */}
      <div className="card p-0 overflow-hidden shadow-xl">
        <table className="data-table">
          <thead>
            <tr>
              <th>Location & Details</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Reported By</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(inc => (
              <tr key={inc.id} className="animate-slide-in">
                <td>
                  <div className="font-700 text-slate-800">{inc.location}</div>
                  <div className="text-xs text-slate-400 truncate max-w-[200px]">{inc.description}</div>
                </td>
                <td><span className="badge badge-gray">{inc.type}</span></td>
                <td>
                  <span className={`badge ${inc.severity === 'High' ? 'badge-red' : 'badge-yellow'}`}>
                    {inc.severity}
                  </span>
                </td>
                <td className="text-sm font-500">{inc.createdByName}</td>
                <td>
                  <span className={`badge ${inc.status === 'Pending' ? 'badge-yellow' : 'badge-green'}`}>
                    {inc.status}
                  </span>
                </td>
                <td>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}