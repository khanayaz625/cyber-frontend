import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, User, Lock, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

const AdminLogin = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/admin/login`, credentials);
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin/dashboard');
        } catch (err) {
            setError('The credentials provided do not match our records.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-surface h-screen flex items-center justify-center p-6 overflow-hidden relative font-sans">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-50 rounded-full -ml-64 -mb-64 blur-[120px]"></div>
            
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white border border-slate-100 p-8 lg:p-10 rounded-4xl shadow-2xl shadow-indigo-100/50 max-w-sm w-full relative z-10"
            >
                <Link to="/" className="absolute top-6 left-6 text-slate-400 hover:text-indigo-600 bg-slate-50 p-2 rounded-xl hover:bg-white transition-all z-20 shadow-sm" title="Return to Home">
                    <ArrowLeft size={16} />
                </Link>
                <div className="bg-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-200">
                    <ShieldCheck className="text-white w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-slate-900 text-center mb-1 tracking-tight">Security Gateway</h1>
                <p className="text-slate-400 text-center mb-8 text-[10px] font-black tracking-[0.2em] uppercase">AES-256 Encryption</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ height: 0, opacity: 0, y: -10 }}
                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: -10 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-rose-50 border border-border-rose-100 p-4 rounded-2xl flex items-start space-x-3 shadow-sm border-rose-100">
                                    <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={16} />
                                    <div className="space-y-1">
                                        <p className="text-rose-600 font-black text-[10px] uppercase tracking-wider leading-none">Access Refused</p>
                                        <p className="text-rose-500 font-bold text-[10px] leading-tight">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-slate-500 font-black ml-4 text-[10px] tracking-widest uppercase block">Operator Identifier</label>
                        <div className="relative group">
                            <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-20" />
                            <input 
                                type="text" name="username" required 
                                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 outline-none rounded-2xl p-4 pl-14 font-bold text-slate-800 transition-all focus:bg-white placeholder:text-slate-300 shadow-xs focus:shadow-indigo-100" 
                                placeholder="e.g. admin" onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-500 font-black ml-4 text-[10px] tracking-widest uppercase block">Security Passphrase</label>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors z-20" />
                            <input 
                                type="password" name="password" required 
                                className="w-full bg-slate-50 border-2 border-slate-100 focus:border-indigo-600 outline-none rounded-2xl p-4 pl-14 font-bold text-slate-800 transition-all focus:bg-white placeholder:text-slate-300 text-sm shadow-xs focus:shadow-indigo-100" 
                                placeholder="••••••••••••" onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit" disabled={loading}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl text-base font-black shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-3 hover:scale-[1.03] active:scale-[0.98] group relative overflow-hidden"
                        >
                            <span className="relative z-10 uppercase tracking-widest">{loading ? 'Verifying...' : 'Authenticate Access'}</span>
                            <ArrowRight size={20} className="text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all z-10" />
                            <div className="absolute inset-x-0 bottom-0 h-0 bg-indigo-600 group-hover:h-full transition-all duration-300 z-0"></div>
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-center space-x-2">
                            <span className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse"></span>
                            <span>Secure Node: {window.location.hostname}</span>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
