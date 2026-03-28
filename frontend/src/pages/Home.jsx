import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Activity, Radar, Globe2 } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] text-center fade-in-up">
      
      {/* Live Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-sm font-bold mb-12 animate-pulse cursor-default">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
        Global ML Monitoring Active
      </div>

      <div className="relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter leading-tight relative z-10 drop-shadow-2xl">
          Intelligence for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
            Critical Response.
          </span>
        </h1>
      </div>

      <p className="text-xl md:text-2xl text-slate-300 mb-14 max-w-3xl mx-auto font-light leading-relaxed">
        Report emerging crises. Our trained Random Forest engine predicts severity in milliseconds. Orchestrate deploying aid globally exactly where it’s needed.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
        <Link to="/report" className="btn-primary group flex items-center justify-center gap-3 text-lg">
          Report Incident
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
        </Link>
        <Link to="/dashboard" className="glass py-4 px-8 rounded-2xl font-bold text-lg hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3">
          <Activity className="w-6 h-6" />
          Open Dashboard
        </Link>
      </div>

      {/* Floating features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-24">
        <FeatureCard 
          icon={<Radar className="w-10 h-10 text-indigo-400" />}
          title="Instant ML Triage"
          desc="Algorithm automates urgency indexing mapping economic vs casualty variables."
        />
        <FeatureCard 
          icon={<Globe2 className="w-10 h-10 text-blue-400" />}
          title="Real-Time Grid"
          desc="Live operational grid to observe synchronized markers securely stored in MongoDB."
        />
        <FeatureCard 
          icon={<Activity className="w-10 h-10 text-rose-400" />}
          title="Bulletproof Backend"
          desc="Memory fallback functionality guarantees seamless uptime for response units."
        />
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="glass-card flex flex-col items-start text-left animate-floating group">
    <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/5 group-hover:border-white/20 transition-colors shadow-inner">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-3 text-white tracking-tight">{title}</h3>
    <p className="text-slate-400 text-base leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Home;
