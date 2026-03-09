import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Calendar, FileText, CheckCircle2, Clock, AlertCircle, ArrowRight, Info } from 'lucide-react';

const TrackApplication = () => {
    const [trackingId, setTrackingId] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!trackingId) return;
        
        setLoading(true);
        setError(null);
        setStatus(null);

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/forms/track/${trackingId.trim()}`);
            setStatus(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch status. Please check your ID.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-600 bg-green-50 border-green-200';
            case 'Processing': return 'text-indigo-600 bg-indigo-50 border-indigo-200';
            case 'Verification': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-orange-600 bg-orange-50 border-orange-200';
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block p-3 bg-indigo-600 rounded-2xl mb-6 shadow-xl shadow-indigo-200"
                    >
                        <Search className="text-white w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Track Application <span className="text-indigo-600">Status</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Enter your unique Protocol ID (e.g., JC-XXXX-YYYY) to monitor progress.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-4xl shadow-xl shadow-slate-200 border border-slate-100 mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input 
                                type="text" 
                                placeholder="Enter Protocol ID: JC-XXXX-YYYY" 
                                className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-indigo-500 focus:bg-white transition-all font-bold text-slate-700"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value.toUpperCase())}
                                required
                            />
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300">
                                <FileText size={20} />
                            </div>
                        </div>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-slate-900 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <span>FETCH STATUS</span>}
                        </button>
                    </form>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="mt-8 p-6 bg-red-50 border border-red-100 rounded-3xl text-red-600 flex items-center space-x-3 font-bold"
                            >
                                <AlertCircle />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        {status && (
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-12 space-y-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                                    <div>
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Identity Confirmed</p>
                                        <h3 className="text-2xl font-black text-slate-900">{status.fullName}</h3>
                                        <p className="text-slate-500 font-bold">{status.serviceType}</p>
                                    </div>
                                    <div className={`px-6 py-3 rounded-2xl border font-black text-sm uppercase tracking-widest ${getStatusColor(status.status)}`}>
                                        {status.status}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                            <Calendar size={20} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Protocol Intake</p>
                                            <p className="text-slate-900 font-bold">{new Date(status.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start space-x-4">
                                        <div className="p-3 bg-slate-100 rounded-xl text-slate-500">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Tracking Reference</p>
                                            <p className="text-slate-900 font-bold">{status.customerId}</p>
                                        </div>
                                    </div>
                                </div>

                                {status.notes && (
                                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
                                        <div className="flex items-center space-x-2 mb-3 text-indigo-600">
                                            <Info size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Operator Directive</span>
                                        </div>
                                        <p className="text-slate-700 font-bold italic">"{status.notes}"</p>
                                    </div>
                                )}

                                    <div className="pt-8">
                                        <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                            <span>System Intake</span>
                                            <span>Full Processing</span>
                                        </div>
                                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                            <div 
                                                className={`h-full transition-all duration-1000 ${status.status === 'Completed' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                                                style={{ 
                                                    width: status.status === 'Completed' ? '100%' : 
                                                           status.status === 'Verification' ? '85%' :
                                                           status.status === 'Processing' ? '60%' :
                                                           status.status === 'Pending' ? '30%' : '10%' 
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="text-center">
                    <p className="text-slate-400 font-bold text-sm mb-6">Need priority assistance regarding your file?</p>
                    <a 
                        href="https://wa.me/917398858482" 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center space-x-3 text-indigo-600 font-black hover:text-slate-900 transition-colors"
                    >
                        <span>TALK TO CSC OPERATOR</span>
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TrackApplication;
