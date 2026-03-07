import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, Menu, X, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Price List', path: '/price-list' },
    { name: 'Online Form', path: '/online-form' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex-shrink-0 flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <Rocket className="h-8 w-8 text-secondary relative group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-white text-2xl font-black tracking-tighter group-hover:text-secondary transition-colors duration-300 uppercase">Javed Computers</span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'bg-secondary text-primary font-black shadow-lg shadow-secondary/20'
                      : 'text-gray-300 hover:text-secondary hover:bg-white/5'
                  } px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                className="ml-4 relative group"
              >
                <div className="absolute -inset-0.5 bg-accent rounded-full blur opacity-50 group-hover:opacity-100 transition duration-300"></div>
                <button className="relative bg-accent text-white px-6 py-2 rounded-full text-sm font-black shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
                  Admin Panel
                </button>
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all focus:outline-none"
            >
              {isOpen ? <X className="h-7 w-7 text-secondary" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-primary/95 backdrop-blur-2xl px-4 pt-2 pb-6 space-y-2 border-t border-white/5 shadow-3xl mx-4 my-2 rounded-3xl"
        >
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${
                isActive(link.path)
                  ? 'bg-secondary text-primary font-black shadow-xl'
                  : 'text-gray-300 hover:bg-white/5 hover:text-secondary'
              } block px-4 py-4 rounded-2xl text-lg font-black transition-all duration-300`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin"
            className="block pt-4"
            onClick={() => setIsOpen(false)}
          >
            <button className="w-full bg-accent text-white py-4 rounded-2xl text-lg font-black shadow-2xl shadow-accent/20 active:scale-95 transition-all">
                Admin Panel
            </button>
          </Link>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
