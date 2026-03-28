import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Shield, Activity, MapPin } from 'lucide-react';
import Home from './pages/Home';
import Report from './pages/Report';
import Dashboard from './pages/Dashboard';

function Navigation() {
  const location = useLocation();

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
          <Link to="/report" className={`nav-link ${location.pathname === '/report' ? 'active' : ''}`}>Report</Link>
          <Link to="/dashboard" className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>Live Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen text-slate-100 selection:bg-blue-500/30 selection:text-blue-200 flex flex-col pt-32">
        <Navigation />
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 pb-12 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
