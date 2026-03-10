import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, Calendar, FileText, CheckCircle2, Clock, AlertCircle, ArrowRight, Info, Printer, Download, Share2, X, ShieldCheck, MapPin, Phone, RotateCcw, MessageCircle } from 'lucide-react';

const TrackApplication = () => {
    const [trackingId, setTrackingId] = useState('');
    const [status, setStatus] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [viewingReceipt, setViewingReceipt] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const id = params.get('id');
        if (id) {
            setTrackingId(id.toUpperCase());
            autoTrack(id.toUpperCase());
        }
    }, [location.search]);

    const autoTrack = async (id) => {
        setLoading(true);
        setError(null);
        setStatus(null);
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/forms/track/${id.trim()}`);
            setStatus(res.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch status. Please check your ID.');
        } finally {
            setLoading(false);
        }
    };

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
            case 'Processing': return 'text-secondary bg-secondary/10 border-secondary/20';
            case 'Verification': return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'Rejected': return 'text-red-600 bg-red-50 border-red-200';
            default: return 'text-orange-600 bg-orange-50 border-orange-200';
        }
    };

    const handleShareWhatsApp = (form) => {
        const text = `*OFFICIAL SERVICE RECEIPT*\n\n*Candidate:* ${form.fullName}\n*Service:* ${form.serviceType}\n*Total Fee:* ₹${form.totalAmount || 0}\n*Paid:* ₹${form.paidAmount || 0} (${form.paymentMethod || 'Pending'})\n*Balance:* ₹${(form.totalAmount || 0) - (form.paidAmount || 0)}\n*Status:* ${form.status}\n\n_Track here:_ ${window.location.origin}/track?id=${form.customerId}\n\n_Thank you for choosing Javed Computers._`;
        window.open(`https://wa.me/91${form.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-block p-3 bg-secondary rounded-2xl mb-6 shadow-xl shadow-cyan-200"
                    >
                        <Search className="text-white w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                        Track Application <span className="text-secondary">Status</span>
                    </h1>
                    <p className="text-slate-500 font-medium text-lg">Enter your Application ID to check your current progress.</p>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-4xl shadow-xl shadow-slate-200 border border-slate-100 mb-12">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Enter Application ID"
                                className="w-full pl-6 pr-12 py-5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-secondary focus:bg-white transition-all font-bold text-slate-700"
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
                            className="bg-secondary hover:bg-slate-900 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-lg shadow-cyan-100 disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <span>CHECK STATUS</span>}
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
                                        <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-1">Candidate Details</p>
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
                                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Application Date</p>
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
                                    <div className="bg-secondary/10 p-6 rounded-3xl border border-secondary/20">
                                        <div className="flex items-center space-x-2 mb-3 text-secondary">
                                            <Info size={16} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Note from Admin</span>
                                        </div>
                                        <p className="text-slate-700 font-bold italic">"{status.notes}"</p>
                                    </div>
                                )}

                                <div className="pt-8">
                                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                                        <span>Pending</span>
                                        <span>Completed</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                        <div
                                            className={`h-full transition-all duration-1000 ${status.status === 'Completed' ? 'bg-emerald-500' : 'bg-secondary'}`}
                                            style={{
                                                width: status.status === 'Completed' ? '100%' :
                                                    status.status === 'Verification' ? '85%' :
                                                        status.status === 'Processing' ? '60%' :
                                                            status.status === 'Pending' ? '30%' : '10%'
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-8 flex justify-center">
                                    <button
                                        onClick={() => setViewingReceipt(true)}
                                        className="flex items-center space-x-3 bg-secondary text-white px-8 py-4 rounded-2xl font-black text-xs hover:bg-slate-900 transition-all shadow-xl shadow-cyan-100 cursor-pointer"
                                    >
                                        <Printer size={18} />
                                        <span>GENERATE SERVICE RECEIPT</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Receipt Modal */}
                <AnimatePresence>
                    {viewingReceipt && status && (
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 md:p-8">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-slate-900/40 backdrop-blur-2xl print:hidden"
                                onClick={() => setViewingReceipt(false)}
                            />
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                                className="bg-white text-slate-900 w-full max-w-2xl max-h-[85vh] rounded-[2.5rem] shadow-3xl overflow-y-auto relative z-10 print:shadow-none print:rounded-none print:w-full print:max-w-none print:absolute print:top-0 print:left-0 print:h-screen print:max-h-none print:overflow-visible custom-scrollbar"
                            >
                                {/* Receipt Header */}
                                <div className="bg-slate-900 p-8 text-white flex justify-between items-center print:bg-white print:text-black print:border-b-2 print:border-slate-900">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-secondary p-3 rounded-2xl print:bg-slate-900">
                                            <ShieldCheck size={24} className="text-white" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight leading-none print:text-xl">JAVED COMPUTERS</h2>
                                            <p className="text-secondary text-[10px] font-black uppercase tracking-[0.2em] mt-1 print:text-slate-500">Official Digital Service Receipt</p>
                                        </div>
                                    </div>
                                    <div className="text-right hidden sm:block print:block">
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Receipt No.</p>
                                        <p className="font-mono text-secondary font-bold print:text-slate-900">REC-{status.customerId?.split('-')[2] || 'NX'}</p>
                                    </div>
                                </div>

                                <div className="p-10 space-y-10 print:p-8 print:space-y-6 text-left">
                                    {/* Candidate Info */}
                                    <div className="grid grid-cols-2 gap-8 print:gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bill To / Candidate</p>
                                            <h3 className="text-xl font-black text-slate-900 uppercase">{status.fullName}</h3>
                                            <p className="text-sm font-bold text-slate-500 mt-1">{status.phone}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Application Date</p>
                                            <h3 className="text-lg font-bold text-slate-900">{new Date(status.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</h3>
                                            <p className="text-sm font-bold text-secondary uppercase tracking-widest mt-1">ID: {status.customerId}</p>
                                        </div>
                                    </div>

                                    {/* Service Details Table */}
                                    <div className="border-y border-slate-100 py-6 print:border-slate-900">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-left">
                                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4">Service Description</th>
                                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 text-center">Reference</th>
                                                    <th className="text-[10px] font-black text-slate-400 uppercase tracking-widest pb-4 text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-2">
                                                        <p className="font-black text-slate-900 text-lg">{status.serviceType}</p>
                                                        <p className="text-xs font-bold text-slate-500 italic">Government Protocol Processing</p>
                                                    </td>
                                                    <td className="text-center font-mono text-sm font-bold text-slate-600">{status.customerId}</td>
                                                    <td className="text-right">
                                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-secondary border border-slate-200">{status.status}</span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Financial Summary */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                                                <span className="w-4 h-0.5 bg-secondary"></span>
                                                <span>Financial Summary</span>
                                            </p>
                                            <div className="bg-slate-50 rounded-3xl p-6 space-y-3 border border-slate-100">
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-bold text-slate-500">Service Fee:</span>
                                                    <span className="font-black text-slate-900">₹{status.totalAmount || 0}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-bold text-slate-500">Advance Paid:</span>
                                                    <span className="font-black text-emerald-600">₹{status.paidAmount || 0}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-bold text-slate-500">Payment Mode:</span>
                                                    <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-black uppercase text-slate-700">{status.paymentMethod || 'Pending'}</span>
                                                </div>
                                                <div className="h-px bg-slate-200 my-2"></div>
                                                <div className="flex justify-between text-lg">
                                                    <span className="font-black text-slate-900">Balance Due:</span>
                                                    <span className="font-black text-rose-600">₹{(status.totalAmount || 0) - (status.paidAmount || 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="p-6 bg-white border-4 border-double border-slate-200 rounded-3xl -rotate-6 shadow-sm">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization</p>
                                                <p className="text-xl font-black text-secondary leading-none uppercase tracking-tighter">
                                                    {(status.totalAmount || 0) - (status.paidAmount || 0) <= 0 ? 'FULLY SETTLED' : 'PARTIAL PAY'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex flex-col md:flex-row justify-between gap-8 pt-10 border-t border-slate-100 print:flex-row">
                                        <div className="flex-1 space-y-4 text-left">
                                            <div className="flex items-start space-x-3 text-slate-500">
                                                <MapPin size={18} className="text-secondary mt-1 shrink-0" />
                                                <span className="text-sm font-bold leading-tight">Near Nagar Palika Main Road Javed Computers Chirgaon Dist Jhansi 284301</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-slate-500">
                                                <Phone size={18} className="text-secondary shrink-0" />
                                                <span className="text-sm font-black">+91 7398858482</span>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right flex flex-col items-center md:items-end justify-center">
                                            <div className="w-32 h-32 border border-slate-100 rounded-xl mb-3 flex items-center justify-center bg-slate-50 print:border-slate-900">
                                                <RotateCcw className="text-slate-200 w-12 h-12" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center print:bg-white print:border-none print:px-0">
                                        <p className="text-xs font-bold text-slate-500">Note: This is a system generated document. For any queries, please visit Javed Computers or contact via WhatsApp with your Application ID.</p>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="bg-slate-50 p-6 flex flex-wrap justify-center gap-4 print:hidden">
                                    <button onClick={() => window.print()} className="flex items-center space-x-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-secondary transition-all cursor-pointer">
                                        <Printer size={16} /> <span>PRINT / DOWNLOAD</span>
                                    </button>
                                    <button onClick={() => handleShareWhatsApp(status)} className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-emerald-600 transition-all cursor-pointer">
                                        <MessageCircle size={16} /> <span>SHARE ON WHATSAPP</span>
                                    </button>
                                    <button onClick={() => setViewingReceipt(false)} className="flex items-center space-x-2 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-black text-xs hover:bg-slate-100 transition-all cursor-pointer">
                                        <X size={16} /> <span>CLOSE</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="text-center">
                    <p className="text-slate-400 font-bold text-sm mb-6">Need priority assistance regarding your file?</p>
                    <a
                        href="https://wa.me/917398858482"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center space-x-3 text-secondary font-black hover:text-slate-900 transition-colors"
                    >
                        <span>WhatsApp for Support</span>
                        <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </div>
    );
};

export default TrackApplication;
