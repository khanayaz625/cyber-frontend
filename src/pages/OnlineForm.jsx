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
            await axios.post(`${import.meta.env.VITE_API_URL}/forms/submit`, data);
            setSubmitted(true);
        } catch (err) {
            alert('Error submitting form: ' + err.message);
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
        <div className="bg-gray-50 h-screen flex flex-col justify-center pt-24 pb-12 overflow-hidden">
            <div className="max-w-4xl mx-auto px-6 w-full max-h-[90vh] overflow-y-auto custom-scrollbar pr-4">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl lg:text-5xl font-black text-primary mb-3 tracking-tight">Digital <span className="text-secondary">E-Office</span></h1>
                    <p className="text-gray-500 text-base md:text-lg font-medium max-w-2xl mx-auto">No need to visit! Submit your documents online and we will handle the rest.</p>
                </header>

                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl p-8 lg:p-12 border border-gray-100"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="flex items-center text-primary font-black text-sm md:text-base mb-1"><UserCircle className="mr-2 text-secondary" size={18} /> Full Name</label>
                                <input 
                                    type="text" name="fullName" required 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-[1rem] p-4 font-bold transition-all text-sm"
                                    placeholder="Enter your full name" onChange={handleInputChange} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-primary font-black text-sm md:text-base mb-1"><Smartphone className="mr-2 text-accent" size={18} /> Phone Number</label>
                                <input 
                                    type="text" name="phone" required 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-[1rem] p-4 font-bold transition-all text-sm"
                                    placeholder="Active Mobile Number" onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-primary font-black text-sm md:text-base mb-1"><MessageCircle className="mr-2 text-green-500" size={18} /> WhatsApp (Optional)</label>
                                <input 
                                    type="text" name="whatsapp" 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-[1rem] p-4 font-bold transition-all text-sm"
                                    placeholder="WhatsApp Number" onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-primary font-black text-sm md:text-base mb-1"><Mail className="mr-2 text-blue-500" size={18} /> Email Address</label>
                                <input 
                                    type="email" name="email" 
                                    className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-[1rem] p-4 font-bold transition-all text-sm"
                                    placeholder="Optional Email" onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="flex items-center text-primary font-black text-sm md:text-base mb-1"><Globe className="mr-2 text-purple-500" size={18} /> Service Required</label>
                            <select 
                                name="serviceType" required 
                                className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-[1rem] p-4 font-bold transition-all text-sm" 
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

                        <div className="space-y-2 text-center">
                            <label className="flex items-center justify-center text-primary font-black text-base md:text-lg mb-2"><FilePlus className="mr-2 text-secondary" size={20} /> Upload Documents (Max 5)</label>
                            <div className="relative border-4 border-dashed border-gray-100 rounded-3xl p-10 hover:border-secondary transition-all group flex flex-col items-center cursor-pointer">
                                <input 
                                    type="file" multiple onChange={handleFileChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                <Upload className="w-10 h-10 text-gray-300 group-hover:text-secondary mb-3 transition-colors" />
                                <p className="text-gray-400 font-bold text-sm">Click or drag & drop documents here</p>
                                {files.length > 0 && <p className="mt-2 text-accent font-black text-sm">{files.length} Files Selected</p>}
                            </div>
                        </div>

                        <button 
                            type="submit" disabled={submitting}
                            className="w-full bg-primary text-secondary px-8 py-4 rounded-2xl text-xl font-black shadow-2xl hover:bg-gray-900 transition-all transform hover:-translate-y-1 flex items-center justify-center"
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
