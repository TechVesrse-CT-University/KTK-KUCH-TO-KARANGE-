/**
 * Simple Authentication Manager without Firebase dependency
 */
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authContainer = document.getElementById('auth-container');
        this.appContainer = document.getElementById('app-container');
        this.userNameElement = document.getElementById('user-name');
        
        // Setup event handlers for login/signup forms
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Login/Signup toggle
        document.getElementById('show-signup').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('login-form').classList.remove('active');
            document.getElementById('signup-form').classList.add('active');
        });
        
        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signup-form').classList.remove('active');
            document.getElementById('login-form').classList.add('active');
        });
        
        // Login form submission
        document.getElementById('login-button').addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            this.login(email, password);
        });
        
        // Signup form submission
        document.getElementById('signup-button').addEventListener('click', () => {
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const agencyName = document.getElementById('agency-name').value;
            const agencyType = document.getElementById('agency-type').value;
            
            this.signup(email, password, agencyName, agencyType);
        });
        
        // Logout button
        document.getElementById('logout-button').addEventListener('click', () => {
            this.logout();
        });
        
        // For demo - automatically login
        setTimeout(() => {
            this.demoLogin();
        }, 500);
    }
    
    /**
     * Demo login - no real authentication
     */
    demoLogin() {
        // Set a mock user
        this.currentUser = {
            uid: 'demo-user-123',
            email: 'demo@example.com',
            displayName: 'NDRF Demo User',
            role: 'coordinator', // Add role for coordination permissions
            canCoordinate: true
        };
        
        // Show app, hide auth
        this.authContainer.classList.add('hidden');
        this.appContainer.classList.remove('hidden');
        
        // Update UI with user info
        this.userNameElement.textContent = 'NDRF Demo User';
        
        // Notify the app that authentication is complete
        document.dispatchEvent(new CustomEvent('userAuthenticated', { 
            detail: {
                uid: this.currentUser.uid,
                email: this.currentUser.email,
                displayName: this.currentUser.displayName,
                agencyName: 'National Disaster Response Force',
                agencyType: 'disaster',
                role: 'coordinator',
                canCoordinate: true
            }
        }));
        
        // Show notification
        this.showNotification('Logged in as Demo User');
    }
    
    login(email, password) {
        if (!email || !password) {
            this.showNotification('Please enter both email and password', true);
            return;
        }
        
        // Simulate login
        setTimeout(() => {
            // Set user
            this.currentUser = {
                uid: 'user-' + Date.now(),
                email: email,
                displayName: email.split('@')[0]
            };
            
            // Show app, hide auth
            this.authContainer.classList.add('hidden');
            this.appContainer.classList.remove('hidden');
            
            // Update UI with user info
            this.userNameElement.textContent = this.currentUser.displayName;
            
            // Notify the app
            document.dispatchEvent(new CustomEvent('userAuthenticated', { 
                detail: {
                    uid: this.currentUser.uid,
                    email: this.currentUser.email,
                    displayName: this.currentUser.displayName,
                    agencyName: 'User Agency',
                    agencyType: 'disaster'
                }
            }));
            
            this.showNotification('Logged in successfully');
        }, 1000);
    }
    
    signup(email, password, agencyName, agencyType) {
        if (!email || !password || !agencyName || !agencyType) {
            this.showNotification('Please fill in all fields', true);
            return;
        }
        
        // Simulate signup
        setTimeout(() => {
            // Set user
            this.currentUser = {
                uid: 'user-' + Date.now(),
                email: email,
                displayName: agencyName
            };
            
            // Show app, hide auth
            this.authContainer.classList.add('hidden');
            this.appContainer.classList.remove('hidden');
            
            // Update UI with user info
            this.userNameElement.textContent = agencyName;
            
            // Notify the app
            document.dispatchEvent(new CustomEvent('userAuthenticated', { 
                detail: {
                    uid: this.currentUser.uid,
                    email: this.currentUser.email,
                    displayName: agencyName,
                    agencyName: agencyName,
                    agencyType: agencyType
                }
            }));
            
            this.showNotification('Account created successfully');
        }, 1000);
    }
    
    logout() {
        // Clear user
        this.currentUser = null;
        
        // Show auth, hide app
        this.authContainer.classList.remove('hidden');
        this.appContainer.classList.add('hidden');
        
        // Reset form
        document.getElementById('signup-form').classList.remove('active');
        document.getElementById('login-form').classList.add('active');
        document.getElementById('login-email').value = '';
        document.getElementById('login-password').value = '';
        
        this.showNotification('Logged out');
    }
    
    showNotification(message, isError = false) {
        const notificationArea = document.getElementById('notification-area');
        if (!notificationArea) return;
        
        const notification = document.createElement('div');
        notification.className = `notification ${isError ? 'bg-red-500' : 'bg-blue-600'} text-white p-3 mb-3 rounded-lg shadow-lg`;
        notification.innerHTML = message;
        
        notificationArea.appendChild(notification);
        
        // Play sound
        playNotificationSound(isError ? 'error' : 'success');
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
}
