import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, Menu, X, Rocket, FileText, Globe, MessageCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ isCollapsed, onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navLinks = [
    { name: 'Home', path: '/', icon: <Monitor className="w-6 h-6" /> },
    { name: 'Services', path: '/services', icon: <Globe className="w-6 h-6" /> },
    { name: 'Price List', path: '/price-list', icon: <FileText className="w-6 h-6" /> },
    { name: 'Online Form', path: '/online-form', icon: <FileText className="w-6 h-6" /> },
    { name: 'Track Status', path: '/track-status', icon: <Search className="w-6 h-6" /> },
    { name: 'Contact', path: '/contact', icon: <MessageCircle className="w-6 h-6" /> },
  ];

  const isActive = (path) => location.pathname === path;

  // Sidebar Layout for Desktop (non-home pages)
  if (!isHomePage) {
    return (
      <>
        {/* Desktop Sidebar */}
        <nav
          className={`hidden md:flex fixed left-0 top-0 bottom-0 ${isCollapsed ? 'w-20' : 'w-72'} bg-primary flex-col border-r border-white/10 z-50 transition-all duration-300 overflow-hidden shadow-2xl`}
        >
          <div className="p-4 md:p-6 flex-1 flex flex-col">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} mb-12`}>
              {!isCollapsed && (
                <Link to="/" className="flex items-center space-x-3 group">
                  <Globe className="h-8 w-8 text-secondary group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-white text-xl font-black tracking-tighter uppercase leading-none">Javed <br /> Computers</span>
                </Link>
              )}
              {isCollapsed && (
                <Link to="/">
                  <Globe className="h-8 w-8 text-secondary" />
                </Link>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${isActive(link.path)
                      ? 'bg-secondary text-primary font-black shadow-lg shadow-secondary/20'
                      : 'text-gray-300 hover:text-secondary hover:bg-white/5'
                    } ${isCollapsed ? 'p-3 justify-center' : 'px-6 py-4'} rounded-2xl text-base font-bold transition-all duration-300 flex items-center group relative`}
                  title={isCollapsed ? link.name : ""}
                >
                  <span className={`${isCollapsed ? '' : 'mr-3'}`}>{link.icon || <Monitor size={20} />}</span>
                  {!isCollapsed && <span className="relative z-10 whitespace-nowrap">{link.name}</span>}

                  {isActive(link.path) && !isCollapsed && (
                    <motion.div
                      layoutId="activeBar"
                      className="absolute right-0 w-1 h-8 bg-secondary rounded-l-full"
                    />
                  )}
                </Link>
              ))}
            </div>

            <button
              onClick={onToggle}
              className={`mt-auto mb-4 bg-white/5 hover:bg-white/10 text-white p-4 rounded-2xl flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} transition-all`}
            >
              {!isCollapsed && <span className="text-sm font-bold uppercase tracking-widest opacity-60">Collapse</span>}
              <Menu size={20} className={isCollapsed ? 'rotate-90' : ''} />
            </button>
          </div>
        </nav>

        {/* Mobile Top Bar (non-home pages) */}
        <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
          <div className="px-4 h-20 flex items-center justify-between">
            <Link to="/" className="shrink-0 flex items-center space-x-2">
              <Globe className="h-6 w-6 text-secondary" />
              <span className="text-white text-xl font-black uppercase tracking-tighter">Javed</span>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white"
            >
              {isOpen ? <X className="h-7 w-7 text-secondary" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>

          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-primary/95 backdrop-blur-2xl px-4 pb-8 space-y-2 border-t border-white/5"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${isActive(link.path)
                      ? 'bg-secondary text-primary font-black'
                      : 'text-gray-300 hover:bg-white/5'
                    } block px-5 py-4 rounded-2xl text-lg font-black transition-all`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </motion.div>
          )}
        </nav>
      </>
    );
  }

  // Original Top Layout for Home Page
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/80 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="shrink-0 flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute -inset-1 bg-secondary rounded-full blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <Globe className="h-8 w-8 text-secondary relative group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <span className="text-white text-2xl font-black tracking-tighter group-hover:text-secondary transition-colors duration-300 uppercase">Javed Computers</span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${isActive(link.path)
                      ? 'bg-secondary text-primary font-black shadow-lg shadow-secondary/20'
                      : 'text-gray-300 hover:text-secondary hover:bg-white/5'
                    } px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 transform active:scale-95`}
                >
                  {link.name}
                </Link>
              ))}
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
              className={`${isActive(link.path)
                  ? 'bg-secondary text-primary font-black shadow-xl'
                  : 'text-gray-300 hover:bg-white/5 hover:text-secondary'
                } block px-4 py-4 rounded-2xl text-lg font-black transition-all duration-300`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
