import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from 'react-icons/fi';
import { FaTruck } from 'react-icons/fa';

const Navbar = () => {
  const { getCartCount, showSearch, setShowSearch } = useContext(ShopContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Collection', path: '/collection' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/90 backdrop-blur shadow-md border-b border-gray-100 sticky top-0 z-50 py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <img 
                src={assets.logo} 
                alt="Amana Organics" 
                className="h-28 w-auto md:h-32 drop-shadow" 
              />
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-green-600 bg-green-50'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right side icons */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Search Icon */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-full hover:bg-green-50 transition-colors text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-green-50 transition-colors text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-200">
                <FiShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center shadow">
                    {getCartCount()}
                  </span>
                )}
              </Link>

              {/* Track Order Icon */}
              <Link to="/track-order" className="  hidden lg:block  p-2 rounded-full hover:bg-green-50 transition-colors text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-200" title="Track Order">
                <FaTruck className="w-5 h-5 md:w-6 md:h-6" />
              </Link>

              {/* Login Icon */}
              <Link to="/login" className=" hidden lg:block p-2 rounded-full hover:bg-green-50 transition-colors text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-200">
                <FiUser className="w-5 h-5 md:w-6 md:h-6" />
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-green-50 transition-colors text-gray-700 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-200"
                aria-label="Toggle mobile menu"
              >
                <FiMenu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-out Menu */}
      <div className={`fixed inset-0 z-50 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={closeMobileMenu}
        />
        
        {/* Slide-out menu */}
        <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          {/* Menu Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {/* Menu Content */}
          <div className="p-6">
            {/* Navigation Links */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-green-600 bg-green-50 border-l-4 border-green-600'
                      : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="space-y-4 mb-8">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Quick Actions</h3>
              
              <Link
                to="/cart"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <FiShoppingCart className="w-5 h-5 mr-3" />
                <span>Cart ({getCartCount()})</span>
              </Link>

              <Link
                to="/track-order"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <FaTruck className="w-5 h-5 mr-3" />
                <span>Track Order</span>
              </Link>

              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <FiUser className="w-5 h-5 mr-3" />
                <span>Login / Register</span>
              </Link>
            </div>

            {/* Search Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">Search</h3>
              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  closeMobileMenu();
                }}
                className="flex items-center w-full px-4 py-3 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors"
              >
                <FiSearch className="w-5 h-5 mr-3" />
                <span>Search Products</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar; 