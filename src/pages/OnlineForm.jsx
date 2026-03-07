import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, CheckCircle, Smartphone, UserCircle, Globe, Mail, MessageCircle, FilePlus } from 'lucide-react';

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

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/forms/submit`, data);
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
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 pt-32 pb-24">
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-16 rounded-[4rem] shadow-2xl text-center max-w-2xl border border-gray-100"
                >
                    <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-10 drop-shadow-lg" />
                    <h2 className="text-5xl font-black text-primary mb-6">Request Received!</h2>
                    <p className="text-gray-500 text-xl font-medium mb-12">Thank you, {formData.fullName}. Our team will contact you shortly via WhatsApp or Phone to process your request.</p>
                    <button 
                        onClick={() => setSubmitted(false)}
                        className="bg-primary text-white px-12 py-5 rounded-full text-xl font-bold shadow-2xl hover:bg-gray-800 transition-all hover:scale-105"
                    >
                        Submit Another Form
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 h-screen flex flex-col justify-center pt-24 pb-4 overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 w-full h-full flex flex-col justify-center">
                <header className="mb-2 text-center shrink-0">
                    <h1 className="text-2xl md:text-3xl font-black text-primary mb-1 tracking-tight">Digital <span className="text-secondary">E-Office</span></h1>
                    <p className="text-gray-500 text-xs md:text-sm font-medium max-w-2xl mx-auto">No need to visit! Submit your documents online and we will handle the rest.</p>
                </header>

                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[2rem] shadow-xl p-4 md:p-6 border border-gray-100 shrink-0 max-w-2xl mx-auto w-full"
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                            <div className="space-y-1">
                                <label className="flex items-center text-primary font-black text-xs mb-1"><UserCircle className="mr-1 text-secondary" size={14} /> Full Name</label>
                                <input 
                                    type="text" name="fullName" required 
                                    className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-lg p-2 font-bold transition-all text-xs"
                                    placeholder="Enter your full name" onChange={handleInputChange} 
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center text-primary font-black text-xs mb-1"><Smartphone className="mr-1 text-accent" size={14} /> Phone Number</label>
                                <input 
                                    type="text" name="phone" required 
                                    className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-lg p-2 font-bold transition-all text-xs"
                                    placeholder="Active Mobile Number" onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center text-primary font-black text-xs mb-1"><MessageCircle className="mr-1 text-green-500" size={14} /> WhatsApp (Optional)</label>
                                <input 
                                    type="text" name="whatsapp" 
                                    className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-lg p-2 font-bold transition-all text-xs"
                                    placeholder="WhatsApp Number" onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="flex items-center text-primary font-black text-xs mb-1"><Mail className="mr-1 text-blue-500" size={14} /> Email Address</label>
                                <input 
                                    type="email" name="email" 
                                    className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-lg p-2 font-bold transition-all text-xs"
                                    placeholder="Optional Email" onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="flex items-center text-primary font-black text-xs mb-1"><Globe className="mr-1 text-purple-500" size={14} /> Service Required</label>
                            <select 
                                name="serviceType" required 
                                className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-lg p-2 font-bold transition-all text-xs" 
                                onChange={handleInputChange}
                            >
                                <option value="">Select a service</option>
                                <option value="PAN Card">PAN Card Apply/Update</option>
                                <option value="Aadhar Update">Aadhar Update</option>
                                <option value="Income Certificate">Income Certificate</option>
                                <option value="Caste Certificate">Caste Certificate</option>
                                <option value="Residence Certificate">Residence Certificate</option>
                                <option value="Ration Card">Ration Card Services</option>
                                <option value="Online Form">Other Online Form (Exam/Job)</option>
                                <option value="Others">Others</option>
                            </select>
                        </div>

                        <div className="space-y-1 text-center">
                            <label className="flex items-center justify-center text-primary font-black text-xs md:text-sm mb-1"><FilePlus className="mr-1 text-secondary" size={14} /> Upload Documents (Max 5)</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 hover:border-secondary transition-all group flex flex-col items-center cursor-pointer">
                                <input 
                                    type="file" multiple onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="w-5 h-5 text-gray-300 group-hover:text-secondary mb-1 transition-colors" />
                                <p className="text-gray-400 font-bold text-[10px] md:text-xs">Click or drag documents here</p>
                                {files.length > 0 && <p className="mt-1 text-accent font-black text-[10px] md:text-xs">{files.length} Files Selected</p>}
                            </div>
                        </div>

                        <button 
                            type="submit" disabled={submitting}
                            className="w-full bg-primary text-secondary px-4 py-2 rounded-lg text-sm md:text-base font-black shadow-lg hover:bg-gray-900 transition-all transform hover:-translate-y-1 flex items-center justify-center mt-1"
                        >
                            {submitting ? 'PROCESSING...' : 'SUBMIT REQUEST'}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};

export default OnlineForm;
