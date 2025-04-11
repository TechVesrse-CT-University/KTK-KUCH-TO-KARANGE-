import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiBell, FiLogOut, FiSettings, FiHelpCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-emergency-red text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center">
              RG
            </div>
            <span className="text-xl font-bold hidden sm:inline">RescueGrid</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="font-medium text-gray-700 hover:text-emergency-red">
              Home
            </Link>
            {user && (
              <>
                <Link to="/dashboard" className="font-medium text-gray-700 hover:text-emergency-red">
                  Dashboard
                </Link>
                <Link to="/sos" className="font-medium text-gray-700 hover:text-emergency-red">
                  SOS Portal
                </Link>
                <Link to="/agencies" className="font-medium text-gray-700 hover:text-emergency-red">
                  Agencies
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="font-medium text-gray-700 hover:text-emergency-red">
                    Admin
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Notification Button */}
                <button className="p-2 text-gray-600 hover:text-emergency-red">
                  <FiBell />
                </button>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <FiUser className="text-gray-600" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user.displayName || 'User'}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiUser className="inline mr-2" /> Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiSettings className="inline mr-2" /> Settings
                      </Link>
                      <Link
                        to="/help"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <FiHelpCircle className="inline mr-2" /> Help
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <FiLogOut className="inline mr-2" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="py-2 px-4 font-medium text-gray-700 hover:text-emergency-red"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="py-2 px-4 font-medium bg-emergency-red text-white rounded-md hover:bg-red-700"
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-600 focus:outline-none"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t mt-3">
            <Link
              to="/"
              className="block py-2 font-medium text-gray-700 hover:text-emergency-red"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 font-medium text-gray-700 hover:text-emergency-red"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/sos"
                  className="block py-2 font-medium text-gray-700 hover:text-emergency-red"
                  onClick={() => setIsMenuOpen(false)}
                >
                  SOS Portal
                </Link>
                <Link
                  to="/agencies"
                  className="block py-2 font-medium text-gray-700 hover:text-emergency-red"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Agencies
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block py-2 font-medium text-gray-700 hover:text-emergency-red"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 font-medium text-gray-700 hover:text-emergency-red"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 font-medium text-gray-700 hover:text-emergency-red"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block py-2 font-medium text-gray-700 hover:text-emergency-red"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;