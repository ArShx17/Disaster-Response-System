import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, MapPin, LogIn, LogOut, UserCircle } from 'lucide-react';
import Home from './pages/Home';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function Navigation() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'glass py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="bg-slate-900 border border-white/20 p-2.5 rounded-xl relative z-10 flex items-center justify-center">
              <Shield className="w-7 h-7 text-blue-400 group-hover:scale-110 transition-transform duration-300" />
            </div>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-white hidden sm:block">Aegis<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Response</span></span>
        </Link>
        
        <div className="flex gap-8 items-center bg-slate-900/50 backdrop-blur-md rounded-full px-6 py-2 border border-white/10 shadow-lg">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          
          {user && (
             <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>Report</Link>
          )}

          {user?.role === 'admin' && (
             <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Live Dashboard</Link>
          )}

          {user ? (
             <div className="flex items-center gap-4 pl-4 border-l border-white/10 relative group cursor-pointer" onClick={logout}>
               <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">{user.name}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'}`}>{user.role}</span>
               </div>
               <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
               </div>
             </div>
          ) : (
             <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors pl-4 border-l border-white/10">
                <UserCircle className="w-5 h-5" /> Login Identity
             </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen text-slate-100 selection:bg-blue-500/30 selection:text-blue-200 flex flex-col pt-32">
          <Navigation />
          <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute requireAdmin={true}><Dashboard /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
