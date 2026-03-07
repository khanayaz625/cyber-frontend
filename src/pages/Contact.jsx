import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, MapPin, Mail, Clock, ArrowRight } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

const Contact = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [contactNo, setContactNo] = useState('');

  useEffect(() => {
    const serviceQuery = searchParams.get('service');
    if (serviceQuery) {
        setMessage(`Hello, I would like to request details and proceed with the following service: ${serviceQuery}. Please let me know the requirements.`);
    }
  }, [searchParams]);
  return (
    <div className="bg-gray-50 h-screen flex flex-col justify-center pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full max-h-[90vh] overflow-y-auto custom-scrollbar pr-4">
        <header className="mb-10 text-center">
          <h1 className="text-4xl lg:text-5xl font-black text-primary mb-4 tracking-tight">Get in <span className="text-accent underline decoration-orange-300 decoration-8 underline-offset-4">Touch</span></h1>
          <p className="text-gray-500 text-base md:text-lg font-medium max-w-2xl mx-auto leading-relaxed">Have questions? Reach out to Javed Computers for professional digital assistance.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="space-y-6 flex flex-col justify-between"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center group hover:bg-primary transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:bg-white transition-colors">
                  <Phone size={24} />
                </div>
                <h3 className="text-lg font-black text-primary mb-1 group-hover:text-white">Call Us</h3>
                <a href="tel:7398858482" className="text-gray-500 text-sm font-bold group-hover:text-blue-200 outline-none">+91 73988 58482</a>
                <p className="text-gray-400 text-xs mt-1 group-hover:text-blue-300">Mon - Sat, 9 AM - 9 PM</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center group hover:bg-green-600 transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:bg-white transition-colors">
                  <MessageCircle size={24} />
                </div>
                <h3 className="text-lg font-black text-primary mb-1 group-hover:text-white transition-all">WhatsApp</h3>
                <a href="https://wa.me/917398858482" target="_blank" rel="noreferrer" className="text-gray-500 text-sm font-bold group-hover:text-green-100 transition-all outline-none">+91 73988 58482</a>
                <p className="text-gray-400 text-xs mt-1 group-hover:text-green-200 transition-all">Instant Support available.</p>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center group hover:bg-orange-500 transition-all duration-300">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:bg-white transition-colors">
                  <Mail size={24} />
                </div>
                <h3 className="text-lg font-black text-primary mb-1 group-hover:text-white">Email Us</h3>
                <a href="mailto:javedcomputer786@gmail.com" className="text-gray-500 font-bold group-hover:text-orange-100 outline-none text-xs break-all">javedcomputer786@gmail.com</a>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-2xl border border-gray-100 flex flex-col items-center text-center group hover:bg-secondary transition-all duration-300">
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-4 shadow-xl group-hover:bg-white transition-colors">
                  <Clock size={24} />
                </div>
                <h3 className="text-lg font-black text-primary mb-1 group-hover:text-white">Visit Us</h3>
                <a href="https://maps.app.goo.gl/ZZQNQoVBeV3S97n2A" target="_blank" rel="noreferrer" className="text-gray-500 text-sm font-bold group-hover:text-sky-100 outline-none">Main Market, UP</a>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100 border-l-8 border-l-secondary relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -mr-16 -mt-16"></div>
                <h4 className="text-2xl font-black text-primary mb-4">Our Location</h4>
                <div className="flex items-start space-x-4">
                    <MapPin className="text-accent shrink-0 mt-1" size={24} />
                    <p className="text-base font-medium text-gray-500 leading-relaxed">
                        Javed Computers, <br />
                        Nagar Palika Ke Pass, Main Road, <br />
                        Chirgaon, Dist Jhansi - 284301
                    </p>
                </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex flex-col h-full"
          >
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 h-full relative overflow-hidden flex flex-col justify-center">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full"></div>
                <h2 className="text-3xl font-black text-primary mb-6">Send a Message</h2>
                <form className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-primary font-black ml-4 text-sm">Full Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-xl p-4 font-bold transition-all text-sm" placeholder="Enter name" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-primary font-black ml-4 text-sm">Contact No.</label>
                        <input value={contactNo} onChange={e => setContactNo(e.target.value)} type="tel" className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-xl p-4 font-bold transition-all text-sm" placeholder="Enter contact number" />
                    </div>
                    <div className="space-y-1">
                        <label className="text-primary font-black ml-4 text-sm">Your Message</label>
                        <textarea 
                            value={message} 
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-gray-50 border-2 border-transparent focus:border-secondary outline-none rounded-xl p-4 font-bold transition-all h-28 text-sm resize-none custom-scrollbar" 
                            placeholder="Type message..."
                        />
                    </div>
                    <button type="button" onClick={() => {
                        const text = `Hi Javed Computers,\n\nName: ${name}\nContact: ${contactNo}\n\nMessage: ${message}`;
                        window.open(`https://wa.me/917398858482?text=${encodeURIComponent(text)}`, '_blank');
                    }} className="bg-primary text-white w-full py-4 mt-2 rounded-xl text-lg font-black shadow-2xl hover:bg-gray-800 transition-all flex items-center justify-center space-x-3">
                        <span>Send Message</span>
                        <ArrowRight size={20} />
                    </button>
                </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
