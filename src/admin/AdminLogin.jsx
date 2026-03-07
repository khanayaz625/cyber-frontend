import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
            setError('Invalid username or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-primary h-screen flex items-center justify-center p-6 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full -mr-48 -mt-48 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full -ml-48 -mb-48 blur-3xl"></div>
            
            <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white/10 backdrop-blur-3xl border border-white/20 p-8 lg:p-12 rounded-[3rem] shadow-2xl max-w-md w-full relative z-10"
            >
                <Link to="/" className="absolute top-6 left-6 text-white/50 hover:text-white bg-white/5 p-2 rounded-2xl hover:bg-white/20 transition-all z-20 tooltip" title="Back to Home">
                    <ArrowLeft size={20} />
                </Link>
                <div className="bg-secondary/20 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-secondary/30">
                    <ShieldCheck className="text-secondary w-10 h-10" />
                </div>
                <h1 className="text-3xl font-black text-white text-center mb-2 tracking-tight">Admin <span className="text-secondary">Gateway</span></h1>
                <p className="text-white/60 text-center mb-8 text-sm font-medium">Restricted Access. Authorized Personnel Only.</p>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/20 text-red-100 p-5 rounded-3xl border border-red-500/30 flex items-center space-x-4">
                            <ShieldAlert className="shrink-0" />
                            <p className="font-bold">{error}</p>
                        </div>
                    )}
                    <div className="space-y-3">
                        <label className="text-gray-400 font-black ml-4 text-xs tracking-widest uppercase">Username</label>
                        <div className="relative group">
                            <User size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-secondary" />
                            <input 
                                type="text" name="username" required 
                                className="w-full bg-white/5 border-2 border-transparent focus:border-secondary outline-none rounded-2xl p-4 pl-12 font-bold text-white transition-all focus:bg-white/10" 
                                placeholder="Admin ID" onChange={handleChange} 
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <label className="text-gray-400 font-black ml-4 text-xs tracking-widest uppercase">Secret Matrix</label>
                        <div className="relative group">
                            <Lock size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent" />
                            <input 
                                type="password" name="password" required 
                                className="w-full bg-white/5 border-2 border-transparent focus:border-secondary outline-none rounded-2xl p-4 pl-12 font-bold text-white transition-all focus:bg-white/10" 
                                placeholder="••••••••" onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" disabled={loading}
                        className="w-full bg-secondary text-primary py-4 rounded-2xl text-xl font-black shadow-2xl hover:bg-cyan-300 transition-all flex items-center justify-center space-x-3 hover:scale-105 active:scale-95 mt-4"
                    >
                        <span>{loading ? 'AUTHENTICATING...' : 'AUTHORIZE LOGIN'}</span>
                        <ArrowRight size={20} />
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
