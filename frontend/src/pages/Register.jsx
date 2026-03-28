import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertTriangle, Loader2, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', adminCode: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await register(formData.name, formData.email, formData.password, formData.adminCode);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto fade-in-up mt-16 pb-12">
      <div className="glass shadow-2xl rounded-[2rem] overflow-hidden border border-emerald-500/10 hover:border-emerald-500/30 transition-colors">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-900 p-8 border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/20 blur-3xl rounded-full"></div>
          <div className="flex flex-col items-center justify-center text-center relative z-10">
            <div className="p-4 bg-white/10 backdrop-blur rounded-2xl shadow-inner border border-white/10 mb-4 inline-flex">
              <UserPlus className="w-10 h-10 text-emerald-300" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Register Operator</h1>
            <p className="text-emerald-200 mt-2 text-sm font-medium">Join coordinate operations division.</p>
          </div>
        </div>

        <div className="p-8 relative bg-slate-900/60">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/40 rounded-xl flex items-center gap-3 text-red-200 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="input-field shadow-inner p-3 rounded-xl bg-slate-800/80 w-full border-white/10 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="John Doe" required />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Email address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="input-field shadow-inner p-3 rounded-xl bg-slate-800/80 w-full border-white/10 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="new.op@aegis.rep" required />
            </div>
            
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="input-field shadow-inner p-3 rounded-xl bg-slate-800/80 w-full border-white/10 outline-none focus:ring-2 focus:ring-emerald-500" placeholder="••••••••" required />
            </div>

            <div className="space-y-1 pt-2">
              <label className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex gap-2 items-center"><ShieldCheck className="w-3" /> Admin Auth Code (Optional)</label>
              <input type="password" name="adminCode" value={formData.adminCode} onChange={handleChange} className="input-field shadow-inner p-3 rounded-xl bg-amber-900/20 w-full border-amber-500/20 text-amber-200 placeholder-amber-400/30 outline-none focus:ring-2 focus:ring-amber-500" placeholder="Leave empty for generic User" />
            </div>

            <button type="submit" disabled={loading} className={`w-full py-4 mt-6 rounded-xl flex items-center justify-center gap-3 text-base font-bold shadow-2xl transition-all duration-300 ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'btn-primary bg-gradient-to-br from-emerald-500 to-teal-600 border-none'}`}>
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Provisioning Data...</> : <><UserPlus className="w-5 h-5" /> Enlist Credentials</>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400 font-medium">
             Already cleared? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30 font-bold">Login terminal</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
