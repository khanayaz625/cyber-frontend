import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Monitor, FileText, Globe, Smartphone, CreditCard, Camera, Printer, Layers, Briefcase, ExternalLink, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`);
        setJobs(res.data);
      } catch (err) {
        console.error('Failed to fetch jobs:', err);
      }
    };
    fetchJobs();
  }, []);
  const quickServices = [
    { title: 'Government Cards', icon: <FileText className="w-10 h-10" />, price: '₹50 onwards', color: 'bg-blue-600' },
    { title: 'Online Admissions', icon: <Globe className="w-10 h-10" />, price: '₹100 onwards', color: 'bg-purple-600' },
    { title: 'Digital Printing', icon: <Printer className="w-10 h-10" />, price: '₹5 onwards', color: 'bg-orange-500' },
    { title: 'Payment Services', icon: <CreditCard className="w-10 h-10" />, price: 'Instant', color: 'bg-green-600' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden pt-16">
        <div className="absolute inset-0 bg-primary opacity-90 z-10"></div>
        <div className="absolute inset-0 z-0 bg-no-repeat bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80")' }}></div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-extrabold mb-6"
          >
            Javed <span className="text-secondary">Computers</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Digital Hub for Uttar Pradesh. Your trusted partner for all government and online services.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/online-form" className="bg-secondary text-primary font-bold px-8 py-4 rounded-full text-lg shadow-xl hover:shadow-cyan-400/30 transition-all hover:scale-105">
              Submit Form Online
            </Link>
            <Link to="/services" className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-4 rounded-full text-lg font-bold hover:bg-white/20 transition-all">
              Our Services
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      {jobs.length > 0 && (
        <section className="py-20 bg-primary mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-white mb-4">Latest <span className="text-secondary">Job Alerts</span></h2>
              <p className="text-gray-400 text-lg">Current open forms and government applications available.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {jobs.map(job => {
                const whatsappMsg = `Hi Javed Computers, I want to apply for the ${job.title} job.`;
                const whatsappLink = `https://wa.me/917398858482?text=${encodeURIComponent(whatsappMsg)}`;

                return (
                  <motion.div
                    key={job._id}
                    whileHover={{ y: -5 }}
                    className="bg-[#111A2D] p-8 rounded-4xl border border-white/10 shadow-2xl flex flex-col h-full group hover:border-secondary/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6">
                        <div className="bg-secondary/20 p-4 rounded-[1.2rem] text-secondary">
                          <Briefcase size={28} />
                        </div>
                        <span className="bg-red-500/10 text-red-400 font-bold px-4 py-1.5 rounded-full text-xs uppercase tracking-widest border border-red-500/20">
                          Last Date: {job.lastDate}
                        </span>
                      </div>
                      <h3 className="text-2xl font-black text-white mb-3 group-hover:text-secondary transition-colors line-clamp-2 h-16">{job.title}</h3>

                      <div className="space-y-4 mb-8">
                        <div className="flex items-start space-x-3 bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                          <FileText size={18} className="text-secondary mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Documents Required</p>
                            <p className="text-sm text-gray-300 font-bold leading-tight">{job.documentRequired}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3 bg-white/5 p-3 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                          <CreditCard size={18} className="text-emerald-400 shrink-0" />
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Service Fee</p>
                            <p className="text-sm text-emerald-400 font-black">{job.fee}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-auto relative z-20">
                      {job.applyLink && (
                        <a href={job.applyLink} target="_blank" rel="noreferrer" className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all text-[10px] uppercase tracking-widest border border-white/5 hover:border-white/20 active:scale-95">
                          <span>Apply Online</span> <ExternalLink size={14} />
                        </a>
                      )}
                      <a href={whatsappLink} target="_blank" rel="noreferrer" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 transition-all text-[10px] uppercase tracking-widest shadow-[0_10px_30px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_15px_35px_-5px_rgba(16,185,129,0.5)] active:scale-95 active:shadow-none">
                        <MessageCircle size={14} fill="currentColor" /> <span>WhatsApp Expert</span>
                      </a>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Services Highlight Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16">
          <div className="mb-8 md:mb-0">
            <h2 className="text-4xl font-black text-primary mb-4">Fast & Reliable <span className="text-accent underline decoration-orange-300 decoration-8 underline-offset-4">CSC Services</span></h2>
            <p className="text-gray-600 text-lg max-w-xl">We handle everything from PAN Card to Aadhar updates, ensuring your digital needs are met with precision.</p>
          </div>
          <Link to="/services" className="bg-primary text-white font-bold flex items-center px-6 py-3 rounded-xl hover:bg-gray-800 transition-all group">
            View All Services <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickServices.map((service, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white p-8 rounded-3xl shadow-2xl card-hover border border-gray-100 flex flex-col items-center text-center"
            >
              <div className={`${service.color} p-5 rounded-2xl text-white mb-6 shadow-lg shadow-blue-500/20`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-primary mb-2">{service.title}</h3>
              <p className="text-accent font-black text-lg">{service.price}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="p-4">
            <div className="bg-secondary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Monitor className="text-secondary w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold mb-3">High-Speed Internet</h4>
            <p className="text-gray-600">Ultra-fast fiber connectivity for seamless browsing and downloads.</p>
          </div>
          <div className="p-4">
            <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Layers className="text-accent w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Premium Printing</h4>
            <p className="text-gray-600">High-resolution laser printing for all your essential documents.</p>
          </div>
          <div className="p-4">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="text-green-600 w-10 h-10" />
            </div>
            <h4 className="text-2xl font-bold mb-3">Mobile Recharges</h4>
            <p className="text-gray-600">Instant mobile and electricity bill payments for your convenience.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
