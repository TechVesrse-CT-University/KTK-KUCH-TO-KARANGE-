import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-charcoal-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Column 1: Logo and Description */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="bg-emergency-red text-white font-bold rounded-lg w-10 h-10 flex items-center justify-center">
                RG
              </div>
              <span className="text-xl font-bold">RescueGrid</span>
            </Link>
            <p className="text-gray-300 mb-4">
              A modern platform connecting emergency services and citizens during disasters.
            </p>
            <div className="flex space-x-3">
              <a href="#" className="text-gray-300 hover:text-emergency-red transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-emergency-red transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-emergency-red transition-colors">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-emergency-red transition-colors">
                <FiLinkedin size={20} />
              </a>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-emergency-red transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/agencies" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Agencies
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3: Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/sos" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Emergency SOS
                </Link>
              </li>
              <li>
                <Link to="/map" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Disaster Mapping
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Resource Allocation
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Disaster Training
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="text-gray-300 hover:text-emergency-red transition-colors">
                  Emergency Analytics
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4: Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <FiMapPin className="mt-1 mr-2 text-emergency-red" />
                <span className="text-gray-300">
                  123 Emergency Plaza, <br />
                  Rescue City, RC 10001
                </span>
              </li>
              <li className="flex items-center">
                <FiPhone className="mr-2 text-emergency-red" />
                <span className="text-gray-300">+1 (555) 911-1234</span>
              </li>
              <li className="flex items-center">
                <FiMail className="mr-2 text-emergency-red" />
                <span className="text-gray-300">contact@rescue-grid.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} RescueGrid. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-4 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-emergency-red transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-emergency-red transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-gray-400 hover:text-emergency-red transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;