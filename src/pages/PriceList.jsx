import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { CreditCard, Printer, FileText, Globe, Smartphone, CreditCard as CardIcon } from 'lucide-react';

const PriceList = () => {
    const [prices, setPrices] = useState([]);
    
    // Default prices just in case the backend is empty or fails
    const defaultPrices = [
        { name: 'B&W Printout', price: 5, icon: <Printer /> },
        { name: 'Color Printout', price: 20, icon: <Printer /> },
        { name: 'Online Form Filling', price: 100, icon: <FileText /> },
        { name: 'Lamination', price: 30, icon: <CreditCard /> },
        { name: 'Passport Size Photo (8)', price: 50, icon: <Printer /> },
        { name: 'PAN Card Apply (New/Correction)', price: 200, icon: <CardIcon /> },
        { name: 'Aadhar Update', price: 100, icon: <Smartphone /> },
        { name: 'Passport Apply', price: 500, icon: <Globe /> },
        { name: 'Railway Ticket Booking', price: 50, icon: <Printer /> },
        { name: 'Electricity Bill Payment', price: 10, icon: <Smartphone /> }
    ];

    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`);
                if (res.data && res.data.length > 0) {
                    setPrices(res.data);
                } else {
                    setPrices(defaultPrices);
                }
            } catch (error) {
                console.error('Failed to fetch prices:', error);
                setPrices(defaultPrices);
            }
        };
        fetchPrices();
    }, []);

    return (
        <div className="bg-gray-50 min-h-screen pt-24 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <header className="mb-16 text-center">
                    <h1 className="text-5xl font-black text-primary mb-4 tracking-tight">Our <span className="text-accent underline decoration-orange-300 decoration-8 underline-offset-4">Rate Chart</span></h1>
                    <p className="text-gray-500 text-xl font-medium">Clear and transparent pricing for all our premium services.</p>
                </header>

                <div className="bg-white/40 backdrop-blur-xl rounded-[3rem] shadow-2xl overflow-hidden border border-white/40 p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {prices.map((item, idx) => {
                            const colors = [
                                'from-indigo-500 to-blue-600',
                                'from-emerald-500 to-teal-600',
                                'from-orange-500 to-rose-600',
                                'from-purple-500 to-indigo-600',
                                'from-sky-500 to-indigo-600',
                                'from-amber-500 to-orange-600'
                            ];
                            const bgColor = colors[idx % colors.length];
                            
                            return (
                                <motion.div 
                                    key={idx}
                                    whileHover={{ y: -8, scale: 1.02 }}
                                    className="bg-white p-8 rounded-4xl border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center group relative overflow-hidden transition-all duration-300"
                                >
                                    <div className={`absolute top-0 inset-x-0 h-1.5 bg-linear-to-r ${bgColor}`}></div>
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl transition-all duration-500 group-hover:rotate-6 bg-linear-to-br ${bgColor} text-white`}>
                                        {item.icon && typeof item.icon !== 'string' ? React.cloneElement(item.icon, { size: 32 }) : <FileText size={32} />}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight line-clamp-2 min-h-[56px]">{item.name || item.service}</h3>
                                    <div className="flex items-baseline space-x-1">
                                        <span className="text-sm font-black text-slate-400">₹</span>
                                        <span className={`text-4xl font-extrabold bg-linear-to-r ${bgColor} bg-clip-text text-transparent`}>{item.price}</span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="bg-primary text-white inline-block px-10 py-4 rounded-full font-bold shadow-xl shadow-primary/20">
                        Prices are subject to change based on government official fees.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PriceList;
