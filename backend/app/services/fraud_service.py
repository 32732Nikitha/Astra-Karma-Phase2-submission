from app.services.ml_service import run_fraud_pipeline


def calculate_fraud_score(data: dict):
    """
    Calls the real 4-stage ML fraud pipeline:
    Stage 1 — Deterministic rules
    Stage 2 — XGBoost tabular model
    Stage 3 — Graph ring detection
    Stage 4 — Adaptive decision engine
    """
    try:
        result = run_fraud_pipeline(data)
        # Normalize output to FraudResponse schema
        return {
            "fraud_score": result.get("final_score", result.get("tabular_fraud_prob", 0.0)),
            "fraud_flag": bool(result.get("fraud_flag", 0)),
            "reason": result.get("all_reasons", [result.get("primary_reason", "unknown")]),
            "decision": result.get("decision", "APPROVE"),
            "payout_status": result.get("payout_status", "FULL_RELEASE"),
            "percentile": result.get("percentile", 0.0),
        }
    except Exception as e:
        import logging
        logging.getLogger(__name__).error(f"Fraud pipeline error: {e}")
        return {
            "fraud_score": 0.0,
            "fraud_flag": False,
            "reason": ["pipeline_error"],
            "decision": "APPROVE",
            "payout_status": "FULL_RELEASE",
            "percentile": 0.0,
        }