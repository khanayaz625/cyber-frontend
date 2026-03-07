import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  UserCircle, 
  MapPin, 
  Heart, 
  FileText, 
  ShieldCheck, 
  Train, 
  Bus, 
  Plane, 
  Printer, 
  Layers, 
  Image, 
  Zap,
  Smartphone,
  Camera
} from 'lucide-react';

const services = [
  {
    category: 'Government Services',
    items: [
      { name: 'PAN Card Apply', icon: <CreditCard />, desc: 'New PAN Card or Correction' },
      { name: 'Aadhar Update', icon: <UserCircle />, desc: 'Address, Name, or Phone Update' },
      { name: 'Voter ID Services', icon: <ShieldCheck />, desc: 'New ID or Application correction' },
      { name: 'Ayushman Card', icon: <Heart />, desc: 'Health Insurance card registration' },
      { name: 'Birth & Death Certificate', icon: <FileText />, desc: 'UP Government official registration' },
      { name: 'Income / Caste / Residence', icon: <MapPin />, desc: 'Official government certificates' },
      { name: 'Ration Card', icon: <Layers />, desc: 'New Ration Card or Modification' }
    ]
  },
  {
    category: 'Online & Digital Services',
    items: [
      { name: 'Job Forms', icon: <FileText />, desc: 'All government exam application forms' },
      { name: 'Railway / Bus / Flight', icon: <Train />, desc: 'Instant ticket booking services' },
      { name: 'Printout & Scan', icon: <Printer />, desc: 'B&W or Color High-Quality Printing' },
      { name: 'Lamination', icon: <Zap />, desc: 'Heat-sealed document protection' },
      { name: 'Passport Photo', icon: <Camera />, desc: 'Instant passport size photos' },
      { name: 'Utility Payments', icon: <Zap />, desc: 'Electricity and mobile bill payments' },
      { name: 'Mobile Recharge', icon: <Smartphone />, desc: 'All network recharges available' }
    ]
  }
];



const Services = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/services`);
        if (res.data && res.data.length > 0) {
          // Group by category
          const groupedMap = res.data.reduce((acc, curr) => {
            if (!acc[curr.category]) acc[curr.category] = [];
            acc[curr.category].push({
              name: curr.name,
              desc: curr.description,
              icon: <FileText /> 
            });
            return acc;
          }, {});

          const groupedArray = Object.keys(groupedMap).map(category => ({
            category,
            items: groupedMap[category]
          }));

          setData(groupedArray);
        } else {
          setData(services);
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setData(services);
      }
    };
    fetchServices();
  }, []);
  return (
    <div className="bg-gray-50 min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-primary mb-4 tracking-tight">Our <span className="text-secondary">Premium</span> Services</h1>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto font-medium">All your digital and government needs under one roof at Javed Computers.</p>
        </header>

        {data.map((section, idx) => (
          <div key={idx} className="mb-20">
            <h2 className="text-3xl font-extrabold text-primary mb-8 border-l-8 border-accent pl-6 flex items-center">
              {section.category}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {section.items.map((item, idy) => {
                const MotionLink = motion(Link);
                return (
                  <MotionLink 
                    key={idy}
                    to={`/contact?service=${encodeURIComponent(item.name)}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -10, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                    className="bg-white p-8 rounded-[2rem] border border-gray-100 transition-all duration-300 shadow-xl group hover:border-secondary block cursor-pointer"
                  >
                    <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20 group-hover:bg-secondary group-hover:text-primary transition-colors">
                      {item.icon && React.isValidElement(item.icon) ? React.cloneElement(item.icon, { size: 32 }) : null}
                    </div>
                    <h3 className="text-xl font-black text-primary mb-2 tracking-tight group-hover:text-secondary">{item.name}</h3>
                    <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </MotionLink>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
