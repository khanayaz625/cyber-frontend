import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Upload, 
    CheckCircle, 
    Smartphone, 
    UserCircle, 
    Globe, 
    Mail, 
    MessageCircle, 
    FilePlus, 
    Send, 
    Info, 
    ShieldCheck,
    CloudIcon
} from 'lucide-react';

const OnlineForm = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        whatsapp: '',
        serviceType: '',
        details: ''
    });

    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [hoveredField, setHoveredField] = useState(null);

    const handleInputChange = (e) => {
        let { name, value } = e.target;
        
        // Force uppercase for name field as per user request
        if (name === 'fullName') {
            value = value.toUpperCase();
        }

        // Restrict phone to numbers only
        if (name === 'phone' || name === 'whatsapp') {
            value = value.replace(/\D/g, ''); // Remove non-digits
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        for (let i = 0; i < files.length; i++) {
            data.append('documents', files[i]);
        }

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/forms/submit`, data);
            setSubmitted(true);
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message;
            alert('Error submitting form: ' + errorMsg);
        } finally {
            setSubmitting(false);
        }
    };
    if (submitted) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center p-6 relative overflow-hidden font-sans">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sky-100 rounded-full blur-[120px] -ml-64 -mb-64"></div>
                
                <motion.div 
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-12 md:p-16 rounded-4xl shadow-[0_32px_64px_-16px_rgba(79,70,229,0.1)] text-center max-w-xl border border-slate-100 relative z-10"
                >
                    <div className="bg-emerald-500 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-100 animate-bounce-subtle">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    
                    <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight leading-tight">Submission <span className="text-indigo-600">Successful</span></h2>
                    <p className="text-slate-500 text-lg font-bold mb-10 leading-relaxed italic">System successfully logged your request, <span className="text-indigo-600 not-italic">{formData.fullName}</span>. An operative will contact you regarding the <span className="text-slate-900 not-italic uppercase tracking-tight">{formData.serviceType}</span> via secure channels.</p>
                    
                    <button 
                        onClick={() => {
                            setSubmitted(false);
                            setFormData({ fullName: '', email: '', phone: '', whatsapp: '', serviceType: '', details: '' });
                            setFiles([]);
                        }}
                        className="bg-indigo-600 text-white px-10 py-5 rounded-2xl text-lg font-black shadow-2xl shadow-indigo-200 hover:bg-slate-900 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center mx-auto space-x-3 group"
                    >
                        <span>Register Another Case</span>
                        <Send size={20} className="text-white group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-surface min-h-screen flex flex-col pt-32 pb-20 relative overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 font-sans">
            <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-20 right-1/4 w-[600px] h-[600px] bg-sky-50 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto px-6 w-full relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 px-4 py-2 rounded-full mb-6"
                    >
                        <ShieldCheck className="text-indigo-600 w-4 h-4" />
                        <span className="text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">Verified Secure Uplink</span>
                    </motion.div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tighter leading-none">
                        Digital <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Registration</span>
                    </h1>
                    <p className="text-slate-400 text-lg md:text-xl font-bold max-w-2xl mx-auto leading-relaxed">
                        Transmit your information safely to <span className="text-slate-900">Javed Computers</span>. 
                        Professional processing for official government applications.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Benefits Section */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-indigo-50/50 group transition-all">
                            <h3 className="text-slate-900 text-xl font-black mb-8 flex items-center">
                                <Info className="text-indigo-600 mr-3" /> Operation Flow
                            </h3>
                            <ul className="space-y-6">
                                {[
                                    { title: 'Identity Entry', desc: 'Personal details for secure logs', icon: <UserCircle /> },
                                    { title: 'Protocol Check', desc: 'Select your specific service type', icon: <Globe /> },
                                    { title: 'Asset Uplink', desc: 'Securely attach required documents', icon: <FilePlus /> },
                                    { title: 'Sync Status', desc: 'Get updates on your portal status', icon: <MessageCircle /> }
                                ].map((step, i) => (
                                    <li key={i} className="flex items-start space-x-4">
                                        <div className="bg-slate-50 p-3 rounded-2xl text-indigo-600 border border-transparent group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            {step.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-slate-900 font-bold tracking-tight">{step.title}</h4>
                                            <p className="text-slate-400 text-sm font-medium leading-tight">{step.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-white p-8 rounded-4xl border border-slate-100 shadow-lg shadow-indigo-50/30 text-center">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">Support Direct Line</p>
                            <a href="https://wa.me/917398858482" className="bg-slate-900 text-white p-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all flex items-center justify-center shadow-lg shadow-slate-200">
                                <Smartphone size={18} className="mr-2 text-indigo-400" /> WhatsApp Support
                            </a>
                        </div>
                    </div>

                    {/* Form Section */}
                    <motion.div 
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="lg:col-span-8 bg-white/5 backdrop-blur-3xl rounded-4xl shadow-3xl p-8 md:p-12 border border-white/10 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                        
                        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[
                                    { name: 'fullName', label: 'Full Identity', icon: <UserCircle size={14} />, placeholder: 'LEGAL NAME ONLY', type: 'text', required: true },
                                    { name: 'phone', label: 'Primary Contact', icon: <Smartphone size={14} />, placeholder: '00000 00000', type: 'tel', required: true },
                                    { name: 'whatsapp', label: 'WhatsApp Key', icon: <MessageCircle size={14} />, placeholder: 'OPTIONAL SYNC', type: 'tel' },
                                    { name: 'email', label: 'Secure Email', icon: <Mail size={14} />, placeholder: 'address@domain.com', type: 'email' }
                                ].map((field) => (
                                    <div key={field.name} className="relative group">
                                        <label className={`flex items-center text-[10px] font-black uppercase tracking-[0.2em] mb-3 transition-colors ${hoveredField === field.name ? 'text-indigo-600' : 'text-slate-400'}`}>
                                            <span className="mr-2">{field.icon}</span> {field.label}
                                        </label>
                                        <div className="relative">
                                            <input 
                                                type={field.type} 
                                                name={field.name} 
                                                required={field.required}
                                                onFocus={() => setHoveredField(field.name)}
                                                onBlur={() => setHoveredField(null)}
                                                className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 focus:bg-white outline-none rounded-2xl p-5 text-slate-700 font-bold transition-all placeholder:text-slate-300 placeholder:font-black group-hover:border-slate-100 shadow-sm"
                                                placeholder={field.placeholder}
                                                onChange={handleInputChange} 
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <label className={`flex items-center text-[10px] font-black uppercase tracking-[0.2em] mb-3 transition-colors ${hoveredField === 'service' ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    <span className="mr-2"><Globe size={14} /></span> Service Protocol Selection
                                </label>
                                <select 
                                    name="serviceType" required 
                                    onFocus={() => setHoveredField('service')}
                                    onBlur={() => setHoveredField(null)}
                                    className="w-full bg-slate-50 border-2 border-slate-50 focus:border-indigo-600 focus:bg-white outline-none rounded-2xl p-5 text-slate-700 font-bold transition-all appearance-none cursor-pointer group-hover:border-slate-100 shadow-sm" 
                                    onChange={handleInputChange}
                                >
                                    <option value="">Initialize Protocol Link...</option>
                                    <option value="PAN Card">PAN Card System</option>
                                    <option value="Aadhar Update">Aadhar Verification</option>
                                    <option value="Income Certificate">Income Registration</option>
                                    <option value="Caste Certificate">Caste Validation</option>
                                    <option value="Residence Certificate">Domicile Protocol</option>
                                    <option value="Ration Card">PDS Card Gateway</option>
                                    <option value="Online Form">Exam/Emp Gateway</option>
                                    <option value="Others">General Services</option>
                                </select>
                            </div>

                            <div className="space-y-4">
                                <label className="flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                                    <span className="mr-2"><CloudIcon size={14} /></span> Document Asset Uplink
                                </label>
                                <div className="relative border-2 border-dashed border-slate-100 rounded-4xl p-12 hover:border-indigo-600 transition-all group/upload bg-slate-50 flex flex-col items-center cursor-pointer hover:bg-white">
                                    <input 
                                        type="file" multiple onChange={handleFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                    />
                                    <div className="bg-white p-6 rounded-3xl shadow-lg shadow-indigo-50/50 mb-4 group-hover/upload:bg-indigo-600 group-hover/upload:text-white transition-all text-indigo-600">
                                        <Upload size={32} className="transition-transform group-hover/upload:-translate-y-1" />
                                    </div>
                                    <h4 className="text-slate-900 font-black mb-1">Select Identity Files</h4>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">PDF, PNG, JPG (MAX 10MB)</p>
                                    
                                    <AnimatePresence>
                                        {files.length > 0 && (
                                            <motion.div 
                                                initial={{ y: 10, opacity: 0 }}
                                                animate={{ y: 0, opacity: 1 }}
                                                className="mt-8 flex flex-wrap gap-2 justify-center"
                                            >
                                                {Array.from(files).map((f, i) => (
                                                    <span key={i} className="bg-indigo-50 text-indigo-600 text-[10px] uppercase font-black px-4 py-2 rounded-xl border border-indigo-100 flex items-center shadow-sm">
                                                        <FilePlus size={12} className="mr-2" /> {f.name.slice(0, 15)}...
                                                    </span>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            <button 
                                type="submit" disabled={submitting}
                                className="w-full bg-slate-900 text-white py-6 rounded-3xl text-xl font-black shadow-2xl shadow-indigo-100 hover:bg-slate-800 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center relative overflow-hidden group disabled:opacity-50 disabled:translate-y-0"
                            >
                                {submitting ? (
                                    <div className="flex items-center space-x-3">
                                        <div className="w-5 h-5 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                                        <span>SYNCHRONIZING...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-3">
                                        <span>AUTHORIZE TRANSMISSION</span>
                                        <Send size={22} className="text-indigo-400" />
                                    </div>
                                )}
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default OnlineForm;
