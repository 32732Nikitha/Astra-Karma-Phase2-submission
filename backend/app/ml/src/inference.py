"""
BHIMA ASTRA — Inference API  (production-ready)
All debug prints removed. Consistent feature alignment.
"""

import pandas as pd
import numpy as np
import joblib
import os
import sys
sys.path.insert(0, "src")

from fraud_graph import enhanced_fraud_check

# ── Load all models once ───────────────────────────────────
MODELS = {}

def _load_models():
    paths = {
        # Income
        "income":                    "models/income_model.pkl",
        "income_features":           "models/income_features.pkl",
        # Disruption — forecast
        "disruption_forecast":       "models/disruption_forecast_model.pkl",
        "disruption_forecast_feat":  "models/disruption_forecast_features.pkl",
        "disruption_forecast_thr":   "models/disruption_forecast_threshold.pkl",
        # Disruption — realtime
        "disruption_realtime":       "models/disruption_realtime_model.pkl",
        "disruption_realtime_feat":  "models/disruption_realtime_features.pkl",
        "disruption_realtime_thr":   "models/disruption_realtime_threshold.pkl",
        # Premium
        "premium":                   "models/premium_model.pkl",
        "premium_scaler":            "models/premium_scaler.pkl",
        "premium_features":          "models/premium_features.pkl",
        # Fraud
        "fraud":                     "models/fraud_model.pkl",
        "fraud_features":            "models/fraud_features.pkl",
        "fraud_threshold":           "models/fraud_threshold.pkl",
    }
    missing = []
    for key, path in paths.items():
        if os.path.exists(path):
            MODELS[key] = joblib.load(path)
        else:
            missing.append(path)
    if missing:
        print(f"⚠️  Missing model files: {missing}")

# Load graph scores if available
GRAPH_SCORES = None
_GRAPH_SCORES_PATH = "data/processed/graph_scores.csv"
if os.path.exists(_GRAPH_SCORES_PATH):
    GRAPH_SCORES = pd.read_csv(_GRAPH_SCORES_PATH)

_load_models()


# ── Helper ────────────────────────────────────────────────
def _align(features: dict, feat_cols: list) -> pd.DataFrame:
    """Create aligned numeric DataFrame from raw feature dict."""
    row = pd.DataFrame([features])
    row = row.reindex(columns=feat_cols, fill_value=0)
    row = row.select_dtypes(include=[np.number]).fillna(0)
    return row


# ══════════════════════════════════════════════════════════
# 1. INCOME PREDICTION
# ══════════════════════════════════════════════════════════

def predict_income(features: dict) -> dict:
    model     = MODELS.get("income")
    feat_cols = MODELS.get("income_features", [])
    if model is None:
        return {"error": "Income model not loaded"}

    row        = _align(features, feat_cols)
    prediction = float(model.predict(row)[0])
    prediction = max(0, prediction)

    return {
        "predicted_income": round(prediction, 2),
        "income_band": (
            "Low"    if prediction < 800  else
            "Medium" if prediction < 1500 else
            "High"
        ),
    }


# ══════════════════════════════════════════════════════════
# 2. DISRUPTION PREDICTION  (forecast + realtime)
# ══════════════════════════════════════════════════════════

def predict_disruption(features: dict) -> dict:
    results = {}

    # ── 2A Forecast ────────────────────────────────────────
    f_model = MODELS.get("disruption_forecast")
    f_feat  = MODELS.get("disruption_forecast_feat", [])
    f_thr   = MODELS.get("disruption_forecast_thr", 0.50)

    if f_model and f_feat:
        row_f        = _align(features, f_feat)
        f_prob       = float(f_model.predict_proba(row_f)[0][1])
        results["forecast_probability"] = round(f_prob, 4)
        results["forecast_flag"]        = int(f_prob >= f_thr)
    else:
        results["forecast_probability"] = None
        results["forecast_flag"]        = None

    # ── 2B Realtime ────────────────────────────────────────
    r_model = MODELS.get("disruption_realtime")
    r_feat  = MODELS.get("disruption_realtime_feat", [])
    r_thr   = MODELS.get("disruption_realtime_thr", 0.50)

    if r_model and r_feat:
        row_r        = _align(features, r_feat)
        r_prob       = float(r_model.predict_proba(row_r)[0][1])
        results["realtime_probability"] = round(r_prob, 4)
        results["realtime_flag"]        = int(r_prob >= r_thr)
    else:
        results["realtime_probability"] = None
        results["realtime_flag"]        = None

    # ── Combined risk level ────────────────────────────────
    probs = [p for p in [
        results.get("forecast_probability"),
        results.get("realtime_probability")] if p is not None]
    max_prob = max(probs) if probs else 0

    results["combined_risk_level"] = (
        "High"   if max_prob >= 0.70 else
        "Medium" if max_prob >= 0.40 else
        "Low"
    )
    results["disruption_flag"] = int(
        results.get("forecast_flag", 0) == 1 or
        results.get("realtime_flag", 0) == 1
    )

    return results


# ══════════════════════════════════════════════════════════
# 3. PREMIUM CALCULATION
# ══════════════════════════════════════════════════════════

def calculate_premium(features: dict) -> dict:
    model     = MODELS.get("premium")
    scaler    = MODELS.get("premium_scaler")
    feat_cols = MODELS.get("premium_features", [])
    if model is None:
        return {"error": "Premium model not loaded"}

    row    = pd.DataFrame([features]).reindex(columns=feat_cols, fill_value=0)
    row_sc = scaler.transform(row) if scaler else row.values

    raw_premium = float(model.predict(row_sc)[0])
    premium     = round(max(49, min(119, raw_premium)), 2)

    # Predicted loss for transparency
    income      = features.get("actual_income", 1000)
    risk        = features.get("disruption_flag", 0.3)
    pred_loss   = round(income * risk * 7 * 0.30, 2)

    plan = (
        "Basic"    if premium <= 60  else
        "Standard" if premium <= 90  else
        "Premium"
    )

    return {
        "predicted_weekly_loss": pred_loss,
        "recommended_premium":   premium,
        "plan_tier":             plan,
        "premium_band":          f"₹{premium}/week",
    }


# ══════════════════════════════════════════════════════════
# 4. FRAUD CHECK  (tabular + graph combined)
# ══════════════════════════════════════════════════════════
# Add to imports at top of inference.py
from decision_engine import make_fraud_decision, load_calibration

# Add after _load_models() call at module startup:
load_calibration()   # load calibration distribution once

from fraud_pipeline import run_fraud_pipeline  # Put this import at the top level or here

def fraud_check(features: dict = None, worker_id: int = 0) -> dict:
    """
    Calls the full 4-stage fraud pipeline.
    """
    features = features or {}
    model     = MODELS.get("fraud")
    feat_cols = MODELS.get("fraud_features", [])
    
    if model is None:
        return {"error": "Fraud model not loaded"}

    # 🔥 DIRECT PIPELINE CALL — NO MANUAL OVERRIDES 🔥
    result = run_fraud_pipeline(
        features=features,
        worker_id=worker_id,
        graph_scores_df=GRAPH_SCORES,  # Global var loaded at top of inference.py
        tabular_model=model,           # Loaded from MODELS
        fraud_features=feat_cols,      # Loaded from MODELS
    )
    
    return result  # We return the pipeline's exact output!                      # ✅ Return the full pipeline result


# ══════════════════════════════════════════════════════════
# QUICK TEST
# ══════════════════════════════════════════════════════════

if __name__ == "__main__":
    print("\n🧪 Testing all inference functions...\n")

    sample_day = {
        "orders_per_day":       32,
        "surge_multiplier":     1.25,
        "incentive_bonus":      80,
        "tip_amount":           15,
        "peak_hour_flag":       1,
        "weekend_flag":         0,
        "day_of_week":          3,
        "month":                7,
        "rainfall":             72.0,
        "temperature":          31.0,
        "AQI":                  220,
        "traffic_index":        65,
        "flood_alert":          0,
        "composite_score":      0.52,
        "platform_outage":      0,
        "zone_shutdown":        0,
        "curfew_flag":          0,
        "strike_flag":          0,
        "rolling_orders_3d":    28,
        "days_since_last_active": 0,
        "experience_level":     3,
        "shift_hours":          10,
        "fraud_risk_score":     0.12,
        "cancelled_orders_ratio": 0.05,
        "location_jump_flag":   0,
        "device_switch_count":  0,
    }

    sample_claim = {
        "gps_tower_delta":          850,
        "accelerometer_variance":   0.3,
        "claim_response_time_sec":  25,
        "app_interaction_count":    1,
        "trigger_value":            72.0,
        "events_used":              1,
        "events_remaining":         1,
        "renewal_count":            2,
        "eligibility_flag":         1,
        "days_active":              14,
        "plan_tier":                1,
        "weekly_premium":           79,
        "income_loss":              900,
        "claim_auto_created":       1,
        "claim_valid_flag":         1,
    }

    sample_worker = {
        "actual_income":    1200,
        "income_loss":      400,
        "disruption_flag":  0.38,
        "composite_score":  0.45,
        "rainfall":         55,
        "AQI":              180,
        "experience_level": 3,
        "shift_hours":      10,
        "fraud_risk_score": 0.12,
        "kyc_verified":     1,
        "bank_verified":    1,
    }

    print("1. predict_income():")
    print(" ", predict_income(sample_day))

    print("\n2. predict_disruption():")
    print(" ", predict_disruption(sample_day))

    print("\n3. calculate_premium():")
    print(" ", calculate_premium(sample_worker))

    print("\n4. fraud_check():")
    print(" ", fraud_check(sample_claim, worker_id=1))

    print("\n4. fraud_check() — NORMAL USER:")
    print(fraud_check(worker_id=1))

    print("\n5. fraud_check() — FRAUD RING USER:")
    print(fraud_check(worker_id=58))