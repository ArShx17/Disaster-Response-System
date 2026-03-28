from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import os
import pandas as pd

app = FastAPI(title="Disaster Priority AI API")

# Load models safely
model_path = os.path.join(os.path.dirname(__file__), '..', 'models', 'rf_priority_model.joblib')
encoder_path = os.path.join(os.path.dirname(__file__), '..', 'encoders', 'disaster_type_encoder.joblib')

try:
    clf = joblib.load(model_path)
    le = joblib.load(encoder_path)
    print("Model and encoder loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    clf = None
    le = None

class PredictionRequest(BaseModel):
    type: str
    latitude: float
    longitude: float
    casualties: int
    economic_loss: float

class PredictionResponse(BaseModel):
    priority: str

@app.get("/")
def read_root():
    return {"status": "AI Model API is running..."}

@app.post("/predict", response_model=PredictionResponse)
def predict_priority(data: PredictionRequest):
    if clf is None or le is None:
        raise HTTPException(status_code=500, detail="Models are not loaded on server.")

    try:
        # Encode disaster type 
        # Handle unseen labels by defaulting or catching error
        try:
            encoded_type = le.transform([data.type])[0]
        except ValueError:
            # If the label was never seen during training, we assign it to a default encoding.
            # 0 is normally safe to fall back to if we are just avoiding crash, though not strictly perfectly correct.
            encoded_type = 0

        # Construct feature array exactly as trained
        # ['latitude', 'longitude', 'casualties', 'economic_loss_usd', 'disaster_type_encoded']
        features = pd.DataFrame([{
            'latitude': data.latitude,
            'longitude': data.longitude,
            'casualties': data.casualties,
            'economic_loss_usd': data.economic_loss,
            'disaster_type_encoded': encoded_type
        }])

        priority_pred = clf.predict(features)[0]

        return {"priority": priority_pred}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
