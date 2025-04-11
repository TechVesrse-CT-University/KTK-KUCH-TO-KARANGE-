import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState(null);

  // API base URL - create stable reference
  const API_URL = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:3000', []);

  // Ensure token is properly saved and loaded
  useEffect(() => {
    const loadSavedAuth = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('token');
        
        if (savedUser && savedToken) {
          console.log('Loaded saved authentication data');
          setCurrentUser(JSON.parse(savedUser));
          setAuthToken(savedToken);
        } else {
          console.log('No saved authentication data found');
        }
      } catch (error) {
        console.error('Error loading saved authentication:', error);
        // Clear invalid data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };
    
    loadSavedAuth();
  }, []);

  // Memoize functions to prevent unnecessary re-renders
  const login = async (email, password) => {
    // Reset state before attempting login
    setLoading(true);
    setLoginError(null);
    
    try {
      console.log('Attempting login with:', { email });
      
      // FIX: Remove duplicate /api prefix
      const loginUrl = `${API_URL}/api/auth/login`;
      console.log('Login URL:', loginUrl);
      
      // Make API request to login endpoint
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      // IMPROVED: Handle non-JSON responses
      let responseData;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        responseData = await response.json();
      } else {
        // Handle non-JSON response (like HTML error pages)
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 100) + '...');
        throw new Error(`Server returned non-JSON response (${response.status}): ${response.statusText}`);
      }
      
      console.log('Login response:', response.status, responseData);
      
      // Check if the login was successful
      if (!response.ok) {
        console.log('Login response not OK:', response.status, responseData);
        // Extract error message or use a default
        const errorMessage = responseData.message || 'Login failed. Please check your credentials.';
        throw new Error(errorMessage);
      }
      
      // Success - extract token and user data
      const { token, user } = responseData;
      
      if (!token || !user) {
        throw new Error('Invalid server response: missing token or user data');
      }
      
      // Store auth data with correct keys
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update state
      setAuthToken(token);
      setCurrentUser(user);
      setLoginError(null);
      
      console.log('Login successful:', user.username);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setLoginError(err.message || 'An unexpected error occurred during login');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Memoize other functions
  const register = useCallback(async (email, username, password) => {
    try {
      setLoginError(null);
      setLoading(true);
      
      // FIX: Use consistent URL construction
      const registerUrl = `${API_URL}/api/auth/register`;
      console.log('Register URL:', registerUrl);
      
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
      
      // IMPROVED: Handle non-JSON responses
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 100) + '...');
        throw new Error(`Server returned non-JSON response (${response.status})`);
      }
      
      console.log('Registration response:', response.status, data);
      
      if (!response.ok) {
        console.error('Registration response not OK:', response.status, data);
        setLoginError(data.message || 'Registration failed');
        throw new Error(data.message || 'Registration failed');
      }
      
      console.log('Registration successful');
      
      // If the server returns user and token, use them directly
      if (data.token && data.user) {
        setCurrentUser(data.user);
        setAuthToken(data.token);
        
        // Save to local storage with consistent keys
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        
        return { user: data.user, directLogin: true };
      } 
      // Otherwise return the success message
      else {
        return { 
          message: data.message || 'Registration successful. Please log in.',
          directLogin: false
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      setLoginError(error.message || 'Registration failed');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      if (!authToken) throw new Error('No token to refresh');
      
      const response = await fetch(`${API_URL}/api/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Token refresh failed');
      }
      
      setAuthToken(data.token);
      localStorage.setItem('token', data.token);
      
      return data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      if (error.message.includes('expired')) {
        logout(); // Force logout on expired token
      }
      throw error;
    }
  }, [API_URL, authToken]);

  // Create a stable context value object
  const value = useMemo(() => ({
    currentUser,
    authToken,
    loginError,
    login,
    register,
    logout,
    refreshToken,
    loading
  }), [currentUser, authToken, loginError, login, register, logout, refreshToken, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
