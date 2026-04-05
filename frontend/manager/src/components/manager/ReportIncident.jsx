import React, { useState } from "react";

function ReportIncident({ onSubmit }) {
  const [form, setForm] = useState({ 
    location: "", 
    type: "Protest", 
    severity: "Medium", 
    description: "" 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API Delay
    await new Promise(r => setTimeout(r, 1000));
    
    const newIncident = { 
      ...form, 
      id: `inc${Date.now()}`, 
      status: "Pending", 
      createdAt: new Date().toISOString(),
      createdByName: "Manager User" 
    };
    
    onSubmit && onSubmit(newIncident);
    setSuccess(true);
    setLoading(false);
    setForm({ location: "", type: "Protest", severity: "Medium", description: "" });
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="manager-layout" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <div className="report-form-card">
        <div className="form-card-header">
          <h2>Report New Incident</h2>
          <p>Submit a curfew, protest or strike event for admin review</p>
        </div>

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-field">
            <label>📍 Incident Location</label>
            <input
              type="text"
              placeholder="e.g. Abids Junction, Hyderabad"
              value={form.location}
              onChange={e => setForm({...form, location: e.target.value})}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>⚡ Incident Type</label>
              <select
                value={form.type}
                onChange={e => setForm({...form, type: e.target.value})}
              >
                <option>Curfew</option>
                <option>Protest</option>
                <option>Strike</option>
              </select>
            </div>
            <div className="form-field">
              <label>🔴 Severity Level</label>
              <select
                value={form.severity}
                onChange={e => setForm({...form, severity: e.target.value})}
                className={form.severity === "High" ? "badge-danger" : ""}
                style={{ padding: '10px' }}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>
          </div>

          <div className="form-field">
            <label>📝 Description</label>
            <textarea
              placeholder="Describe the situation, road blockages, etc."
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required
            />
          </div>

          {success && (
            <div className="success-toast">
              <span>✅</span> Incident reported successfully! Awaiting review.
            </div>
          )}

          <button type="submit" className="form-submit-btn" disabled={loading}>
            {loading ? (
              <div className="spinner white" />
            ) : (
              "Submit Incident Report"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReportIncident;