import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, LogOut, CheckCircle, Clock, Trash, ExternalLink, Menu, X, TerminalSquare, AlertCircle, Phone, Mail, MapPin, Briefcase, MessageCircle, Edit2, RotateCcw, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [forms, setForms] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [servicesData, setServicesData] = useState([]);
    const [newJob, setNewJob] = useState({ title: '', lastDate: '', applyLink: '', documentRequired: '', fee: '' });
    const [newService, setNewService] = useState({ name: '', description: '', category: 'Government Services', price: 0 });
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    const [activeTab, setActiveTab] = useState('Applications');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [notification, setNotification] = useState(null);
    const [editingServiceId, setEditingServiceId] = useState(null);
    const [viewingDocs, setViewingDocs] = useState(null);
    const [adminUpdate, setAdminUpdate] = useState({ username: '', password: '' });
    const [editServicePrice, setEditServicePrice] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [tempNotes, setTempNotes] = useState('');
    const navigate = useNavigate();

    const showNotify = (msg, type = 'success') => {
        setNotification({ msg, type });
        setTimeout(() => setNotification(null), 3000);
    };

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
            showNotify('Job listing published successfully');
        } catch (err) {
            showNotify('Failed to post job', 'error');
        }
    };

    const handleCreateService = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/services`, newService);
            setNewService({ name: '', description: '', category: 'Government Services', price: 0 });
            fetchServices();
            showNotify('Service added successfully');
        } catch (err) {
            showNotify('Failed to post service', 'error');
        }
    };

    const deleteJob = async (id) => {
        if (!window.confirm('Delete this job?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/jobs/${id}`);
            fetchJobs();
            showNotify('Job deleted');
        } catch (err) {
            showNotify('Delete failed', 'error');
        }
    };

    const deleteService = async (id) => {
        if (!window.confirm('Delete this service?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/services/${id}`);
            fetchServices();
            showNotify('Service removed');
        } catch (err) {
            showNotify('Delete failed', 'error');
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
            showNotify('Price updated successfully');
        } catch (err) {
            showNotify(err.response?.data?.message || 'Update failed', 'error');
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/forms/${id}/status`, { status });
            fetchForms();
            showNotify(`Status set to ${status}`);
        } catch (err) {
            showNotify(err.response?.data?.message || 'Update failed', 'error');
        }
    };

    const deleteForm = async (id) => {
        if (!window.confirm('Erase this record permanently?')) return;
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/forms/${id}`);
            fetchForms();
            showNotify('Record deleted successfully');
        } catch (err) {
            showNotify('Delete failed', 'error');
        }
    };

    const updateFormNotes = async (id, notes) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/forms/${id}/notes`, { notes });
            fetchForms();
            showNotify('Notes updated');
        } catch (err) {
            showNotify(err.response?.data?.message || 'Failed to update notes', 'error');
        }
    };

    const filteredForms = forms.filter(f => {
        const matchesSearch = f.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             (f.customerId && f.customerId.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'All' || f.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const logout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const handlePurgeCompleted = async () => {
        if (!window.confirm('This will permanently delete ALL completed application requests. Continue?')) return;
        try {
            const res = await axios.delete(`${import.meta.env.VITE_API_URL}/forms/purge`);
            showNotify(`Purged ${res.data.count} finished records`);
            fetchForms();
        } catch (err) {
            showNotify('Purge failed', 'error');
        }
    };

    const handleExportCSV = () => {
        if (forms.length === 0) return showNotify('No data to export', 'error');
        
        const headers = ['ID', 'Name', 'Phone', 'Service', 'Status', 'Date'];
        const rows = forms.map(f => [
            f.customerId,
            f.fullName,
            f.phone,
            f.serviceType,
            f.status,
            new Date(f.createdAt).toLocaleDateString()
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `applications_export_${Date.now()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotify('CSV Export Ready');
    };

    const handleUpdateAdmin = async (e) => {
        e.preventDefault();
        try {
            const data = { 
                newUsername: adminUpdate.username, 
                newPassword: adminUpdate.password
            };
            await axios.post(`${import.meta.env.VITE_API_URL}/admin/update-credentials`, data);
            showNotify('Security Credentials Updated');
            setAdminUpdate({ username: '', password: '' });
            logout(); // Force login with new details
        } catch (err) {
            showNotify(err.response?.data?.message || 'Update failed', 'error');
        }
    };

    const tabs = [
        { id: 'Applications', icon: Users, label: 'Applications', color: 'blue' },
        { id: 'Jobs', icon: Briefcase, label: 'Jobs', color: 'orange' },
        { id: 'Services', icon: FileText, label: 'Services', color: 'green' },
        { id: 'Settings', icon: Settings, label: 'Systems', color: 'purple' }
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full overflow-hidden">

            <div className={`flex items-center space-x-3 mb-8 px-1`}>
                <div className="bg-secondary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/30 shrink-0">
                    <LayoutDashboard size={20} className="text-primary" />
                </div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-xl font-black tracking-tight leading-tight">Admin</h2>
                    <p className="text-secondary text-[10px] font-bold tracking-widest uppercase mt-0.5">Console</p>
                </motion.div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button 
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }} 
                            className={`flex items-center space-x-4 w-full p-4 font-bold rounded-2xl transition-all duration-300 outline-none group relative overflow-hidden active:scale-95 ${
                                isActive 
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02] z-10' 
                                : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-50'
                            }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-indigo-600'} shrink-0 transition-colors duration-300`} /> 
                            <motion.span 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                className="text-sm tracking-tight whitespace-nowrap"
                            >
                                {tab.label}
                            </motion.span>
                            {isActive && (
                                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 bg-primary rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
            {/* Status section removed */}

            <div className="mt-auto space-y-4">
                <button 
                    onClick={logout} 
                    className="flex items-center justify-center space-x-2 w-full p-4 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-100 font-black rounded-2xl transition-all group outline-none"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" /> 
                    <span className="uppercase tracking-widest text-[10px]">Logout Console</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-surface h-screen overflow-hidden flex w-full font-sans text-slate-900">
            {/* Desktop Sidebar */}
            <div className="bg-white relative p-6 shrink-0 hidden lg:flex flex-col shadow-xl z-40 border-r border-slate-100 transition-all duration-500 w-72">
                <SidebarContent isMobile={false} />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-sm"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div 
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-white p-8 z-50 lg:hidden shadow-2xl overflow-y-auto"
                        >
                            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-indigo-600 bg-slate-50 p-2 rounded-xl transition-all">
                                <X size={20} />
                            </button>
                            <SidebarContent isMobile={true} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 relative bg-surface">
                {/* Mobile Header Navigation */}
                <div className="lg:hidden flex justify-between items-center mb-10 bg-white p-5 rounded-4xl shadow-sm border border-slate-100">
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

                <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 space-y-4 md:space-y-0 relative">
                    <div className="z-10">
                        <div className="flex items-center space-x-2 mb-3">
                            <span className="w-8 h-1 bg-secondary rounded-full"></span>
                            <span className="text-secondary font-black text-[10px] tracking-[0.2em] uppercase">Control Center</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-primary tracking-tighter leading-none mb-3">
                            System <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-blue-600">Intelligence</span>
                        </h1>
                        <p className="text-gray-400 font-bold text-sm opacity-80 max-w-lg leading-relaxed">Overseeing Operations & Resource Management</p>
                    </div>
                    <div className="flex items-center space-x-4 self-start md:self-auto z-10">
                        <div className="bg-white/80 backdrop-blur-md px-8 py-4 rounded-4xl font-black text-xs flex items-center space-x-4 shadow-2xl shadow-gray-200/50 border border-white/50">
                            <div className="flex -space-x-2">
                                <div className="w-3 h-3 bg-secondary rounded-full border-2 border-white"></div>
                                <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-white"></div>
                                <div className="w-3 h-3 bg-purple-400 rounded-full border-2 border-white"></div>
                            </div>
                            <span className="text-primary font-black tracking-widest uppercase">Nodes Active</span>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute top-40 -left-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                </header>

                {/* Notification Toast */}
                <AnimatePresence>
                    {notification && (
                        <motion.div 
                            initial={{ opacity: 0, y: -50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-100 px-8 py-4 rounded-3xl shadow-2xl font-black text-xs tracking-widest flex items-center space-x-4 border backdrop-blur-xl ${
                                notification.type === 'error' 
                                ? 'bg-rose-600 text-white border-rose-500 shadow-rose-200' 
                                : 'bg-slate-900 text-white border-slate-700 shadow-slate-200'
                            }`}
                        >
                            {notification.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
                            <span>{notification.msg.toUpperCase()}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

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
                                    <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center space-x-6 hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-indigo-50 p-5 rounded-3xl text-indigo-600">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">Total Logs</p>
                                            <h3 className="text-4xl font-black text-slate-900">{stats.total}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center space-x-6 hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-amber-50 p-5 rounded-3xl text-amber-600">
                                            <Clock size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">In Queue</p>
                                            <h3 className="text-4xl font-black text-slate-900">{stats.pending}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center space-x-6 hover:-translate-y-1 transition-all duration-300">
                                        <div className="bg-emerald-50 p-5 rounded-3xl text-emerald-600">
                                            <CheckCircle size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">Processed</p>
                                            <h3 className="text-4xl font-black text-slate-900">{stats.completed}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                    <h2 className="text-2xl font-black text-primary flex items-center space-x-4">
                                        <div className="bg-primary/5 p-3 rounded-2xl"><Users size={24} className="text-primary" /></div>
                                        <span>Live Request Log</span>
                                    </h2>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <input 
                                                type="text" 
                                                placeholder="Search name or ID..." 
                                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-secondary text-sm font-bold w-64 shadow-sm"
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                        </div>
                                        <select 
                                            className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-secondary shadow-sm"
                                            value={statusFilter}
                                            onChange={e => setStatusFilter(e.target.value)}
                                        >
                                            <option value="All">All Status</option>
                                            <option value="Pending">Pending</option>
                                            <option value="Processing">Processing</option>
                                            <option value="Verification">Verification</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                {forms.length === 0 ? (
                                    <div className="bg-white p-20 rounded-4xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-center shadow-sm">
                                        <AlertCircle size={60} className="text-slate-100 mb-6 drop-shadow-sm" />
                                        <h3 className="text-2xl font-black text-slate-300 mb-2">No Records Found</h3>
                                        <p className="text-slate-400 font-bold max-w-xs text-xs uppercase tracking-widest">Protocol initialized but no active transmission data available in the cloud matrix.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-white rounded-4xl shadow-2xl shadow-gray-200/50 border border-gray-100 hidden xl:block">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-gray-50/80 border-b border-gray-100">
                                                    <tr>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest">ID & Info</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest">Service Node</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest text-center">Protocol & Assets</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest">Clearance</th>
                                                        <th className="px-8 py-6 font-black text-primary uppercase text-xs tracking-widest text-right">Operations</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {filteredForms.map((form) => (
                                                        <tr key={form._id} className="hover:bg-blue-50/50 transition-all group border-b border-gray-100 last:border-0">
                                                            <td className="px-8 py-7">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="relative">
                                                                        <div className="bg-primary/5 w-12 h-12 rounded-xl flex items-center justify-center font-black text-primary text-base group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                                                                            {form.fullName.charAt(0)}
                                                                        </div>
                                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-black text-primary text-lg leading-tight tracking-tight">{form.fullName}</div>
                                                                        <div className="text-[10px] font-black text-secondary tracking-widest uppercase mt-1">{form.customerId || 'ID-RESERVING...'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-7">
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-gray-700 text-sm">{form.serviceType}</span>
                                                                    <span className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Priority Sync</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-7">
                                                                <div className="flex flex-col items-center space-y-3">
                                                                    <div className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors cursor-pointer group/tel" onClick={() => window.open(`tel:${form.phone}`)}>
                                                                        <Phone size={14} className="group-hover/tel:scale-110 transition-transform" />
                                                                        <span className="font-mono text-xs font-bold">{form.phone}</span>
                                                                    </div>
                                                                    
                                                                    <button 
                                                                        onClick={() => { setViewingDocs(form); setTempNotes(form.notes || ''); }}
                                                                        className="flex items-center space-x-2 p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg transition-all border border-indigo-100 font-black text-[9px] uppercase tracking-wider active:scale-95 shadow-sm hover:shadow-indigo-100"
                                                                    >
                                                                        <FileText size={14} />
                                                                        <span>FETCH ASSETS ({form.documents?.length || 0})</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-7">
                                                                <span className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm ${
                                                                    form.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 
                                                                    form.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                                    form.status === 'Processing' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 
                                                                    form.status === 'Verification' ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                                                                    'bg-red-50 text-red-600 border-red-200'
                                                                }`}>
                                                                    {form.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-7 text-right">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <div className="relative group/status">
                                                                        <button className="p-2.5 bg-slate-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-xl transition-all" title="Update Status"><Edit2 size={16} /></button>
                                                                        <div className="absolute right-0 bottom-full mb-3 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl border border-slate-200 p-2 hidden group-hover/status:block z-[9999] min-w-[160px]">
                                                                            {['Pending', 'Processing', 'Verification', 'Completed', 'Rejected'].map(s => (
                                                                                <button key={s} onClick={() => updateStatus(form._id, s)} className="block w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 rounded-lg text-slate-600 hover:text-indigo-600 transition-colors mb-1 last:mb-0 border border-transparent hover:border-indigo-100">{s}</button>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <button onClick={() => {
                                                                        const text = `Hi ${form.fullName}, [ID: ${form.customerId}]\nStatus: ${form.status}\nRegarding your request for ${form.serviceType}:\n`;
                                                                        window.open(`https://wa.me/91${form.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
                                                                    }} className="p-2.5 bg-slate-50 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-xl transition-all" title="WhatsApp Sync"><MessageCircle size={16} /></button>
                                                                    <button onClick={() => deleteForm(form._id)} className="p-2.5 bg-slate-50 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all" title="Erase Record"><Trash size={16} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="xl:hidden space-y-6 pb-20">
                                            {forms.map((form) => (
                                                <div key={form._id} className="bg-white p-8 rounded-4xl shadow-xl shadow-slate-200/40 border border-slate-100 relative overflow-hidden group">
                                                    <div className={`absolute top-0 left-0 w-2 h-full ${
                                                        form.status === 'Completed' ? 'bg-emerald-400' : 
                                                        form.status === 'Pending' ? 'bg-amber-400' : 
                                                        form.status === 'Processing' ? 'bg-indigo-400' : 
                                                        form.status === 'Verification' ? 'bg-purple-400' : 'bg-rose-400'
                                                    }`}></div>
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-xl font-black text-primary mb-1 tracking-tight">{form.fullName}</h3>
                                                            <p className="text-secondary font-black text-[10px] uppercase tracking-widest leading-none mb-3">{form.customerId || 'PENDING...'}</p>
                                                            <p className="text-gray-500 font-bold text-sm">{form.serviceType}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border ${
                                                                    form.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' : 
                                                                    form.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                                                                    form.status === 'Processing' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 
                                                                    form.status === 'Verification' ? 'bg-purple-50 text-purple-600 border-purple-200' : 
                                                                    'bg-red-50 text-red-600 border-red-200'
                                                                }`}>
                                                                    {form.status}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="flex items-center justify-between mb-6">
                                                        <p className="text-gray-400 font-mono text-sm">{form.phone}</p>
                                                        <button 
                                                            onClick={() => setViewingDocs(form)}
                                                            className="flex items-center space-x-2 p-3 bg-secondary/10 text-primary rounded-xl font-bold text-[10px] border border-secondary/10"
                                                        >
                                                            <FileText size={14} />
                                                            <span>PROTOCOLS ({form.documents?.length || 0})</span>
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-50">
                                                        <button onClick={() => updateStatus(form._id, 'Completed')} className="flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-xl text-green-600 font-bold text-xs hover:bg-green-500 hover:text-white transition-colors"><CheckCircle size={16} /> <span>Done</span></button>
                                                        <button onClick={() => deleteForm(form._id)} className="flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-xl text-red-400 font-bold text-xs hover:bg-red-500 hover:text-white transition-colors"><Trash size={16} /> <span>Remove</span></button>
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
                                        <input type="text" placeholder="Fee Amount" required className="p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700" value={newJob.fee} onChange={e => setNewJob({...newJob, fee: e.target.value})} />
                                        
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Essential Documents Required</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-slate-50 p-5 rounded-3xl border border-slate-100">
                                                {['Aadhar Card', 'Passport Photo', 'Signature', '10th Marksheet', '12th Marksheet', 'Graduation', 'Caste Cert', 'Income Cert', 'Domicile', 'PAN Card', 'Bank Passbook'].map(doc => (
                                                    <label key={doc} className="flex items-center space-x-2 cursor-pointer group">
                                                        <input 
                                                            type="checkbox" 
                                                            className="w-4 h-4 rounded border-slate-200 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                            checked={newJob.documentRequired.includes(doc)}
                                                            onChange={(e) => {
                                                                const currentDocs = newJob.documentRequired ? newJob.documentRequired.split(', ').filter(Boolean) : [];
                                                                let updatedDocs;
                                                                if (e.target.checked) {
                                                                    updatedDocs = [...currentDocs, doc];
                                                                } else {
                                                                    updatedDocs = currentDocs.filter(d => d !== doc);
                                                                }
                                                                setNewJob({ ...newJob, documentRequired: updatedDocs.join(', ') });
                                                            }}
                                                        />
                                                        <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors">{doc}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <input 
                                                type="text" 
                                                placeholder="Other documents (comma separated)" 
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-secondary font-bold text-gray-700 text-sm" 
                                                value={newJob.documentRequired} 
                                                onChange={e => setNewJob({...newJob, documentRequired: e.target.value})} 
                                            />
                                        </div>
                                        
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
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Data Management Card */}
                                    <div className="bg-white p-8 rounded-4xl shadow-xl border border-gray-100 group hover:border-secondary/30 transition-all">
                                        <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-primary mb-2 tracking-tight">Data Transmission</h3>
                                        <p className="text-gray-400 font-bold text-xs mb-8 leading-relaxed">Export all application logs to spreadsheet format (CSV) for local backup or accounting.</p>
                                        <button 
                                            onClick={handleExportCSV}
                                            className="bg-primary text-white font-black w-full py-4 rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary hover:text-primary transition-all flex items-center justify-center space-x-3"
                                        >
                                            <ExternalLink size={18} />
                                            <span>GENERATE EXPORT (.CSV)</span>
                                        </button>
                                    </div>

                                    {/* Admin Security Controls */}
                                    <div className="bg-white p-8 rounded-4xl shadow-xl border border-gray-100 group">
                                        <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-all">
                                            <Settings size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-primary mb-2 tracking-tight">Admin Gatekeeper</h3>
                                        <p className="text-gray-400 font-bold text-[10px] mb-6 leading-relaxed uppercase">Update root credentials and security protocols.</p>
                                        
                                        <form onSubmit={handleUpdateAdmin} className="space-y-4">
                                            <input 
                                                type="text" placeholder="New Full Username" 
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                                                value={adminUpdate.username}
                                                onChange={e => setAdminUpdate({...adminUpdate, username: e.target.value})}
                                            />
                                            <input 
                                                type="password" placeholder="New Secure Password" 
                                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-sm"
                                                value={adminUpdate.password}
                                                onChange={e => setAdminUpdate({...adminUpdate, password: e.target.value})}
                                            />
                                            
                                            <button 
                                                type="submit"
                                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs transition-all tracking-[0.2em] shadow-xl shadow-indigo-100 hover:bg-slate-900 active:scale-95 uppercase"
                                            >
                                                UPDATE ACCESS KEYS
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                {/* System Architecture Info */}
                                <div className="bg-[#0B1121] p-10 rounded-4xl shadow-2xl relative overflow-hidden">
                                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                                        <div className="text-center md:text-left">
                                            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                                                <TerminalSquare size={16} className="text-secondary" />
                                                <span className="text-secondary font-black text-[10px] tracking-widest uppercase">Kernel Version 2.0.4</span>
                                            </div>
                                            <h2 className="text-2xl font-black text-white mb-2">Network Infrastructure</h2>
                                            <div className="space-y-2 mt-4">
                                                <div className="flex items-center space-x-3 text-gray-400 text-xs font-mono">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    <span>API End-Point: {import.meta.env.VITE_API_URL}</span>
                                                </div>
                                                <div className="flex items-center space-x-3 text-gray-400 text-xs font-mono">
                                                    <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
                                                    <span>Database Node: Cluster0 (MongoDB Atlas)</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className="bg-white/10 p-6 rounded-3xl border border-white/5 backdrop-blur-md">
                                                <AlertCircle className="text-orange-400 mb-4 mx-auto" size={32} />
                                                <p className="text-white font-black text-xs text-center uppercase tracking-widest">Global Maintenance</p>
                                                <button onClick={() => showNotify('Maintenance sequence scheduled for 0200 HRS')} className="mt-4 px-6 py-2 bg-secondary text-primary font-black text-[10px] rounded-lg hover:scale-105 transition-transform uppercase">Schedule Service</button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Tech Decors */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Document Viewing Modal */}
                <AnimatePresence>
                    {viewingDocs && (
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-900/60 z-[99999] flex items-center justify-center p-6 backdrop-blur-sm"
                        >
                            <motion.div 
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="bg-white w-full max-w-2xl rounded-4xl p-8 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-secondary to-blue-600"></div>
                                <button 
                                    onClick={() => setViewingDocs(null)}
                                    className="absolute top-8 right-8 p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                >
                                    <X size={20} />
                                </button>
                                
                                <div className="mb-10">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="w-8 h-1 bg-secondary rounded-full"></span>
                                        <span className="text-secondary font-black text-[10px] tracking-widest uppercase">Protocol Assets</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-primary tracking-tight">Encryption Keys & Files</h2>
                                    <p className="text-gray-400 font-bold text-xs mt-2">Assets for: {viewingDocs.fullName} ({viewingDocs.customerId})</p>
                                </div>

                                <div className="mb-8">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-3 block">Internal Directives / Notes</label>
                                    <div className="flex gap-2">
                                        <textarea 
                                            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all resize-none h-20"
                                            placeholder="Add operational notes here..."
                                            value={tempNotes}
                                            onChange={e => setTempNotes(e.target.value)}
                                        />
                                        <button 
                                            onClick={() => updateFormNotes(viewingDocs._id, tempNotes)}
                                            className="bg-indigo-600 text-white p-4 rounded-2xl hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100 self-end"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {viewingDocs.documents?.length > 0 ? viewingDocs.documents.map((doc, idx) => {
                                        const ext = doc.split('.').pop().toUpperCase();
                                        return (
                                            <a 
                                                key={idx} 
                                                href={`${import.meta.env.VITE_API_URL.replace('/api', '')}/${doc.replace(/\\/g, '/')}`} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl hover:bg-secondary/10 border border-gray-100 hover:border-secondary/30 transition-all group"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm text-primary font-black text-xs">
                                                        {ext}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-black text-primary truncate max-w-[120px]">Document_{idx + 1}</p>
                                                        <p className="text-[10px] text-gray-400 font-bold uppercase">Stored Node</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={16} className="text-gray-300 group-hover:text-primary transition-colors" />
                                            </a>
                                        );
                                    }) : (
                                        <div className="col-span-2 text-center py-20 bg-gray-50 rounded-3xl">
                                            <AlertCircle size={40} className="mx-auto text-gray-300 mb-4" />
                                            <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No Documents Linked</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-8 flex justify-end">
                                    <button 
                                        onClick={() => setViewingDocs(null)}
                                        className="px-8 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-lg shadow-primary/20 hover:bg-secondary hover:text-primary transition-all"
                                    >
                                        CLOSE CONSOLE
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
