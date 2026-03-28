import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, AlertTriangle, Loader2, UserCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to authenticate');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto fade-in-up mt-24">
      <div className="glass shadow-2xl rounded-[2rem] overflow-hidden">
        
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-900 p-8 border-b border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/20 blur-3xl rounded-full"></div>
          <div className="flex flex-col items-center justify-center text-center relative z-10">
            <div className="p-4 bg-white/10 backdrop-blur rounded-2xl shadow-inner border border-white/10 mb-4 inline-flex">
              <UserCircle className="w-10 h-10 text-blue-300" />
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">System Login</h1>
            <p className="text-blue-200 mt-2 text-sm font-medium">Verify credentials for operations access.</p>
          </div>
        </div>

        <div className="p-8 relative bg-slate-900/60">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-500/40 rounded-xl flex items-center gap-3 text-red-200 shadow-[0_0_20px_rgba(220,38,38,0.2)]">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400" />
              <span className="font-semibold text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Email address</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field shadow-inner p-3 rounded-xl bg-slate-800/80 w-full hover:bg-slate-800/100 transition-colors border-white/10 outline-none focus:ring-2 focus:ring-blue-500" placeholder="commander@aegis.rep" required />
            </div>
            
            <div className="space-y-1">
              <label className="font-bold text-slate-300 uppercase tracking-wider text-[11px]">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field shadow-inner p-3 rounded-xl bg-slate-800/80 w-full hover:bg-slate-800/100 transition-colors border-white/10 outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
            </div>

            <button type="submit" disabled={loading} className={`w-full py-4 mt-2 rounded-xl flex items-center justify-center gap-3 text-base font-bold shadow-2xl transition-all duration-300 ${loading ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'btn-primary'}`}>
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : <><LogIn className="w-5 h-5" /> Authenticate Identity</>}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400 font-medium">
             Need operational clearance? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors underline decoration-blue-500/30 font-bold">Register Access</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
