import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Send, AlertTriangle, Loader2, Target, CheckCircle2 } from 'lucide-react';

const Report = () => {
  const [formData, setFormData] = useState({
    type: 'Earthquake', description: '', latitude: '', longitude: '', casualties: '', economic_loss: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await axios.post(import.meta.env.VITE_API_URL || 'http://localhost:5000/api/disasters', formData);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch {
      setError('Failed to securely link to AI Engine. Please check backend.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center fade-in-up">
        <div className="glass-card flex flex-col items-center p-16 text-center max-w-lg bg-green-500/10 border-green-500/30">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(34,197,94,0.4)]">
             <CheckCircle2 className="w-12 h-12 text-green-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Transmission Sent!</h2>
          <p className="text-emerald-200">Incident relayed to the ML Engine for operational priority assessing. Redirecting to Live Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto fade-in-up pt-10">
      <div className="glass shadow-2xl rounded-[2rem] overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-blue-500/20 blur-3xl rounded-full"></div>
          <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-white/10 backdrop-blur rounded-2xl shadow-inner border border-white/10">
              <Target className="w-8 h-8 text-blue-300" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Deploy Incident</h1>
              <p className="text-blue-200 mt-2 text-lg font-medium">Record coordinates. Let the algorithms calculate the priority.</p>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-12 relative bg-slate-900/60">
          {error && (
            <div className="mb-8 p-5 bg-red-900/50 border border-red-500/40 rounded-2xl flex items-center gap-4 text-red-200 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-xs">Event Classification</label>
                <select name="type" value={formData.type} onChange={handleChange} className="input-field shadow-inner" required>
                  {['Earthquake', 'Flood', 'Hurricane', 'Wildfire', 'Storm Surge', 'Tornado', 'Extreme Heat', 'Volcanic Eruption', 'Drought', 'Landslide'].map(t => (
                    <option key={t} value={t} className="bg-slate-800">{t}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-xs">Estimated Casualties</label>
                <input type="number" name="casualties" value={formData.casualties} onChange={handleChange} className="input-field focus:ring-rose-500 focus:border-rose-500 shadow-inner" placeholder="0" required />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-xs">Geospatial Latitude</label>
                <input type="number" step="any" name="latitude" value={formData.latitude} onChange={handleChange} className="input-field font-mono shadow-inner" placeholder="34.0522" required />
              </div>

              <div className="space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-xs">Geospatial Longitude</label>
                <input type="number" step="any" name="longitude" value={formData.longitude} onChange={handleChange} className="input-field font-mono shadow-inner" placeholder="-118.2437" required />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-xs">Estimated Economic Loss (USD)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                     <span className="text-slate-500 font-bold">$</span>
                  </div>
                  <input type="number" name="economic_loss" value={formData.economic_loss} onChange={handleChange} className="input-field pl-10 focus:ring-emerald-500 focus:border-emerald-500 shadow-inner" placeholder="5,000,000" required />
                </div>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="font-bold text-slate-300 uppercase tracking-wider text-xs">Tactical Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange} className="input-field h-36 resize-none shadow-inner" placeholder="Enter sit-rep details..." required />
              </div>

            </div>

            <button type="submit" disabled={loading} className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-lg font-bold shadow-2xl transition-all duration-300 ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'btn-primary'}`}>
              {loading ? (
                 <><Loader2 className="w-6 h-6 animate-spin" /> Transmitting to Neural Network...</>
              ) : (
                 <><Send className="w-6 h-6" /> Calculate AI Priority & Submit</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Report;
