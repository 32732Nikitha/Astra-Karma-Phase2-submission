import React, { useState } from "react";
import { mockDeliveries, mockRiskZones } from "../../data/mockData";
import { useApp } from "../../context/AppContext";

function WorkerDelivery() {
  const { user } = useApp();
  const [decision, setDecision] = useState(null);
  
  // Find current delivery or use first mock delivery
  const delivery = mockDeliveries.find(d => d.workerId === user?.id) || mockDeliveries[0];
  const riskZone = delivery.inRiskZone ? mockRiskZones[0] : null;

  return (
    <div className="worker-layout">
      {/* Risk Alert Header */}
      {delivery.inRiskZone && (
        <div className="risk-alert-banner">
          <div className="rab-icon">⚠️</div>
          <div className="rab-content">
            <h3>{riskZone?.type} Detected in Route</h3>
            <p>
              An active <strong>{riskZone?.severity}</strong> severity event is active 
              at {delivery.deliveryLocation}. Choose your safety protocol.
            </p>
          </div>
        </div>
      )}

      {/* Delivery Details Card */}
      <div className="delivery-card">
        <div className="dc-header">
          <span className="dc-order-id">ORDER #{delivery.orderId}</span>
          <span className={`status-badge ${delivery.inRiskZone ? 'status-rejected' : 'status-approved'}`}>
            {delivery.status}
          </span>
        </div>
        
        <div className="dc-body">
          <div className="dc-route">
            <div className="dc-stop">
              <span className="dc-stop-dot" />
              <div>
                <div className="dc-stop-label">Pickup From</div>
                <div className="dc-stop-addr">{delivery.pickupLocation}</div>
              </div>
            </div>
            <div className="dc-stop">
              <span className="dc-stop-dot" />
              <div>
                <div className="dc-stop-label">Deliver To</div>
                <div className="dc-stop-addr">{delivery.deliveryLocation}</div>
              </div>
            </div>
          </div>

          <div className="dc-meta-row">
            <div className="dc-meta-chip">📏 {delivery.distance}</div>
            <div className="dc-meta-chip">⏱ {delivery.estimatedTime}</div>
            {delivery.inRiskZone && (
              <div className="dc-meta-chip" style={{ color: 'var(--danger)', fontWeight: 700 }}>
                ⚡ Risk Bonus: ₹150
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Interface for Curfews/Protests */}
      {delivery.inRiskZone && !decision && (
        <div className="decision-buttons">
          <button 
            className="btn-alternate-route"
            onClick={() => setDecision('alternate')}
          >
            🔄 Safe Route
          </button>
          <button 
            className="btn-proceed-risk"
            onClick={() => setDecision('proceed')}
          >
            ⚡ Proceed (+₹150)
          </button>
        </div>
      )}

      {decision === 'proceed' && (
        <div className="success-toast" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
          Risk compensation activated. Please submit proof upon arrival.
        </div>
      )}
    </div>
  );
}

export default WorkerDelivery;