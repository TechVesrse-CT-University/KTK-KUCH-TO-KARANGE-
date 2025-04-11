import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { MdOutlineWavingHand, MdEmail, MdLock, MdWarning } from 'react-icons/md';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { login, loginError, currentUser, authToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check for registration success message
  useEffect(() => {
    if (location.state?.registrationSuccess) {
      setSuccessMessage(location.state.message || 'Account created successfully. Please log in.');
    }
  }, [location.state]);

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser && authToken) {
      navigate('/');
    }
  }, [currentUser, authToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage(''); // Clear success message on submit
    
    try {
      console.log('Login attempt with email:', email);
      
      if (!email || !password) {
        setErrorMessage('Email and password are required');
        setIsLoading(false);
        return;
      }
      
      const success = await login(email, password);
      
      if (success) {
        console.log('Login successful, navigating to chat page');
        navigate('/');
      } else {
        console.log('Login error in component:', loginError);
        setErrorMessage(loginError || 
          'Failed to login. Please check your connection and try again.');
      }
    } catch (err) {
      console.error('Login submission error:', err);
      setErrorMessage(err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const getErrorMessage = () => {
    if (!errorMessage && !loginError) return null;
    
    const message = errorMessage || loginError;
    
    if (message?.includes('404')) {
      return 'Server is not responding. Please try again later.';
    }
    
    if (message?.includes('Invalid credentials')) {
      return 'Email or password is incorrect.';
    }
    
    return message;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="text-4xl mx-auto flex justify-center text-primary-500 mb-6"
          animate={{ 
            y: [0, -15, 0],
            rotateZ: [0, -10, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <MdOutlineWavingHand />
        </motion.div>
        <h2 className="mt-3 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          RescueConnect
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          Sign in to access the emergency coordination platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-dark-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Show success message if present */}
          {successMessage && (
            <div className="rounded-md bg-green-50 dark:bg-green-900/30 p-3 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800 dark:text-green-200">{successMessage}</h3>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email or Username
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdEmail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="text"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white sm:text-sm"
                  placeholder="your@email.com or username"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-dark-700 dark:text-white sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            {getErrorMessage() && (
              <div className="rounded-md bg-red-50 dark:bg-red-900/30 p-3">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <MdWarning className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {getErrorMessage()}
                    </h3>
                    
                    {getErrorMessage().includes('Server is not responding') && (
                      <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                        Make sure the backend server is running at http://localhost:3000
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading 
                    ? 'bg-primary-400 cursor-not-allowed' 
                    : 'bg-primary-600 hover:bg-primary-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </div>
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Forgot your password?
                </Link>
              </div>
              <div className="text-sm">
                <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
                  Create an account
                </Link>
              </div>
            </div>
            
            {/* Demo credentials with updated test email */}
            <div className="text-sm text-center mt-4 text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="mb-1">Demo credentials:</p>
              <p className="font-medium">Email: madhavarora132005@gmail.com</p>
              <p className="font-medium">Password: password123</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
