import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiAlertCircle, FiLogIn } from 'react-icons/fi';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  // Get the page they were trying to visit
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim() || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      
      // Navigate to the page they were trying to access, or dashboard
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later');
      } else {
        setError('Failed to log in. Please try again');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-charcoal-black">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Log in to access your emergency dashboard
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center">
            <FiAlertCircle className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
            <div className="flex items-center justify-between mb-2">
              <label className="block text-gray-700 text-sm font-medium" htmlFor="password">
                Password
              </label>
              <Link to="/forgot-password" className="text-sm text-emergency-red hover:text-red-800">
                Forgot Password?
              </Link>
            </div>
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
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-emergency-red text-white font-medium py-3 rounded-lg flex items-center justify-center
              ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-red-700'}`}
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                Logging in...
              </>
            ) : (
              <>
                <FiLogIn className="mr-2" /> Log In
              </>
            )}
          </button>
          
          <div className="mt-8 text-center">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/register" className="text-emergency-red hover:text-red-800 font-medium">
              Register Now
            </Link>
          </div>
          
          {/* Test Accounts Section - Only shown in development */}
          {import.meta.env.DEV && (
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-2">Test Accounts:</h3>
              <div className="space-y-1 text-sm">
                <div>
                  <button 
                    type="button"
                    className="text-left text-blue-600 hover:underline"
                    onClick={() => {
                      setEmail('admin@rescue.com');
                      setPassword('test123');
                    }}
                  >
                    Admin: admin@rescue.com / test123
                  </button>
                </div>
                <div>
                  <button 
                    type="button"
                    className="text-left text-blue-600 hover:underline"
                    onClick={() => {
                      setEmail('agency@rescue.com');
                      setPassword('test123');
                    }}
                  >
                    Agency: agency@rescue.com / test123
                  </button>
                </div>
                <div>
                  <button 
                    type="button"
                    className="text-left text-blue-600 hover:underline"
                    onClick={() => {
                      setEmail('user@rescue.com');
                      setPassword('test123');
                    }}
                  >
                    User: user@rescue.com / test123
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;