# Bhima Astra® — Parametric Insurance AI Simulator

A high-fidelity, real-time fraud detection and parametric insurance simulation platform.
Styled faithfully after the **Nuvia Webflow Template** (warm ivory palette, sage green accents, Cormorant Garamond + DM Sans typography).

---

## Project Structure

```
bhima_astra/
├── index.html              # Main simulator page
├── styles/
│   └── nuvia.css           # Nuvia-faithful design system
├── src/
│   ├── data.js             # Worker profiles + disruption events (from CSV)
│   ├── engine.js           # ML pipeline (fraud_rules, behavior_model, decision_engine)
│   ├── ui.js               # DOM updates, gauges, terminal, modal
│   └── main.js             # Simulation orchestrator
├── models/                 # (PKL files — referenced by Python backend if deployed)
└── README.md
```

---

## ML Pipeline Stages

| Stage | Script              | Logic |
|-------|---------------------|-------|
| 1     | `disruption.csv`    | Environmental Oracle — rainfall, AQI, traffic gauges |
| 2     | `fraud_rules.py`    | Deterministic rule engine — 4 rules, GPS/motion/timing/device |
| 3     | `behavior_model.py` | LSTM-style behavior scoring — GPS + motion + interaction + jump |
| 4     | `decision_engine.py`| Adaptive percentile decisioning — tabular + graph + behavior + rules |

---

## Running Locally

Simply open `index.html` in any modern browser. No build step required.

```bash
# Option 1: Direct file open
open index.html

# Option 2: Local server (avoids any CORS issues)
npx serve .
# or
python3 -m http.server 8080
```

---

## Design System (Nuvia Template)

| Token         | Value                        |
|---------------|------------------------------|
| Background    | `#FAF7F2` (parchment)        |
| Surface       | `#F5F0E8` (cream)            |
| Accent        | `#5A6E50` (sage green)       |
| Warning       | `#C8923A` (amber warm)       |
| Danger        | `#B84040` (muted red)        |
| Display font  | Cormorant Garamond (serif)   |
| Body font     | DM Sans (sans-serif)         |
| Data font     | DM Mono (monospace)          |

---

## Worker Profiles

| ID       | Name             | Platform         | Fraud Risk |
|----------|------------------|------------------|------------|
| W-0001   | Ajay Mishra      | Swiggy Instamart | 0.3451     |
| W-0002   | Pooja Sharma     | Zepto            | 0.6571 ⚠  |
| W-0003   | Sarla Tripathi   | Amazon Now       | 0.2202     |
| W-0004   | Srikanth Sharma  | Swiggy Instamart | 0.2578     |
| W-SYNTH  | Synthetic Trace  | —                | 0.5500     |

> **Pooja Sharma (W-0002)** is the clearest fraud case — GPS delta 820m, near-zero accelerometer variance, response time 28s, device blacklisted, in a cluster of 4.

---

## Explanation Generator

The Decision Modal includes an **XGBoost Feature Importance** panel that converts raw signal weights into percentage bars — showing which features most influenced the final verdict.

---

## Data Sources

- Worker profiles: `data/workers.csv`
- Claims features: `data/policy_claims.csv`  
- Graph scores: `data/processed/graph_scores.csv`
- Disruption events: `data/features/disruption.csv`

---

*Bhima Astra® v2.4.1 · Parametric Intelligence Platform*
