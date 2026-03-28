# AI-Powered Disaster Response Management System 🌍🚀

Welcome to the AI-Powered Disaster Response Management System! This full-stack web application is designed for real-time disaster reporting, utilizing Machine Learning to automatically predict the priority level of an incident, and plotting critical data on a dynamic Dashboard and Map visualization. 

This repository is optimized for speed, precision, and a stellar UI (Hackathon-ready).

## 🧩 Architecture Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Google Maps API
- **Backend:** Node.js, Express.js, MongoDB
- **AI / ML Module:** Python, FastAPI, Scikit-Learn (RandomForest Classifier)

---

## 🚀 Features
- **Modern Glassmorphism UI:** Built completely with Tailwind CSS, leveraging dynamic color shifts, responsive grids, and micro-animations for an ultra-premium feel.
- **Smart Triage (AI Prediction):** Reports evaluate human impact against economic loss by feeding parameters to our FastAPI Random Forest endpoint, returning immediate priority indexing (High/Medium/Low).
- **Interactive Global Mapping:** Real-time geospatial Google Maps monitoring rendering dynamic pin-drops based on incident severity.

---

## ⚙️ Getting Started

### Prerequisites
Make sure you have Node.js, NPM, and Python 3 installed on your machine. You will also need a MongoDB database (local or Atlas) and a Google Maps API Key.

### 1. Set Up the Machine Learning Service (Python)
Navigate to the `ml_model` directory. A Python environment has been configured.
```bash
cd ml_model
.\venv\Scripts\Activate.ps1
uvicorn api.main:app --port 8000 --reload
```
*The FastAPI server will boot up and handle intelligent `/predict` queries.*

### 2. Set Up the Backend Server (Node.js)
Navigate to the `backend` directory. Add your `MONGO_URI` in the `backend/.env` file.
```bash
cd backend
npm install
npm start
```
*The Express REST API will connect to MongoDB and orchestrate communication between the web app and the ML module.*

### 3. Set Up the Frontend (React + Vite)
Navigate to the `frontend` directory. Add your Google Maps API Key to `frontend/.env` as `VITE_GOOGLE_MAPS_API_KEY`.
```bash
cd frontend
npm install
npm run dev
```
*Open your browser and navigate to the localhost port provided (usually `http://localhost:5173`) to view the complete system!*

---

> By Aryan Shishodia
