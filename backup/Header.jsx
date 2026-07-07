import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChartBar, FaHistory, FaTwitter, FaHome, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import { useSentiment } from '../context/SentimentContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { stats } = useSentiment();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: <FaHome className="mr-2" /> },
    { path: '/analyze', label: 'Analyze', icon: <FaChartBar className="mr-2" /> },
    { path: '/social-media', label: 'Social Media', icon: <FaTwitter className="mr-2" /> },
    { path: '/history', label: 'History', icon: <FaHistory className="mr-2" /> },
    { path: '/dashboard', label: 'Dashboard', icon: <FaChartBar className="mr-2" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass-effect shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
            
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <FaChartBar className="text-white text-xl" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Sentiment Analyzer
                </h1>
                <p className="text-xs text-gray-500">AI-Powered Insights</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Stats & User Section */}
          <div className="flex items-center space-x-4">
            {/* Stats Badge */}
            {stats && (
              <div className="hidden md:flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.total.toLocaleString()} Analyses
                  </span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-sentiment-positive"></div>
                    <span className="text-xs">{stats.by_sentiment?.positive || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-sentiment-negative"></div>
                    <span className="text-xs">{stats.by_sentiment?.negative || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 rounded-full bg-sentiment-neutral"></div>
                    <span className="text-xs">{stats.by_sentiment?.neutral || 0}</span>
                  </div>
                </div>
              </div>
            )}

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                  <FaUser className="text-white" />
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">Welcome</p>
                  <p className="text-xs text-gray-500">Analyst</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 border border-gray-100">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium">Signed in as</p>
                    <p className="text-xs text-gray-500 truncate">analyst@sentiment.com</p>
                  </div>
                  
                  <Link
                    to="/dashboard"
                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <FaChartBar className="mr-3 text-gray-400" />
                    Dashboard
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                  >
                    <FaSignOutAlt className="mr-3" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200 mt-2">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg ${
                    isActive(item.path)
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
            
            {/* Mobile Stats */}
            {stats && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-2xl font-bold text-primary-700">{stats.total}</p>
                    <p className="text-xs text-gray-500">Total</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-700">{stats.by_sentiment?.positive || 0}</p>
                    <p className="text-xs text-gray-500">Positive</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-700">{stats.by_sentiment?.neutral || 0}</p>
                    <p className="text-xs text-gray-500">Neutral</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;