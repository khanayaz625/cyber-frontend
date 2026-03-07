import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Services from './pages/Services';
import PriceList from './pages/PriceList';
import OnlineForm from './pages/OnlineForm';
import Contact from './pages/Contact';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';

function AppContent() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {!isAdminPath && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/price-list" element={<PriceList />} />
          <Route path="/online-form" element={<OnlineForm />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
      {!isAdminPath && (
        <footer className="bg-primary pt-24 pb-12 text-center mt-auto border-t border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/5 rounded-full -mt-48 blur-3xl"></div>
            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row justify-between items-start space-y-12 md:space-y-0 text-white/40">
                <div className="text-left md:w-1/3">
                    <h3 className="text-4xl font-black text-white mb-2">Javed <span className="text-secondary">Computers</span></h3>
                    <p className="text-xl font-medium mb-6">Digital Hub for Uttar Pradesh</p>
                    <p className="text-sm font-bold leading-relaxed max-w-sm">Authorized CSC Operator <br/> Uttar Pradesh Digital Services Division</p>
                </div>

                <div className="flex flex-col text-left md:w-1/3 space-y-4">
                    <h4 className="text-xl font-black text-white mb-2">Contact Details</h4>
                    <a href="tel:7398858482" className="hover:text-secondary transition-colors font-bold text-lg flex items-center space-x-3">
                        <span className="bg-white/10 p-2 rounded-lg">📞</span> <span>+91 73988 58482</span>
                    </a>
                    <a href="mailto:javedcomputer786@gmail.com" className="hover:text-secondary transition-colors font-bold text-lg flex items-center space-x-3">
                         <span className="bg-white/10 p-2 rounded-lg">✉️</span> <span>javedcomputer786@gmail.com</span>
                    </a>
                    <a href="https://maps.app.goo.gl/ZZQNQoVBeV3S97n2A" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors font-bold text-lg flex items-center space-x-3">
                         <span className="bg-white/10 p-2 rounded-lg">📍</span> <span>View Location on Map</span>
                    </a>
                </div>

                <div className="text-left md:w-1/3 md:text-right flex flex-col space-y-4">
                    <h4 className="text-xl font-black text-white mb-2 md:mb-4">Quick Links</h4>
                    <div className="flex flex-col space-y-2 font-black text-lg tracking-tight">
                        <a href="/services" className="hover:text-secondary transition-colors">Services</a>
                        <a href="/price-list" className="hover:text-secondary transition-colors">Rate Chart</a>
                        <a href="/online-form" className="hover:text-secondary transition-colors">Digital E-Office</a>
                        <a href="/contact" className="hover:text-secondary transition-colors">Support</a>
                    </div>
                </div>
            </div>
            
            <div className="relative z-10 max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 text-white/30 text-sm font-bold">
                <p>© 2026 Javed Computers. All Rights Reserved.</p>
            </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
