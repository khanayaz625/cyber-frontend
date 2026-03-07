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
    <div className="bg-gray-50 h-screen flex flex-col pt-24 pb-6 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 w-full h-full flex flex-col justify-between">
        <header className="mb-2 text-center shrink-0">
          <h1 className="text-3xl md:text-4xl font-black text-primary tracking-tight">Get in <span className="text-accent underline decoration-orange-300 decoration-4 underline-offset-4">Touch</span></h1>
        </header>

        <div className="flex-1 flex flex-col space-y-4 md:space-y-6 justify-center">
            {/* Form Upper */}
            <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col justify-center shrink-0"
            >
                <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 max-w-3xl mx-auto w-full relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-accent/10 rounded-full"></div>
                    <h2 className="text-2xl md:text-3xl font-black text-primary mb-4 md:mb-6">Send a Message</h2>
                    <form className="space-y-3 md:space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-1">
                                <label className="text-primary font-black ml-2 text-xs md:text-sm">Full Name</label>
                                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-xl p-3 md:p-4 font-bold transition-all text-xs md:text-sm" placeholder="Enter name" />
                            </div>
                            <div className="space-y-1">
                                <label className="text-primary font-black ml-2 text-xs md:text-sm">Contact No.</label>
                                <input value={contactNo} onChange={e => setContactNo(e.target.value)} type="tel" className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-xl p-3 md:p-4 font-bold transition-all text-xs md:text-sm" placeholder="Enter contact number" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-primary font-black ml-2 text-xs md:text-sm">Your Message</label>
                            <textarea 
                                value={message} 
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-gray-50 border border-transparent focus:border-secondary outline-none rounded-xl p-3 md:p-4 font-bold transition-all h-20 md:h-28 text-xs md:text-sm resize-none" 
                                placeholder="Type message..."
                            />
                        </div>
                        <button type="button" onClick={() => {
                            const text = `Hi Javed Computers,\n\nName: ${name}\nContact: ${contactNo}\n\nMessage: ${message}`;
                            window.open(`https://wa.me/917398858482?text=${encodeURIComponent(text)}`, '_blank');
                        }} className="bg-primary text-white w-full py-3 md:py-4 mt-2 rounded-xl text-sm md:text-base font-black shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center space-x-2">
                            <span>Send Message</span>
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </motion.div>

            {/* Contact Details Lower */}
            <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="grid grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 shrink-0 max-w-6xl mx-auto w-full"
            >
              <div className="bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:bg-primary transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:bg-white transition-colors">
                  <Phone size={20} />
                </div>
                <h3 className="text-xs md:text-sm font-black text-primary group-hover:text-white">Call Us</h3>
                <a href="tel:7398858482" className="text-gray-500 text-[10px] md:text-xs font-bold group-hover:text-blue-200">+91 73988 58482</a>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:bg-green-600 transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:bg-white transition-colors">
                  <MessageCircle size={20} />
                </div>
                <h3 className="text-xs md:text-sm font-black text-primary group-hover:text-white">WhatsApp</h3>
                <a href="https://wa.me/917398858482" target="_blank" rel="noreferrer" className="text-gray-500 text-[10px] md:text-xs font-bold group-hover:text-green-100">+91 73988 58482</a>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:bg-orange-500 transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:bg-white transition-colors">
                  <Mail size={20} />
                </div>
                <h3 className="text-xs md:text-sm font-black text-primary group-hover:text-white">Email Us</h3>
                <a href="mailto:javedcomputer786@gmail.com" className="text-gray-500 text-[10px] md:text-xs font-bold group-hover:text-orange-100 truncate w-full px-1" title="javedcomputer786@gmail.com">javedcomputer786@gmail...</a>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center group hover:bg-secondary transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:bg-white transition-colors">
                  <Clock size={20} />
                </div>
                <h3 className="text-xs md:text-sm font-black text-primary group-hover:text-white">Timings</h3>
                <span className="text-gray-500 text-[10px] md:text-xs font-bold group-hover:text-sky-100">9 AM - 9 PM</span>
              </div>

              <div className="bg-white p-3 md:p-4 rounded-2xl shadow-lg border border-gray-100 flex flex-col items-center text-center group col-span-2 lg:col-span-1 hover:bg-accent transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-2 shadow-md group-hover:bg-white transition-colors">
                  <MapPin size={20} />
                </div>
                <h3 className="text-xs md:text-sm font-black text-primary group-hover:text-white">Location</h3>
                <a href="https://maps.app.goo.gl/ZZQNQoVBeV3S97n2A" target="_blank" rel="noreferrer" className="text-gray-500 text-[10px] md:text-xs font-bold group-hover:text-orange-100">Chirgaon, Jhansi</a>
              </div>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
