import joblib
import os
import pandas as pd

# Load paths
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "ml", "models")

# Load models once (GLOBAL)
# Hackathon bypass: Try loading the model, use dummy if not found
try:
    fraud_model = joblib.load(os.path.join(MODEL_DIR, "fraud_model.pkl"))
except FileNotFoundError:
    print("Warning: fraud_model.pkl not found. Using fallback mock mode.")
    fraud_model = None
fraud_features = joblib.load(os.path.join(MODEL_DIR, "fraud_features.pkl"))

# Import decision engine
from app.ml.src.decision_engine import make_fraud_decision

def prepare_input(data: dict):
    df = pd.DataFrame([data])
    return df

def predict_fraud(data: dict):
    try:
        df = prepare_input(data)

        # Ensure feature order
        df = df.reindex(columns=fraud_features, fill_value=0)

        prob = fraud_model.predict_proba(df)[0][1]

        return prob

    except Exception as e:
        print("ML ERROR:", e)
        return 0.0


def run_fraud_pipeline(data: dict):
    """
    FULL PIPELINE:
    rule → ml → decision
    """

    # STEP 1: ML
    fraud_prob = predict_fraud(data)

    # STEP 2: (temporary placeholders for graph + behavior)
    cluster_score = 0.2
    cluster_size = 1
    behavior_score = 0.1
    rule_score = 0.0

    # STEP 3: FINAL DECISION
    decision = make_fraud_decision(
        tabular_prob=fraud_prob,
        cluster_score=cluster_score,
        cluster_size=cluster_size,
        behavior_score=behavior_score,
        rule_score=rule_score,
        worker_id=data.get("worker_id", 0),
        features=data,
    )

    return decision
