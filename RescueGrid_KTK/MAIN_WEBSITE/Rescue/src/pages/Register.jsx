import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('individual');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, register } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!password) {
      setError('Please enter a password');
      return false;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError('');
    setSuccess('');
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await register(name, email, password);
      setSuccess('Registration successful! Redirecting to dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else {
        setError(err.message || 'Failed to register. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-charcoal-black">Create an Account</h2>
          <p className="text-gray-600 mt-2">
            Join the emergency response platform
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg flex items-center">
            <FiCheckCircle className="mr-2 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-red focus:border-emergency-red"
                placeholder="Your name"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-red focus:border-emergency-red"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-red focus:border-emergency-red"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirm-password">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-red focus:border-emergency-red"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              I am registering as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                userType === 'individual' 
                  ? 'bg-red-50 border-emergency-red' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="individual"
                  checked={userType === 'individual'}
                  onChange={() => setUserType('individual')}
                  className="sr-only"
                />
                <FiUser className={`mr-2 ${userType === 'individual' ? 'text-emergency-red' : 'text-gray-400'}`} />
                <span>Individual</span>
              </label>
              
              <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                userType === 'agency' 
                  ? 'bg-red-50 border-emergency-red' 
                  : 'border-gray-300 hover:bg-gray-50'
              }`}>
                <input
                  type="radio"
                  name="userType"
                  value="agency"
                  checked={userType === 'agency'}
                  onChange={() => setUserType('agency')}
                  className="sr-only"
                />
                <FiUser className={`mr-2 ${userType === 'agency' ? 'text-emergency-red' : 'text-gray-400'}`} />
                <span>Agency</span>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emergency-red text-white font-medium py-3 rounded-lg flex items-center justify-center
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Creating Account...
              </>
            ) : 'Create Account'}
          </button>
          
          <div className="mt-6 text-center">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/login" className="text-emergency-red hover:text-red-800 font-medium">
              Log In
            </Link>
          </div>
          
          <div className="mt-8 text-xs text-gray-500 text-center">
            By signing up, you agree to our 
            <a href="/terms" className="text-emergency-red hover:underline">Terms of Service</a> and 
            <a href="/privacy" className="text-emergency-red hover:underline">Privacy Policy</a>.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;