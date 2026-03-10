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
        <div className="bg-[#0B1120] h-screen flex items-center justify-center p-6 overflow-hidden relative font-sans">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full -mr-64 -mt-64 blur-[120px]"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full -ml-64 -mb-64 blur-[120px]"></div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-primary/40 border border-white/5 p-8 lg:p-10 rounded-4xl shadow-2xl backdrop-blur-xl max-w-sm w-full relative z-10"
            >
                <Link to="/" className="absolute top-6 left-6 text-slate-500 hover:text-secondary bg-white/5 p-2 rounded-xl hover:bg-white/10 transition-all z-20 shadow-sm border border-white/5" title="Return to Home">
                    <ArrowLeft size={16} />
                </Link>
                <div className="bg-secondary w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-secondary/20 border border-white/10">
                    <ShieldCheck className="text-primary w-8 h-8" />
                </div>
                <h1 className="text-3xl font-black text-white text-center mb-1 tracking-tight">Admin Login</h1>
                <p className="text-slate-500 text-center mb-8 text-[10px] font-black tracking-[0.2em] uppercase leading-none mt-2">Private Access Only</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div
                                initial={{ height: 0, opacity: 0, y: -10 }}
                                animate={{ height: 'auto', opacity: 1, y: 0 }}
                                exit={{ height: 0, opacity: 0, y: -10 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl flex items-start space-x-3 shadow-sm">
                                    <ShieldAlert className="text-rose-500 shrink-0 mt-0.5" size={16} />
                                    <div className="space-y-1">
                                        <p className="text-rose-400 font-black text-[10px] uppercase tracking-wider leading-none">Access Refused</p>
                                        <p className="text-rose-500/80 font-bold text-[10px] leading-tight">{error}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-2">
                        <label className="text-slate-500 font-black ml-4 text-[10px] tracking-widest uppercase block">Login ID / Username</label>
                        <div className="relative group">
                            <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors z-20" />
                            <input
                                type="text" name="username" required
                                className="w-full bg-white/5 border-2 border-white/5 focus:border-secondary outline-none rounded-2xl p-4 pl-14 font-bold text-white transition-all focus:bg-white/10 placeholder:text-slate-600 shadow-xl focus:shadow-secondary/10"
                                placeholder="e.g. admin" onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-slate-500 font-black ml-4 text-[10px] tracking-widest uppercase block">Password</label>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-secondary transition-colors z-20" />
                            <input
                                type="password" name="password" required
                                className="w-full bg-white/5 border-2 border-white/5 focus:border-secondary outline-none rounded-2xl p-4 pl-14 font-bold text-white transition-all focus:bg-white/10 placeholder:text-slate-600 shadow-xl focus:shadow-secondary/10 text-sm"
                                placeholder="••••••••••••" onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit" disabled={loading}
                            className="w-full bg-secondary text-primary py-5 rounded-2xl text-base font-black shadow-2xl hover:bg-white hover:text-primary transition-all flex items-center justify-center space-x-3 hover:scale-[1.03] active:scale-[0.98] group relative overflow-hidden"
                        >
                            <span className="relative z-10 uppercase tracking-widest leading-none mt-1">{loading ? 'Verifying...' : 'Sign In'}</span>
                            <ArrowRight size={20} className="text-primary group-hover:translate-x-1 transition-all z-10" />
                        </button>
                    </div>

                    <div className="text-center">
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center space-x-2">
                            <span className="w-1 h-1 bg-secondary rounded-full animate-pulse"></span>
                            <span>Connected Host: {window.location.hostname}</span>
                        </p>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
