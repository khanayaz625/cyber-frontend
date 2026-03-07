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

                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {prices.map((item, idx) => (
                            <motion.div 
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                className="flex items-center space-x-6 bg-gray-50/50 p-8 rounded-[2rem] border-2 border-transparent hover:border-secondary hover:bg-white transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                                    {item.icon && typeof item.icon !== 'string' ? React.cloneElement(item.icon, { size: 28 }) : <FileText size={28} />}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-primary mb-1 tracking-tight">{item.name || item.service}</h3>
                                    <p className="text-2xl font-black text-accent">₹{item.price}</p>
                                </div>
                            </motion.div>
                        ))}
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
