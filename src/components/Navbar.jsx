import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Monitor, Menu, X, Rocket } from 'lucide-react';

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 flex items-center space-x-2">
            <Rocket className="h-8 w-8 text-secondary" />
            <span className="text-white text-2xl font-extrabold tracking-tight">Javed Computers</span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`${
                    isActive(link.path)
                      ? 'bg-secondary text-primary font-bold transition-all duration-300 transform scale-105'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin"
                className="bg-accent text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:-translate-y-1"
              >
                Admin Panel
              </Link>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-primary px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700 shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`${
                isActive(link.path)
                  ? 'bg-secondary text-primary font-bold shadow-inner'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              } block px-3 py-3 rounded-md text-base font-medium transition-all duration-300`}
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/admin"
            className="block text-center mt-4 bg-accent text-white px-3 py-3 rounded-md text-base font-bold shadow-lg shadow-orange-500/30"
            onClick={() => setIsOpen(false)}
          >
            Admin Panel
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
