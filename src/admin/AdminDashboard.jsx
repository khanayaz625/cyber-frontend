import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, FileText, Settings, LogOut, CheckCircle, Clock, Trash, ExternalLink, Menu, X, TerminalSquare, AlertCircle, Phone, Mail, MapPin, Briefcase, MessageCircle, Edit2, RotateCcw, Search, Printer, Download, Send, ShieldCheck, Share2, Globe } from 'lucide-react';

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
    const [viewingReceipt, setViewingReceipt] = useState(null);
    const [paymentInfo, setPaymentInfo] = useState({ paid: 0, total: 0, method: 'Pending' });
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
            showNotify('Notes update failed', 'error');
        }
    };

    const updatePayment = async (id) => {
        try {
            await axios.patch(`${import.meta.env.VITE_API_URL}/forms/${id}/payment`, {
                paidAmount: paymentInfo.paid,
                totalAmount: paymentInfo.total,
                paymentMethod: paymentInfo.method
            });
            fetchForms();
            showNotify('Payment ledger updated');
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Payment update failed';
            showNotify(errorMsg, 'error');
        }
    };

    const handleShareWhatsApp = (form) => {
        const text = `*OFFICIAL SERVICE RECEIPT*\n\n*Candidate:* ${form.fullName}\n*Service:* ${form.serviceType}\n*Total Fee:* ₹${form.totalAmount || 0}\n*Paid:* ₹${form.paidAmount || 0} (${form.paymentMethod || 'Pending'})\n*Balance:* ₹${(form.totalAmount || 0) - (form.paidAmount || 0)}\n*Status:* ${form.status}\n\n_Track here:_ ${window.location.origin}/track?id=${form.customerId}\n\n_Thank you for choosing Javed Computers._`;
        window.open(`https://wa.me/91${form.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
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
        { id: 'Finance', icon: ShieldCheck, label: 'Financial Ledger', color: 'emerald' },
        { id: 'Jobs', icon: Briefcase, label: 'Job Listings', color: 'orange' },
        { id: 'Services', icon: FileText, label: 'Available Services', color: 'green' },
        { id: 'Settings', icon: Settings, label: 'System Settings', color: 'purple' }
    ];

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full overflow-hidden">

            <div className={`flex items-center space-x-3 mb-8 px-1`}>
                <div className="bg-secondary w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-secondary/30 shrink-0">
                    <LayoutDashboard size={20} className="text-white" />
                </div>
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <h2 className="text-xl font-black tracking-tight leading-tight text-white">Admin</h2>
                    <p className="text-secondary text-[10px] font-bold tracking-widest uppercase mt-0.5">Control Panel</p>
                </motion.div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            style={{ cursor: 'pointer' }}
                            onClick={() => { setActiveTab(tab.id); setIsSidebarOpen(false); }}
                            className={`flex items-center space-x-4 w-full p-4 font-bold rounded-2xl transition-all duration-300 outline-none group relative overflow-hidden active:scale-95 cursor-pointer ${isActive
                                ? 'bg-secondary text-white shadow-xl shadow-secondary/20 scale-[1.02] z-10'
                                : 'text-slate-500 hover:text-secondary hover:bg-white/5'
                                }`}
                        >
                            <Icon size={20} className={`${isActive ? 'text-white' : 'group-hover:text-secondary'} shrink-0 transition-colors duration-300`} />
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-sm tracking-tight whitespace-nowrap"
                            >
                                {tab.label}
                            </motion.span>
                            {isActive && (
                                <motion.div layoutId="activeTab" className="absolute left-0 w-1 h-6 bg-accent rounded-full" />
                            )}
                        </button>
                    );
                })}
            </div>
            {/* Status section removed */}

            <div className="mt-auto space-y-4">
                <button
                    onClick={logout}
                    className="flex items-center justify-center space-x-2 w-full p-4 text-slate-400 hover:text-white bg-white/5 hover:bg-rose-500/20 border border-white/5 font-black rounded-2xl transition-all group outline-none cursor-pointer"
                >
                    <LogOut size={18} className="group-hover:-translate-x-1 transition-transform shrink-0" />
                    <span className="uppercase tracking-widest text-[10px]">Logout Console</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="bg-[#0B1120] h-screen overflow-hidden flex w-full font-sans text-slate-100">
            {/* Desktop Sidebar */}
            <div className="bg-primary relative p-6 shrink-0 hidden lg:flex flex-col shadow-xl z-40 border-r border-white/5 transition-all duration-500 w-72">
                <SidebarContent isMobile={false} />
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md"
                            onClick={() => setIsSidebarOpen(false)}
                        />
                        <motion.div
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-80 bg-primary p-8 z-50 lg:hidden shadow-2xl overflow-y-auto border-r border-white/5"
                        >
                            <button onClick={() => setIsSidebarOpen(false)} className="absolute top-8 right-8 text-slate-400 hover:text-secondary bg-white/5 p-2 rounded-xl transition-all cursor-pointer">
                                <X size={20} />
                            </button>
                            <SidebarContent isMobile={true} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 md:p-12 lg:p-16 relative bg-[#0B1120] print:p-0 print:overflow-visible print:bg-white">
                <div className="print:hidden">
                {/* Mobile Header Navigation */}
                <div className="lg:hidden flex justify-between items-center mb-10 bg-primary/40 p-5 rounded-4xl shadow-sm border border-white/5 backdrop-blur-md">
                    <div className="flex items-center space-x-4">
                        <div className="bg-secondary/20 w-12 h-12 rounded-2xl flex items-center justify-center">
                            <LayoutDashboard className="text-secondary w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight text-white">Dashboard</h2>
                    </div>
                    <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white/5 text-white rounded-2xl hover:bg-white/10 transition-colors cursor-pointer">
                        <Menu size={24} />
                    </button>
                </div>

                <header className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 space-y-4 md:space-y-0 relative">
                    <div className="z-10">
                        <div className="flex items-center space-x-2 mb-3">
                            <span className="w-8 h-1 bg-secondary rounded-full"></span>
                            <span className="text-secondary font-black text-[10px] tracking-[0.2em] uppercase">Control Panel Overview</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none mb-3">
                            Administration <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-blue-400">Portal</span>
                        </h1>
                        <p className="text-slate-400 font-bold text-sm opacity-80 max-w-lg leading-relaxed">View all service requests and manage your digital cafe listings.</p>
                    </div>
                    <div className="flex items-center space-x-4 self-start md:self-auto z-10">
                        <div className="bg-primary/60 backdrop-blur-xl px-8 py-4 rounded-4xl font-black text-xs flex items-center space-x-4 shadow-2xl border border-white/10">
                            <div className="flex -space-x-2">
                                <div className="w-3 h-3 bg-secondary rounded-full border-2 border-primary"></div>
                                <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-primary"></div>
                                <div className="w-3 h-3 bg-purple-400 rounded-full border-2 border-primary"></div>
                            </div>
                            <span className="text-white font-black tracking-widest uppercase">System Status</span>
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
                            className={`fixed top-10 left-1/2 transform -translate-x-1/2 z-100 px-8 py-4 rounded-3xl shadow-2xl font-black text-xs tracking-widest flex items-center space-x-4 border backdrop-blur-xl ${notification.type === 'error'
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
                                    <div className="bg-primary/40 p-8 rounded-4xl shadow-2xl border border-white/5 flex items-center space-x-6 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md">
                                        <div className="bg-secondary/10 p-5 rounded-3xl text-secondary">
                                            <FileText size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">Total Applications</p>
                                            <h3 className="text-4xl font-black text-white">{stats.total}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-primary/40 p-8 rounded-4xl shadow-2xl border border-white/5 flex items-center space-x-6 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md">
                                        <div className="bg-amber-400/10 p-5 rounded-3xl text-amber-400">
                                            <Clock size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">Pending Requests</p>
                                            <h3 className="text-4xl font-black text-white">{stats.pending}</h3>
                                        </div>
                                    </div>
                                    <div className="bg-primary/40 p-8 rounded-4xl shadow-2xl border border-white/5 flex items-center space-x-6 hover:-translate-y-1 transition-all duration-300 backdrop-blur-md">
                                        <div className="bg-emerald-400/10 p-5 rounded-3xl text-emerald-400">
                                            <CheckCircle size={28} />
                                        </div>
                                        <div>
                                            <p className="text-slate-400 font-black text-[10px] tracking-widest uppercase mb-1">Completed Entries</p>
                                            <h3 className="text-4xl font-black text-white">{stats.completed}</h3>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                                    <h2 className="text-2xl font-black text-white flex items-center space-x-4">
                                        <div className="bg-white/5 p-3 rounded-2xl"><Users size={24} className="text-secondary" /></div>
                                        <span>Live Request Log</span>
                                    </h2>
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Search name or ID..."
                                                className="pl-10 pr-4 py-2 bg-primary/40 border border-white/10 rounded-xl outline-none focus:border-secondary text-sm font-bold w-64 shadow-sm text-white cursor-text"
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                            />
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                        </div>
                                        <select
                                            className="bg-primary/40 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:border-secondary shadow-sm text-white appearance-none cursor-pointer"
                                            value={statusFilter}
                                            onChange={e => setStatusFilter(e.target.value)}
                                        >
                                            <option value="All" className="bg-primary text-white">All Status</option>
                                            <option value="Pending" className="bg-primary text-white">Pending</option>
                                            <option value="Processing" className="bg-primary text-white">Processing</option>
                                            <option value="Verification" className="bg-primary text-white">Verification</option>
                                            <option value="Completed" className="bg-primary text-white">Completed</option>
                                        </select>
                                    </div>
                                </div>

                                {forms.length === 0 ? (
                                    <div className="bg-primary/40 p-20 rounded-4xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center shadow-sm backdrop-blur-md">
                                        <AlertCircle size={60} className="text-white/5 mb-6 drop-shadow-sm" />
                                        <h3 className="text-2xl font-black text-slate-600 mb-2">No Records Found</h3>
                                        <p className="text-slate-500 font-bold max-w-xs text-xs uppercase tracking-widest">No service requests were found in your record registry.</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-primary/40 rounded-4xl shadow-2xl border border-white/5 hidden xl:block backdrop-blur-md">
                                            <table className="w-full text-left border-collapse">
                                                <thead className="bg-white/5 border-b border-white/5">
                                                    <tr>
                                                        <th className="px-8 py-6 font-black text-white uppercase text-xs tracking-widest">Application ID & Name</th>
                                                        <th className="px-8 py-6 font-black text-white uppercase text-xs tracking-widest">Requested Service</th>
                                                        <th className="px-8 py-6 font-black text-white uppercase text-xs tracking-widest text-center">Contact & Documents</th>
                                                        <th className="px-8 py-6 font-black text-white uppercase text-xs tracking-widest">Processing Status</th>
                                                        <th className="px-8 py-6 font-black text-white uppercase text-xs tracking-widest text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {filteredForms.map((form) => (
                                                        <tr key={form._id} className="hover:bg-white/5 transition-all group border-b border-white/5 last:border-0">
                                                            <td className="px-8 py-7">
                                                                <div className="flex items-center space-x-4">
                                                                    <div className="relative">
                                                                        <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center font-black text-secondary text-base group-hover:bg-secondary group-hover:text-primary transition-all duration-300">
                                                                            {form.fullName.charAt(0)}
                                                                        </div>
                                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-primary rounded-full"></div>
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-black text-white text-lg leading-tight tracking-tight">{form.fullName}</div>
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
                                                                    <div className="flex items-center space-x-2 text-slate-500 hover:text-white transition-colors cursor-pointer group/tel" onClick={() => window.open(`tel:${form.phone}`)}>
                                                                        <Phone size={14} className="group-hover/tel:scale-110 transition-transform" />
                                                                        <span className="font-mono text-xs font-bold">{form.phone}</span>
                                                                    </div>

                                                                    <button
                                                                        onClick={() => { setViewingDocs(form); setPaymentInfo({ paid: form.paidAmount || 0, total: form.totalAmount || 0, method: form.paymentMethod || 'Pending' }); setTempNotes(form.notes || ''); }}
                                                                        className="flex items-center space-x-2 p-2 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-lg transition-all border border-secondary/20 font-black text-[9px] uppercase tracking-wider active:scale-95 shadow-sm cursor-pointer"
                                                                    >
                                                                        <FileText size={14} />
                                                                        <span>VIEW DOCUMENTS ({form.documents?.length || 0})</span>
                                                                    </button>
                                                                </div>
                                                            </td>
                                                            <td className="px-8 py-7">
                                                                <span className={`px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-widest border shadow-sm ${form.status === 'Completed' ? 'bg-green-50 text-green-600 border-green-200' :
                                                                    form.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                                                                        form.status === 'Processing' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                                                            form.status === 'Verification' ? 'bg-purple-50 text-purple-600 border-purple-200' :
                                                                                'bg-red-50 text-red-600 border-red-200'
                                                                    }`}>
                                                                    {form.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-8 py-7 text-right">
                                                                <div className="flex items-center justify-end space-x-2">
                                                                    <div className="relative group/status pt-10 -mt-10"> {/* Large hit area for hover */}
                                                                        <div className="relative">
                                                                            <button className="p-2.5 bg-white/5 text-secondary hover:bg-secondary hover:text-primary rounded-xl transition-all cursor-pointer" title="Update Status"><Edit2 size={16} /></button>
                                                                            <div className="absolute right-0 bottom-full mb-0 pb-3 hidden group-hover/status:block z-50 min-w-[160px]">
                                                                                <div className="bg-primary border border-white/10 shadow-2xl rounded-2xl p-2 relative overflow-hidden">
                                                                                    <div className="absolute inset-0 bg-secondary/5 pointer-events-none"></div>
                                                                                    {['Pending', 'Processing', 'Verification', 'Completed', 'Rejected'].map(s => (
                                                                                        <button key={s} onClick={() => updateStatus(form._id, s)} className="block w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-secondary hover:text-primary rounded-lg text-slate-400 transition-all mb-1 last:mb-0 relative z-10 cursor-pointer">{s}</button>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <button onClick={() => setViewingReceipt(form)} className="p-2.5 bg-white/5 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all cursor-pointer" title="Generate Receipt"><Printer size={16} /></button>
                                                                    <button onClick={() => handleShareWhatsApp(form)} className="p-2.5 bg-white/5 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all cursor-pointer" title="WhatsApp Receipt"><MessageCircle size={16} /></button>
                                                                    <button onClick={() => deleteForm(form._id)} className="p-2.5 bg-white/5 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl transition-all cursor-pointer" title="Erase Record"><Trash size={16} /></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div className="xl:hidden space-y-6 pb-20">
                                            {forms.map((form) => (
                                                <div key={form._id} className="bg-primary/40 p-8 rounded-4xl shadow-xl border border-white/5 relative overflow-hidden group backdrop-blur-md">
                                                    <div className={`absolute top-0 left-0 w-2 h-full ${form.status === 'Completed' ? 'bg-emerald-400' :
                                                        form.status === 'Pending' ? 'bg-amber-400' :
                                                            form.status === 'Processing' ? 'bg-secondary' :
                                                                form.status === 'Verification' ? 'bg-purple-400' : 'bg-rose-400'
                                                        }`}></div>
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div>
                                                            <h3 className="text-xl font-black text-white mb-1 tracking-tight">{form.fullName}</h3>
                                                            <p className="text-secondary font-black text-[10px] uppercase tracking-widest leading-none mb-3">{form.customerId || 'PENDING...'}</p>
                                                            <p className="text-slate-400 font-bold text-sm">{form.serviceType}</p>
                                                        </div>
                                                        <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border ${form.status === 'Completed' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                                                            form.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                                form.status === 'Processing' ? 'bg-secondary/10 text-secondary border-secondary/20' :
                                                                    form.status === 'Verification' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                                                        'bg-red-500/10 text-red-400 border-red-500/20'
                                                            }`}>
                                                            {form.status}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center justify-between mb-6">
                                                        <p className="text-slate-500 font-mono text-sm">{form.phone}</p>
                                                        <button
                                                            onClick={() => { setViewingDocs(form); setPaymentInfo({ paid: form.paidAmount || 0, total: form.totalAmount || 0, method: form.paymentMethod || 'Pending' }); setTempNotes(form.notes || ''); }}
                                                            className="flex items-center space-x-2 p-3 bg-secondary/10 text-secondary rounded-xl font-bold text-[10px] border border-secondary/10 cursor-pointer"
                                                        >
                                                            <FileText size={14} />
                                                            <span>DOCUMENTS ({form.documents?.length || 0})</span>
                                                        </button>
                                                    </div>

                                                    <div className="flex flex-wrap items-center justify-end gap-3 pt-6 border-t border-white/5">
                                                        <button onClick={() => setViewingReceipt(form)} className="flex items-center space-x-2 bg-blue-500/10 px-4 py-2 rounded-xl text-blue-400 font-bold text-xs hover:bg-blue-500 hover:text-white transition-all cursor-pointer"><Printer size={16} /> <span>Receipt</span></button>
                                                        <button onClick={() => handleShareWhatsApp(form)} className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-2 rounded-xl text-emerald-400 font-bold text-xs hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"><MessageCircle size={16} /> <span>Share</span></button>
                                                        <button onClick={() => updateStatus(form._id, 'Completed')} className="flex items-center space-x-2 bg-green-500/10 px-4 py-2 rounded-xl text-green-400 font-bold text-xs hover:bg-green-500 hover:text-white transition-all cursor-pointer"><CheckCircle size={16} /> <span>Done</span></button>
                                                        <button onClick={() => deleteForm(form._id)} className="flex items-center space-x-2 bg-red-500/10 px-4 py-2 rounded-xl text-red-400 font-bold text-xs hover:bg-red-500 hover:text-white transition-all cursor-pointer"><Trash size={16} /> <span>Remove</span></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {activeTab === 'Finance' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-4">
                                    <div className="space-y-1">
                                        <h2 className="text-4xl font-black text-white tracking-tight">Financial <span className="text-emerald-400">Ledger</span></h2>
                                        <p className="text-slate-500 font-bold text-sm tracking-wide">Manage service fees, advance payments and collection modes.</p>
                                    </div>
                                    <div className="flex items-center space-x-4 bg-emerald-500/10 px-6 py-4 rounded-3xl border border-emerald-500/20">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black uppercase text-emerald-400 tracking-widest leading-none">Total Collection Expected</span>
                                            <span className="text-2xl font-black text-white">₹{forms.reduce((acc, f) => acc + (f.totalAmount || 0), 0).toLocaleString()}</span>
                                        </div>
                                        <div className="w-px h-8 bg-emerald-500/20"></div>
                                        <div className="flex flex-col items-end text-emerald-400">
                                            <span className="text-[10px] font-black uppercase tracking-widest leading-none">Collected (Cash/Online)</span>
                                            <span className="text-2xl font-black">₹{forms.reduce((acc, f) => acc + (f.paidAmount || 0), 0).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/40 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-md overflow-hidden">
                                    <div className="overflow-x-auto custom-scrollbar">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="border-b border-white/5">
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Candidate</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Service Fee (₹)</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Amt. Paid (₹)</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Balance (₹)</th>
                                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">Mode</th>
                                                    <th className="px-8 py-6 text-center text-[10px] font-black uppercase tracking-widest text-slate-500">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-white/5">
                                                {forms.filter(f => f.fullName.toLowerCase().includes(searchTerm.toLowerCase())).map(form => (
                                                    <tr key={form._id} className="hover:bg-white/[0.02] transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <div>
                                                                <p className="font-black text-white text-sm">{form.fullName}</p>
                                                                <p className="text-[10px] font-bold text-slate-500 italic uppercase tracking-tighter">{form.serviceType}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <input
                                                                type="number"
                                                                className="bg-white/5 border border-white/10 rounded-xl p-2.5 w-24 text-sm font-black text-white outline-none focus:border-emerald-500 transition-all"
                                                                defaultValue={form.totalAmount || 0}
                                                                onBlur={async (e) => {
                                                                    const val = parseInt(e.target.value) || 0;
                                                                    if (val !== form.totalAmount) {
                                                                        try {
                                                                            await axios.patch(`${import.meta.env.VITE_API_URL}/forms/${form._id}/payment`, {
                                                                                totalAmount: val,
                                                                                paidAmount: form.paidAmount,
                                                                                paymentMethod: form.paymentMethod
                                                                            });
                                                                            fetchForms();
                                                                            showNotify('Fee updated');
                                                                                } catch (err) { 
                                                                                 const errorMsg = err.response?.data?.message || 'Update failed';
                                                                                 showNotify(errorMsg, 'error'); 
                                                                             }
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <input
                                                                type="number"
                                                                className="bg-white/5 border border-white/10 rounded-xl p-2.5 w-24 text-sm font-black text-emerald-400 outline-none focus:border-emerald-500 transition-all"
                                                                defaultValue={form.paidAmount || 0}
                                                                onBlur={async (e) => {
                                                                    const val = parseInt(e.target.value) || 0;
                                                                    if (val !== form.paidAmount) {
                                                                        try {
                                                                            await axios.patch(`${import.meta.env.VITE_API_URL}/forms/${form._id}/payment`, {
                                                                                paidAmount: val,
                                                                                totalAmount: form.totalAmount,
                                                                                paymentMethod: form.paymentMethod
                                                                            });
                                                                            fetchForms();
                                                                            showNotify('Payment recorded');
                                                                                } catch (err) { 
                                                                                 const errorMsg = err.response?.data?.message || 'Update failed';
                                                                                 showNotify(errorMsg, 'error'); 
                                                                             }
                                                                    }
                                                                }}
                                                            />
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className={`font-black text-sm ${(form.totalAmount || 0) - (form.paidAmount || 0) > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                                ₹{(form.totalAmount || 0) - (form.paidAmount || 0)}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <select
                                                                className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs font-black text-secondary outline-none focus:border-emerald-500 transition-all cursor-pointer"
                                                                defaultValue={form.paymentMethod || 'Pending'}
                                                                onChange={async (e) => {
                                                                    try {
                                                                        await axios.patch(`${import.meta.env.VITE_API_URL}/forms/${form._id}/payment`, {
                                                                            paymentMethod: e.target.value,
                                                                            paidAmount: form.paidAmount,
                                                                            totalAmount: form.totalAmount
                                                                        });
                                                                        fetchForms();
                                                                        showNotify('Mode updated');
                                                                    } catch (err) { showNotify('Update failed', 'error'); }
                                                                }}
                                                            >
                                                                <option value="Pending">Pending</option>
                                                                <option value="Cash">Cash</option>
                                                                <option value="Online">Online</option>
                                                            </select>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex items-center justify-center space-x-3">
                                                                <button
                                                                    onClick={() => setViewingReceipt(form)}
                                                                    className="p-2.5 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-xl transition-all border border-secondary/20 cursor-pointer"
                                                                    title="View Receipt"
                                                                >
                                                                    <Printer size={16} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleShareWhatsApp(form)}
                                                                    className="p-2.5 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl transition-all border border-emerald-500/20 cursor-pointer"
                                                                    title="Share Receipt"
                                                                >
                                                                    <MessageCircle size={16} />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === 'Jobs' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                                <div className="bg-primary/40 p-10 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-md">
                                    <h2 className="text-3xl font-black text-white mb-6">Create Job Listing</h2>
                                    <form onSubmit={handleCreateJob} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <input type="text" placeholder="Job Title (e.g. SSC CGL 2026)" required className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white placeholder:text-slate-500" value={newJob.title} onChange={e => setNewJob({ ...newJob, title: e.target.value })} />
                                        </div>
                                        <input type="text" placeholder="Last Date" required className="p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white placeholder:text-slate-500" value={newJob.lastDate} onChange={e => setNewJob({ ...newJob, lastDate: e.target.value })} />
                                        <input type="text" placeholder="Apply Link" className="p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white placeholder:text-slate-500" value={newJob.applyLink} onChange={e => setNewJob({ ...newJob, applyLink: e.target.value })} />
                                        <input type="text" placeholder="Fee Amount" required className="p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white placeholder:text-slate-500" value={newJob.fee} onChange={e => setNewJob({ ...newJob, fee: e.target.value })} />

                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Essential Documents Required</label>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 bg-white/5 p-5 rounded-3xl border border-white/5">
                                                {['Aadhar Card', 'Passport Photo', 'Signature', '10th Marksheet', '12th Marksheet', 'Graduation', 'Caste Cert', 'Income Cert', 'Domicile', 'PAN Card', 'Bank Passbook'].map(doc => (
                                                    <label key={doc} className="flex items-center space-x-2 cursor-pointer group">
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4 rounded border-white/10 bg-white/5 text-secondary focus:ring-secondary cursor-pointer"
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
                                                        <span className="text-xs font-bold text-slate-400 group-hover:text-secondary transition-colors">{doc}</span>
                                                    </label>
                                                ))}
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Other documents (comma separated)"
                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white text-sm placeholder:text-slate-500"
                                                value={newJob.documentRequired}
                                                onChange={e => setNewJob({ ...newJob, documentRequired: e.target.value })}
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <button type="submit" className="w-full bg-secondary hover:bg-white text-primary transition-all font-black text-lg py-4 rounded-2xl shadow-xl shadow-secondary/10 cursor-pointer">
                                                Publish Job
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-white">Active Job Listings</h2>
                                    {jobs.map(job => (
                                        <div key={job._id} className="bg-primary/40 p-6 rounded-3xl shadow-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
                                            <div>
                                                <h3 className="text-xl font-black text-white">{job.title}</h3>
                                                <p className="text-sm font-bold text-slate-400 mt-1">Last Date: {job.lastDate} <span className="mx-2">•</span> Fee: {job.fee}</p>
                                                <p className="text-xs text-slate-500 mt-1">Docs: {job.documentRequired}</p>
                                            </div>
                                            <div className="flex space-x-3 shrink-0">
                                                <a href={job.applyLink} target="_blank" rel="noreferrer" className="p-3 bg-white/5 text-blue-400 rounded-xl hover:bg-blue-500 hover:text-white transition-colors border border-white/5 cursor-pointer"><ExternalLink size={20} /></a>
                                                <button onClick={() => deleteJob(job._id)} className="p-3 bg-white/5 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-white/5 cursor-pointer"><Trash size={20} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'Services' && (
                            <div className="space-y-10">
                                <div className="bg-primary/40 p-10 rounded-[2.5rem] shadow-2xl border border-white/5 backdrop-blur-md">
                                    <h2 className="text-3xl font-black text-white mb-6">Add New Service / Price</h2>
                                    <form onSubmit={handleCreateService} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <input type="text" placeholder="Service Name" required className="p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white placeholder:text-slate-500" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} />
                                        <input type="number" placeholder="Price (₹)" required className="p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white placeholder:text-slate-500" value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })} />
                                        <div className="md:col-span-2">
                                            <input type="text" placeholder="Short Description" required className="p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white placeholder:text-slate-500 w-full" value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
                                        </div>
                                        <div className="md:col-span-2">
                                            <select className="p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-secondary font-bold text-white w-full appearance-none cursor-pointer" value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}>
                                                <option value="Government Services" className="bg-primary cursor-pointer">Government Services</option>
                                                <option value="Online & Digital Services" className="bg-primary cursor-pointer">Online & Digital Services</option>
                                                <option value="General Service" className="bg-primary cursor-pointer">General Service</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <button type="submit" className="w-full bg-secondary hover:bg-white text-primary transition-all font-black text-lg py-4 rounded-2xl shadow-xl shadow-secondary/10 cursor-pointer">
                                                Add Service Base
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-2xl font-black text-white">Managed Services</h2>
                                    {servicesData.map(service => (
                                        <div key={service._id} className="bg-primary/40 p-6 rounded-3xl shadow-2xl border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-md">
                                            <div>
                                                <h3 className="text-xl font-black text-white">{service.name}</h3>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    {editingServiceId === service._id ? (
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-bold text-slate-400">Price: ₹</span>
                                                            <input
                                                                type="number"
                                                                className="p-1 w-20 bg-white/5 border border-white/10 rounded-lg outline-none focus:border-secondary font-bold text-white text-sm"
                                                                value={editServicePrice}
                                                                onChange={(e) => setEditServicePrice(e.target.value)}
                                                            />
                                                            <button
                                                                onClick={() => saveServicePrice(service)}
                                                                className="ml-2 text-xs bg-green-500 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-600 transition-colors cursor-pointer"
                                                            >
                                                                Save
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingServiceId(null)}
                                                                className="text-xs bg-white/10 text-slate-300 font-bold py-1 px-3 rounded-lg hover:bg-white/20 transition-colors cursor-pointer"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm font-bold text-slate-400">
                                                            Price: ₹{service.price}
                                                            <span className="ml-2 cursor-pointer text-secondary hover:text-white transition-colors inline-block" onClick={() => startEditingPrice(service)}>
                                                                <Edit2 size={14} className="inline mb-0.5" />
                                                            </span>
                                                        </p>
                                                    )}
                                                    <span className="mx-2 text-slate-600">•</span>
                                                    <p className="text-sm font-bold text-slate-400">Category: {service.category}</p>
                                                </div>
                                                <p className="text-xs text-slate-500 mt-2">{service.description}</p>
                                            </div>
                                            <div className="flex space-x-3 shrink-0 mt-3 md:mt-0">
                                                <button onClick={() => deleteService(service._id)} className="p-3 bg-white/5 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors border border-white/5 cursor-pointer" title="Delete Service"><Trash size={20} /></button>
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
                                    <div className="bg-primary/40 p-8 rounded-4xl shadow-2xl border border-white/5 group hover:border-secondary/30 transition-all backdrop-blur-md">
                                        <div className="bg-blue-400/10 w-12 h-12 rounded-xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                                            <FileText size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">Data Management</h3>
                                        <p className="text-slate-500 font-bold text-xs mb-8 leading-relaxed">Export all application records to spreadsheet format (CSV) for local backup or accounting.</p>
                                        <button
                                            onClick={handleExportCSV}
                                            className="bg-secondary text-primary font-black w-full py-4 rounded-xl shadow-xl shadow-secondary/10 hover:bg-white transition-all flex items-center justify-center space-x-3 cursor-pointer"
                                        >
                                            <ExternalLink size={18} />
                                            <span>GENERATE EXPORT (.CSV)</span>
                                        </button>
                                    </div>

                                    {/* Admin Security Controls */}
                                    <div className="bg-primary/40 p-8 rounded-4xl shadow-2xl border border-white/5 group backdrop-blur-md">
                                        <div className="bg-purple-400/10 w-12 h-12 rounded-xl flex items-center justify-center text-purple-400 mb-6 group-hover:bg-purple-500 group-hover:text-white transition-all">
                                            <Settings size={24} />
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 tracking-tight">Security Settings</h3>
                                        <p className="text-slate-500 font-bold text-[10px] mb-6 leading-relaxed uppercase">Update your login credentials and access keys.</p>

                                        <form onSubmit={handleUpdateAdmin} className="space-y-4">
                                            <input
                                                type="text" placeholder="Full Name"
                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold outline-none focus:border-secondary transition-all shadow-sm text-white placeholder:text-slate-500"
                                                value={adminUpdate.username}
                                                onChange={e => setAdminUpdate({ ...adminUpdate, username: e.target.value })}
                                            />
                                            <input
                                                type="password" placeholder="Secure Password"
                                                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold outline-none focus:border-secondary transition-all shadow-sm text-white placeholder:text-slate-500"
                                                value={adminUpdate.password}
                                                onChange={e => setAdminUpdate({ ...adminUpdate, password: e.target.value })}
                                            />

                                            <button
                                                type="submit"
                                                className="w-full py-4 bg-primary text-white border border-white/10 rounded-2xl font-black text-xs transition-all tracking-[0.2em] shadow-xl hover:bg-secondary hover:text-primary active:scale-95 uppercase cursor-pointer"
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
                                                <span className="text-secondary font-black text-[10px] tracking-widest uppercase">Version 2.0.4</span>
                                            </div>
                                            <h2 className="text-2xl font-black text-white mb-2">Systems Overview</h2>
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
                            className="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center p-6 backdrop-blur-md"
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                                className="bg-primary w-full max-w-2xl max-h-[90vh] rounded-4xl p-8 relative overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] flex flex-col"
                            >
                                <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-secondary to-blue-400"></div>
                                <button
                                    onClick={() => setViewingDocs(null)}
                                    className="absolute top-8 right-8 p-3 bg-white/5 text-slate-400 rounded-2xl hover:bg-rose-500 hover:text-white transition-all border border-white/5 cursor-pointer"
                                >
                                    <X size={20} />
                                </button>

                                <div className="mb-10">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <span className="w-8 h-1 bg-secondary rounded-full"></span>
                                        <span className="text-secondary font-black text-[10px] tracking-widest uppercase">Protocol Assets</span>
                                    </div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">Encryption Keys & Files</h2>
                                    <p className="text-slate-500 font-bold text-xs mt-2">Assets for: {viewingDocs.fullName} ({viewingDocs.customerId})</p>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <label className="text-[10px] font-black uppercase text-secondary tracking-[0.2em] mb-3 block">Operational Notes / Directives</label>
                                    <div className="flex gap-3">
                                        <textarea
                                            className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:border-secondary transition-all resize-none h-24 placeholder:text-slate-600"
                                            placeholder="Add operational notes here..."
                                            value={tempNotes}
                                            onChange={e => setTempNotes(e.target.value)}
                                        />
                                        <button
                                            onClick={() => updateFormNotes(viewingDocs._id, tempNotes)}
                                            className="bg-secondary text-primary px-6 rounded-2xl hover:bg-white transition-all shadow-xl shadow-secondary/10 font-black cursor-pointer"
                                        >
                                            <CheckCircle size={20} className="mr-2 inline" />
                                            SAVE
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                    {viewingDocs.documents?.length > 0 ? viewingDocs.documents.map((doc, idx) => {
                                        const ext = doc.split('.').pop().toUpperCase();
                                        return (
                                            <a
                                                key={idx}
                                                href={doc.startsWith('http') ? doc : `${import.meta.env.VITE_API_URL.replace('/api', '')}/${doc.replace(/\\/g, '/')}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-between p-5 bg-gray-50 rounded-3xl hover:bg-secondary/10 border border-gray-100 hover:border-secondary/30 transition-all group"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 shadow-sm text-secondary font-black text-xs">
                                                        {ext}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <p className="text-xs font-black text-white truncate max-w-[120px]">Document_{idx + 1}</p>
                                                        <p className="text-[10px] text-slate-500 font-bold uppercase">Stored Node</p>
                                                    </div>
                                                </div>
                                                <ExternalLink size={16} className="text-slate-600 group-hover:text-secondary transition-colors" />
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
                                        className="px-8 py-3 bg-white text-primary font-black text-xs rounded-xl shadow-xl hover:bg-secondary transition-all cursor-pointer"
                                    >
                                        CLOSE CONSOLE
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>

                {/* Receipt Modal */}
                <AnimatePresence>
                    {viewingReceipt && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 receipt-print-container">
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-primary/90 backdrop-blur-2xl print:hidden"
                                onClick={() => setViewingReceipt(null)}
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
                                        <p className="font-mono text-secondary font-bold print:text-slate-900">REC-{viewingReceipt.customerId?.split('-')[2] || 'NX'}</p>
                                    </div>
                                </div>

                                <div className="p-10 space-y-10 print:p-8 print:space-y-6 text-left">
                                    {/* Candidate Info */}
                                    <div className="grid grid-cols-2 gap-8 print:gap-4">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bill To / Candidate</p>
                                            <h3 className="text-xl font-black text-slate-900 uppercase">{viewingReceipt.fullName}</h3>
                                            <p className="text-sm font-bold text-slate-500 mt-1">{viewingReceipt.phone}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Application Date</p>
                                            <h3 className="text-lg font-bold text-slate-900">{new Date(viewingReceipt.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</h3>
                                            <p className="text-sm font-bold text-secondary uppercase tracking-widest mt-1">ID: {viewingReceipt.customerId}</p>
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
                                                        <p className="font-black text-slate-900 text-lg">{viewingReceipt.serviceType}</p>
                                                        <p className="text-xs font-bold text-slate-500 italic">Government Protocol Processing</p>
                                                    </td>
                                                    <td className="text-center font-mono text-sm font-bold text-slate-600">{viewingReceipt.customerId}</td>
                                                    <td className="text-right">
                                                        <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase text-secondary border border-slate-200">{viewingReceipt.status}</span>
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
                                                    <span className="font-black text-slate-900">₹{viewingReceipt.totalAmount || 0}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-bold text-slate-500">Advance Paid:</span>
                                                    <span className="font-black text-emerald-600">₹{viewingReceipt.paidAmount || 0}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span className="font-bold text-slate-500">Payment Mode:</span>
                                                    <span className="px-2 py-0.5 bg-slate-200 rounded text-[10px] font-black uppercase text-slate-700">{viewingReceipt.paymentMethod || 'Pending'}</span>
                                                </div>
                                                <div className="h-px bg-slate-200 my-2"></div>
                                                <div className="flex justify-between text-lg">
                                                    <span className="font-black text-slate-900">Balance Due:</span>
                                                    <span className="font-black text-rose-600">₹{(viewingReceipt.totalAmount || 0) - (viewingReceipt.paidAmount || 0)}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="p-6 bg-white border-4 border-double border-slate-200 rounded-3xl -rotate-6 shadow-sm">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authorization</p>
                                                <p className="text-xl font-black text-secondary leading-none uppercase tracking-tighter">
                                                    {(viewingReceipt.totalAmount || 0) - (viewingReceipt.paidAmount || 0) <= 0 ? 'FULLY SETTLED' : 'PARTIAL PAY'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Info */}
                                    <div className="flex flex-col md:flex-row justify-between gap-8 pt-10 border-t border-slate-100 print:flex-row">
                                        <div className="flex-1 space-y-4 text-left">
                                            <div className="flex items-start space-x-3 text-slate-500">
                                                <MapPin size={18} className="text-secondary mt-1 shrink-0" />
                                                <span className="text-sm font-bold leading-tight">Near Nagar Palika Main Road Chirgaon Dist Jhansi 284301</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-slate-500">
                                                <Phone size={18} className="text-secondary shrink-0" />
                                                <span className="text-sm font-black">+91 7398858482</span>
                                            </div>
                                        </div>
                                        <div className="text-center md:text-right flex flex-col items-center md:items-end justify-center">
                                            <div className="w-40 p-4 border-2 border-slate-100 rounded-3xl mb-3 flex flex-col items-center justify-center bg-slate-50 print:border-slate-300">
                                                <Globe className="text-secondary w-10 h-10 mb-2" />
                                                <p className="text-[10px] font-black text-slate-900 leading-none">JAVED</p>
                                                <p className="text-[10px] font-black text-secondary leading-none">COMPUTERS</p>
                                                <div className="mt-2 text-[8px] font-bold text-slate-400 border-t border-slate-200 pt-1 w-full text-center uppercase tracking-tighter">Verified Seal</div>
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
                                        <Printer size={16} /> <span>PRINT RECEIPT</span>
                                    </button>
                                    <button onClick={() => handleShareWhatsApp(viewingReceipt)} className="flex items-center space-x-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-xs hover:bg-emerald-600 transition-all cursor-pointer">
                                        <MessageCircle size={16} /> <span>SEND ON WHATSAPP</span>
                                    </button>
                                    <button onClick={() => setViewingReceipt(null)} className="flex items-center space-x-2 bg-white text-slate-900 border border-slate-200 px-6 py-3 rounded-xl font-black text-xs hover:bg-slate-100 transition-all cursor-pointer">
                                        <X size={16} /> <span>CLOSE</span>
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
