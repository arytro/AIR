import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <img 
              src="https://customer-assets.emergentagent.com/job_fb4260be-c858-4e2d-91a5-ab7091220c34/artifacts/mf6s52k4_Logo%20nuevo.png" 
              alt="Air Logo" 
              className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/"
              className={`text-sm font-medium transition-all duration-300 hover:text-emerald-600 ${
                isActive('/') 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
            >
              Inicio
            </Link>
            <Link 
              to="/productos"
              className={`text-sm font-medium transition-all duration-300 hover:text-emerald-600 ${
                isActive('/productos') 
                  ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                  : 'text-slate-700 hover:text-emerald-600'
              }`}
            >
              Productos
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium transition-colors duration-300 hover:text-emerald-600 px-4 py-2 ${
                  isActive('/') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'
                }`}
              >
                Inicio
              </Link>
              <Link 
                to="/productos"
                onClick={() => setIsMenuOpen(false)}
                className={`text-sm font-medium transition-colors duration-300 hover:text-emerald-600 px-4 py-2 ${
                  isActive('/productos') ? 'text-emerald-600 bg-emerald-50' : 'text-slate-700'
                }`}
              >
                Productos
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;