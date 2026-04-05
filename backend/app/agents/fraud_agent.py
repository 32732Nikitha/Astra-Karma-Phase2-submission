from app.services.ml_service import run_fraud_pipeline

result = run_fraud_pipeline(claim_data)

fraud_flag = result["fraud_flag"]
decision = result["action"]