import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Activity, Radio, AlertTriangle, ShieldCheck, MapPin, Radar } from 'lucide-react';
import DisasterMap from '../components/Map';
import DisasterCard from '../components/DisasterCard';

const Dashboard = () => {
  const [disasters, setDisasters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDisasters();
    // Poll for updates every 10 seconds to make it a "live" dashboard
    const interval = setInterval(fetchDisasters, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDisasters = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL || 'http://localhost:5000/api/disasters');
      setDisasters(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    high: disasters.filter(d => d.priority === 'high').length,
    medium: disasters.filter(d => d.priority === 'medium').length,
    low: disasters.filter(d => d.priority === 'low').length,
    totalLoss: disasters.reduce((acc, d) => acc + d.economic_loss, 0),
    totalCasualties: disasters.reduce((acc, curr) => acc + curr.casualties, 0)
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="relative">
           <div className="absolute inset-0 bg-blue-500 rounded-full blur-[50px] animate-pulse"></div>
           <Radar className="w-16 h-16 text-blue-400 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="fade-in-up">
      {/* Top Bar */}
      <div className="glass rounded-[2rem] p-6 md:p-8 mb-10 flex flex-col xl:flex-row justify-between items-center gap-8 border-t border-l border-white/20">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-rose-500/20 rounded-2xl border border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.3)]">
            <Radio className="w-8 h-8 text-rose-400 animate-pulse" />
          </div>
          <div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 tracking-tight">Active Operation Grid</h1>
            <p className="text-slate-400 font-medium mt-1">Live satellite and intelligence sync running.</p>
          </div>
        </div>
        
        {/* Ticker / Quick Stats */}
        <div className="flex gap-4 w-full xl:w-auto overflow-x-auto custom-scrollbar pb-2 xl:pb-0">
          <StatBadge title="Critical Events" val={stats.high} icon={<AlertTriangle className="w-4 h-4 text-rose-400" />} bg="bg-rose-500/10" border="border-rose-500/30" />
          <StatBadge title="Elevated Events" val={stats.medium} icon={<Activity className="w-4 h-4 text-amber-400" />} bg="bg-amber-500/10" border="border-amber-500/30" />
          <StatBadge title="Minor Incidents" val={stats.low} icon={<ShieldCheck className="w-4 h-4 text-emerald-400" />} bg="bg-emerald-500/10" border="border-emerald-500/30" />
          <StatBadge title="Total Casualties" val={stats.totalCasualties.toLocaleString()} icon={<Activity className="w-4 h-4 text-blue-400" />} bg="bg-blue-500/10" border="border-blue-500/30" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - List */}
        <div className="lg:col-span-4 flex flex-col gap-6 max-h-[800px] overflow-y-auto pr-4 custom-scrollbar relative">
          <div className="sticky top-0 z-10 bg-[#0b1120]/90 backdrop-blur-md py-4 border-b border-white/10 mb-2 flex items-center justify-between">
             <h2 className="text-xl font-bold tracking-tight text-slate-200">Incoming Feed</h2>
             <span className="text-xs bg-blue-500/20 text-blue-300 font-bold px-3 py-1 rounded-full">{disasters.length} Logs</span>
          </div>

          {disasters.length === 0 ? (
            <div className="glass-card text-center text-slate-500 py-16 flex flex-col items-center">
              <MapPin className="w-12 h-12 mb-4 opacity-50" />
              <p>No active incidents registered in telemetry.</p>
            </div>
          ) : (
             disasters.map((disaster, idx) => (
                <div key={disaster._id} className="fade-in-up" style={{ animationDelay: `${idx * 50}ms` }}>
                  <DisasterCard disaster={disaster} />
                </div>
             ))
          )}
        </div>

        {/* Right Column - Map Interface */}
        <div className="lg:col-span-8">
           <div className="glass p-2 relative h-[800px] flex overflow-hidden rounded-[2rem] border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
             <div className="absolute top-6 left-6 z-10 glass px-4 py-2 rounded-xl border border-white/20 text-sm font-bold text-white/80 shadow-lg flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div> Live GPS Feed Tracking
             </div>
             <DisasterMap disasters={disasters} />
           </div>
        </div>

      </div>
    </div>
  );
};

const StatBadge = ({ title, val, icon, bg, border }) => (
  <div className={`fade-in-up min-w-[160px] flex flex-col p-4 rounded-2xl border ${bg} ${border} backdrop-blur-sm transition-transform hover:scale-105`}>
    <div className="flex items-center gap-2 mb-2 text-slate-300 font-semibold text-xs uppercase tracking-wider">
      {icon} {title}
    </div>
    <span className="text-3xl font-black text-white">{val}</span>
  </div>
);

export default Dashboard;
