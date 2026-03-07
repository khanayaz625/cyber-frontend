import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, LogOut, CheckCircle, Clock, Trash, ExternalLink, Menu, X, TerminalSquare, AlertCircle, Phone, Mail, MapPin, Briefcase, MessageCircle, Edit2, RotateCcw } from 'lucide-react';

const AdminDashboard = () => {
    const [forms, setForms] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [newJob, setNewJob] = useState({ title: '', lastDate: '', applyLink: '', documentRequired: '', fee: '' });
    const [newService, setNewService] = useState({ name: '', description: '', category: 'Government Services', price: 0 });
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [activeTab, setActiveTab] = useState('Applications');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [editServicePrice, setEditServicePrice] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) navigate('/admin');
        fetchForms();
        fetchJobs();
        fetchServices();
    }, []);

    const fetchForms = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/forms`);
            setForms(res.data);
            const pending = res.data.filter(f => f.status === 'Pending').length;
            const completed = res.data.filter(f => f.status === 'Completed').length;
            setStats({ total: res.data.length, pending, completed });
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const fetchJobs = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`);
            setJobs(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`);
            setServicesData(res.data);
        } catch (err) {
            console.error('Fetch error:', err);
        }
    };

    const handleCreateJob = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/jobs`, newJob);
            setNewJob({ title: '', lastDate: '', applyLink: '', documentRequired: '', fee: '' });
            fetchJobs();
        } catch (err) {
            alert('Failed to post job');
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/services`, newService);
            setNewService({ name: '', description: '', category: 'Government Services', price: 0 });
            fetchServices();
        } catch (err) {
            alert('Failed to post service');
        }
    };

    const deleteJob = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
            fetchJobs();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const deleteService = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/services/${id}`);
            fetchServices();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const startEditingPrice = (service) => {
        setEditingServiceId(service._id);
        setEditServicePrice(service.price);
    };

    const saveServicePrice = async (service) => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/services/${service._id}`, { ...service, price: Number(editServicePrice) });
            setEditingServiceId(null);
            fetchServices();
        } catch (err) {
            alert('Update failed');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/forms/${id}/status`, { status });
            fetchForms();
        } catch (err) {
            alert('Update failed');
        }
    };

    const deleteForm = async (id) => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/forms/${id}`);
            fetchForms();
        } catch (err) {
            alert('Delete failed');
        }
    };

    const logout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const tabs = [
        { id: 'Applications', icon: Users, label: 'Applications' },
        { id: 'Jobs', icon: Briefcase, label: 'Jobs' },
        { id: 'Services', icon: FileText, label: 'Services & Prices' },
        { id: 'Settings', icon: Settings, label: 'Settings' }
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="flex items-center space-x-5 mb-10 px-2">
                <div className="bg-secondary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30">
                    <LayoutDashboard size={28} className="text-primary" />
                </div>
                <div>
                    <h2 className="text-3xl font-black tracking-tight leading-tight">Admin</h2>
                    <p className="text-secondary text-sm font-bold tracking-widest uppercase mt-1">Console</p>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button 
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} 
                            className={`flex items-center space-x-5 w-full p-4 font-black rounded-2xl transition-all duration-300 outline-none ${
                                isActive 
                                ? 'bg-secondary text-primary shadow-xl shadow-secondary/20 translate-x-2' 
                                : 'text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                        >
                            <Icon size={22} className={isActive ? 'text-primary' : ''} /> 
                            <span className="text-lg">{tab.label}</span>
                        </button>
                    );
                })}
            </div>
            
            <div className="mt-6 space-y-4">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                   <div className="flex items-center space-x-2 mb-2">
                       <TerminalSquare size={14} className="text-green-400" />
                       <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">System Status</span>
                   </div>
                   <p className="text-[10px] text-gray-500 font-mono flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></span> Database Connected</p>
                </div>

                <button onClick={logout} className="flex items-center justify-center space-x-3 w-full p-4 text-red-400 hover:text-white font-black rounded-2xl bg-red-500/10 hover:bg-red-500 transition-all group outline-none">
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> <span>Logout Admin</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-gray-50 h-screen overflow-hidden flex w-full font-sans">
            {/* Desktop Sidebar */}
            <div className="bg-[#0B1121] relative w-[340px] text-white p-8 shrink-0 hidden lg:flex flex-col shadow-2xl z-40 border-r border-white/5 overflow-y-auto">
                <SidebarContent />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div 
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-[#0B1121] text-white p-8 z-50 lg:hidden shadow-2xl overflow-y-auto"
                        >
                            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-8 right-8 text-white/50 hover:text-white bg-white/10 p-2 rounded-xl">
                                <X size={20} />
                            </button>
                            <SidebarContent />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 relative bg-[#F8FAFC]">
                {/* Mobile Header Navigation */}
                <div className="lg:hidden flex justify-between items-center mb-10 bg-white p-5 rounded-[2rem] shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-4">
                        <div className="bg-secondary/20 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <LayoutDashboard className="text-secondary w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-primary">Console</h2>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-gray-50 text-primary rounded-2xl hover:bg-gray-100 transition-colors">
                        <Menu size={24} />
                    </button>
                </div>

                <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 space-y-6 md:space-y-0">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tight">
                            System <span className="text-secondary underline decoration-secondary/30 decoration-8 underline-offset-4">Intelligence</span>
                        </h1>
                        <p className="text-gray-400 font-bold mt-3 max-w-lg">Overseeing Javed Computers Digital Operations & Resource Management</p>
                    </div>
                    <div className="flex items-center space-x-4 self-start md:self-auto">
                        <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-black text-sm flex items-center space-x-3 shadow-sm border border-green-200">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span>SERVER ONLINE</span>
                        </div>
                    </div>
                </header>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'Applications' && (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center space-x-6 hover:-translate-y-2 transition-transform duration-300">
                                        <div className="bg-blue-50 p-5 rounded-[1.5rem] text-blue-600">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-black text-xs tracking-widest uppercase mb-1">Total Logs</p>
                                            <h3 className="text-4xl font-black text-primary">{stats.total}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center space-x-6 hover:-translate-y-2 transition-transform duration-300">
                                        <div className="bg-orange-50 p-5 rounded-[1.5rem] text-orange-600">
                                            <Clock size={28} />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-black text-xs tracking-widest uppercase mb-1">In Queue</p>
                                            <h3 className="text-4xl font-black text-primary">{stats.pending}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 flex items-center space-x-6 hover:-translate-y-2 transition-transform duration-300">
                                        <div className="bg-green-50 p-5 rounded-[1.5rem] text-green-600">
                                            <CheckCircle size={28} />
                                        </div>
                                        <div>
                                            <p className="text-gray-400 font-black text-xs tracking-widest uppercase mb-1">Processed</p>
                                            <h3 className="text-4xl font-black text-primary">{stats.completed}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-black text-primary flex items-center space-x-4">
                                        <div className="bg-primary/5 p-3 rounded-2xl"><Users size={24} className="text-primary" /></div>
                                        <span>Live Request Log</span>
                                    </h2>
                                    <button onClick={fetchForms} className="text-sm font-bold text-secondary hover:text-primary transition-colors flex items-center space-x-2">
                                        <Clock size={16} /> <span>Refresh Data</span>
                                    </button>
                                </div>

                                {forms.length === 0 ? (
                                    <div className="bg-white p-16 rounded-[3rem] border border-dashed border-gray-300 flex flex-col items-center justify-center text-center">
                                        <AlertCircle size={48} className="text-gray-300 mb-4" />
                                        <h3 className="text-xl font-black text-gray-400 mb-2">No Applications Found</h3>
                                        <p className="text-gray-400 font-medium">There are currently no standard requests logged in the database.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 overflow-hidden hidden xl:block">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest">Client Identity</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest">Requested Service</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest">Contact Point</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest">Clearance Status</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest text-center">Execute Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {forms.map((form) => (
                                                        <tr key={form._id} className="hover:bg-blue-50/30 transition-colors group">
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="bg-primary/5 w-10 h-10 rounded-[10px] flex items-center justify-center font-black text-primary text-sm group-hover:bg-primary group-hover:text-white transition-colors">{form.fullName.charAt(0)}</div>
                                                                    <div className="font-black text-primary">{form.fullName}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-6 font-bold text-gray-500">{form.serviceType}</td>
                                                            <td className="px-8 py-6 font-bold text-gray-500 font-mono text-sm">{form.phone}</td>
                                                            <td className="px-8 py-6">
                                                                <span className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest border ${
                                                                    form.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 
                                                                    form.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                                                                }`}>
                                                                    {form.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-6">
                                                                <div className="flex items-center justify-center space-x-3 opacity-80 group-hover:opacity-100 transition-opacity">
                                                                    <button onClick={() => updateStatus(form._id, 'Completed')} className="p-3 bg-green-500 text-white rounded-xl shadow-md shadow-green-500/20 hover:-translate-y-1 transition-transform" title="Mark Completed"><CheckCircle size={18} /></button>
                                                                    <button onClick={() => {
                                                                        const text = `Hi ${form.fullName},\nRegarding your request for ${form.serviceType}:\n`;
                                                                        window.open(`https://wa.me/91${form.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                                                                    }} className="p-3 bg-green-400 text-white rounded-xl shadow-md shadow-green-400/20 hover:-translate-y-1 transition-transform" title="Contact on WhatsApp"><MessageCircle size={18} /></button>
                                                                    <button onClick={() => deleteForm(form._id)} className="p-3 bg-red-500 text-white rounded-xl shadow-md shadow-red-500/20 hover:-translate-y-1 transition-transform" title="Delete"><Trash size={18} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="xl:hidden space-y-6 pb-20">
                                            {forms.map((form) => (
                                                <div key={form._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/40 border border-gray-100 relative overflow-hidden group">
                                                    <div className={`absolute top-0 left-0 w-2 h-full ${form.status === 'Completed' ? 'bg-green-400' : 'bg-orange-400'}`}></div>
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-xl font-black text-primary mb-1">{form.fullName}</h3>
                                                            <p className="text-gray-500 font-bold text-sm">{form.serviceType}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border ${
                                                                    form.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                                                                }`}>
                                                                    {form.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 font-mono text-sm mb-6">{form.phone}</p>
                                                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-50">
                                                        <button onClick={() => updateStatus(form._id, 'Completed')} className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl text-green-600 font-bold text-xs hover:bg-green-500 hover:text-white transition-colors"><CheckCircle size={16} /> <span>Done</span></button>
                                                        <button className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-xl text-primary font-bold text-xs hover:bg-primary hover:text-secondary transition-colors"><ExternalLink size={16} /> <span>View</span></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'Jobs' && (
                            <div className="space-y-10">
                                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                                    <h2 className="text-3xl font-black text-primary mb-6">Post Latest Job</h2>
                                    <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="text" placeholder="Job Title" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} />
                                        <input type="text" placeholder="Last Date" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newJob.lastDate} onChange={e => setNewJob({...newJob, lastDate: e.target.value})} />
                                        <input type="text" placeholder="Apply Link" className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newJob.applyLink} onChange={e => setNewJob({...newJob, applyLink: e.target.value})} />
                                        <input type="text" placeholder="Documents Required" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newJob.documentRequired} onChange={e => setNewJob({...newJob, documentRequired: e.target.value})} />
                                        <input type="text" placeholder="Fee Amount" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newJob.fee} onChange={e => setNewJob({...newJob, fee: e.target.value})} />
                                        
                                        <div className="md:col-span-2">
                                            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white hover:text-primary transition-colors font-black text-lg py-4 rounded-2xl shadow-lg shadow-primary/20">
                                                Publish Job
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-primary">Active Job Listings</h2>
                                    {jobs.map(job => (
                                        <div key={job._id} className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-black text-primary">{job.title}</h3>
                                                <p className="text-sm font-bold text-gray-500 mt-1">Last Date: {job.lastDate} <span className="mx-2">•</span> Fee: {job.fee}</p>
                                                <p className="text-xs text-gray-400 mt-1">Docs: {job.documentRequired}</p>
                                            </div>
                                            <div className="flex space-x-3 shrink-0">
                                                <a href={job.applyLink} target="_blank" rel="noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"><ExternalLink size={20} /></a>
                                                <button onClick={() => deleteJob(job._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors"><Trash size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Services' && (
                            <div className="space-y-10">
                                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                                    <h2 className="text-3xl font-black text-primary mb-6">Add New Service / Price</h2>
                                    <form onSubmit={handleCreateService} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="text" placeholder="Service Name" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newService.name} onChange={e => setNewService({...newService, name: e.target.value})} />
                                        <input type="number" placeholder="Price (₹)" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                                        <div className="md:col-span-2">
                                            <input type="text" placeholder="Short Description" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700 w-full" value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <select className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700 w-full" value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})}>
                                                <option value="Government Services">Government Services</option>
                                                <option value="Online & Digital Services">Online & Digital Services</option>
                                                <option value="General Service">General Service</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <button type="submit" className="w-full bg-primary hover:bg-secondary text-white hover:text-primary transition-colors font-black text-lg py-4 rounded-2xl shadow-lg shadow-primary/20">
                                                Add Service Base
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-primary">Managed Services</h2>
                                    {servicesData.map(service => (
                                        <div key={service._id} className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div>
                                                <h3 className="text-xl font-black text-primary">{service.name}</h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {editingServiceId === service._id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-bold text-gray-500">Price: ₹</span>
                                                            <input 
                                                                type="number" 
                                                                className="p-1 w-20 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-secondary font-bold text-gray-700 text-sm" 
                                                                value={editServicePrice} 
                                                                onChange={(e) => setEditServicePrice(e.target.value)} 
                                                            />
                                                            <button 
                                                                onClick={() => saveServicePrice(service)}
                                                                className="ml-2 text-xs bg-green-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-600 transition-colors"
                                                            >
                                                                Save
                                                            </button>
                                                            <button 
                                                                onClick={() => setEditingServiceId(null)}
                                                                className="text-xs bg-gray-300 text-gray-700 font-bold py-1 px-3 rounded-lg hover:bg-gray-400 transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm font-bold text-gray-500">
                                                            Price: ₹{service.price} 
                                                            <span className="ml-2 cursor-pointer text-blue-500 hover:text-blue-700 transition-colors inline-block" onClick={() => startEditingPrice(service)}>
                                                                <Edit2 size={14} className="inline mb-0.5" />
                                                            </span>
                                                        </p>
                                                    )}
                                                    <span className="mx-2 text-gray-500">•</span>
                                                    <p className="text-sm font-bold text-gray-500">Category: {service.category}</p>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-2">{service.description}</p>
                                            </div>
                                            <div className="flex space-x-3 shrink-0 mt-3 md:mt-0">
                                                <button onClick={() => deleteService(service._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-colors" title="Delete Service"><Trash size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Settings' && (
                            <div className="space-y-8">
                                <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-black text-primary mb-2">System Diagnostics</h2>
                                        <p className="text-gray-500 font-medium">Verify system integrity and sync core databases.</p>
                                    </div>
                                    <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-4">
                                        <button onClick={() => alert('Diagnostic complete: All systems operational.')} className="px-8 py-4 bg-primary text-secondary rounded-2xl font-black hover:-translate-y-1 transition-transform shadow-xl shadow-primary/20">
                                            Run Diagnostics
                                        </button>
                                        <button onClick={() => alert('Cache cleared successfully.')} className="px-8 py-4 bg-gray-100 text-gray-700 rounded-2xl font-black hover:-translate-y-1 transition-transform">
                                            Clear Global Cache
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                                        <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                                            <TerminalSquare size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-primary mb-2">Database Backup</h3>
                                        <p className="text-gray-500 font-medium mb-8">Manually trigger a snapshot of the current forms and job data.</p>
                                        <button onClick={() => alert('Initiating secure backup sequence... Done.')} className="bg-orange-500 hover:bg-orange-600 text-white font-black w-full py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-colors">
                                            Execute Backup
                                        </button>
                                    </div>

                                    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-100">
                                        <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                                            <Settings size={32} />
                                        </div>
                                        <h3 className="text-2xl font-black text-primary mb-2">API Configuration</h3>
                                        <p className="text-gray-500 font-medium mb-8">Regenerate routing connections and update endpoints.</p>
                                        <button onClick={() => alert('API keys rotated and routes re-established.')} className="bg-blue-600 hover:bg-blue-700 text-white font-black w-full py-4 rounded-xl shadow-lg shadow-blue-600/30 transition-colors">
                                            Regenerate Keys
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
