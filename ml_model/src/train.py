import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib
import os

def assign_priority(row):
    if row['severity_index'] >= 7.0 or row['casualties'] >= 100:
        return 'high'
    elif row['severity_index'] >= 4.0 or row['casualties'] >= 30:
        return 'medium'
    return 'low'

def train_model():
    dataset_path = os.path.join(os.path.dirname(__file__), '..', 'dataset', 'global_disaster_response_2018_2024.csv')
    
    print("Loading dataset...")
    df = pd.read_csv(dataset_path)

    # Preprocess
    print("Preprocessing data...")
    df['priority'] = df.apply(assign_priority, axis=1)

    # Features: disaster_type, latitude, longitude, casualties, economic_loss_usd
    features = ['disaster_type', 'latitude', 'longitude', 'casualties', 'economic_loss_usd']
    X = df[features].copy()
    y = df['priority']

    # Impute missing values
    X['casualties'] = X['casualties'].fillna(X['casualties'].median())
    X['economic_loss_usd'] = X['economic_loss_usd'].fillna(X['economic_loss_usd'].median())
    X['latitude'] = X['latitude'].fillna(X['latitude'].mean())
    X['longitude'] = X['longitude'].fillna(X['longitude'].mean())
    X['disaster_type'] = X['disaster_type'].fillna('Unknown')

    # Encode categorical feature
    le = LabelEncoder()
    X['disaster_type_encoded'] = le.fit_transform(X['disaster_type'])
    
    # Drop original categorical string column
    X = X.drop('disaster_type', axis=1)

    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)

    print("Saving models...")
    os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'models'), exist_ok=True)
    os.makedirs(os.path.join(os.path.dirname(__file__), '..', 'encoders'), exist_ok=True)
    
    joblib.dump(clf, os.path.join(os.path.dirname(__file__), '..', 'models', 'rf_priority_model.joblib'))
    joblib.dump(le, os.path.join(os.path.dirname(__file__), '..', 'encoders', 'disaster_type_encoder.joblib'))

    print("Training completed successfully!")

if __name__ == "__main__":
    train_model()
