document.addEventListener('DOMContentLoaded', () => {
    // Load disaster prone areas data
    let disasterData = window.disasterProneAreas || {};
    
    // Create a global app object
    window.app = {
        authManager: null,
        agencyManager: null,
        mapController: null,
        alertManager: null,
        notificationService: null,
        voiceRecognition: null,
        
        init: function() {
            // Initialize components
            this.authManager = new AuthManager();
            this.agencyManager = new AgencyManager();
            this.mapController = new MapController();
            this.alertManager = new AlertManager();
            this.notificationService = new NotificationService();
            
            // Initialize notification service
            this.notificationService.init(this.agencyManager, this.mapController);
            
            // Handle user authentication event
            document.addEventListener('userAuthenticated', (event) => {
                console.log('User authenticated:', event.detail);
                
                // Initialize voice recognition after auth
                this.voiceRecognition = new VoiceRecognition();
                
                // Add speech greeting with emergency tips
                setTimeout(() => {
                    if (this.voiceRecognition) {
                        this.voiceRecognition.speak("Welcome to the emergency response system. You can report disasters by saying phrases like 'Fire in Mumbai' or request services like 'Need ambulance in Delhi'. Click the microphone when you need help.");
                        
                        // Show examples of commands
                        this.showEmergencyCommandHelp();
                    }
                }, 1500);
                
                // Load agencies data
                this.agencyManager.loadAgencies();
                
                // Show agencies on map if available
                if (this.agencyManager.agencies && this.agencyManager.agencies.length > 0) {
                    this.mapController.showAllAgencies(this.agencyManager.agencies);
                }
            });
        },
        
        /**
         * Process emergency command from voice recognition
         * @param {string} emergencyType - Type of emergency (fire, flood, etc.)
         * @param {string} responseType - Type of response needed (fire, medical, etc.)
         * @param {string} location - Location name
         * @param {boolean} isServiceRequest - Whether this is a service request vs alert
         * @returns {Promise<Object>} - Result with success status
         */
        processEmergencyCommand: async function(emergencyType, responseType, location, isServiceRequest = false) {
            try {
                // Get coordinates for the location
                const coords = this.mapController.getCoordinatesForLocation(location);
                
                if (!coords) {
                    return { success: false, message: `Could not find location: ${location}` };
                }
                
                // Create appropriate alert type
                const alertId = this.alertManager.createAlert(
                    location, 
                    emergencyType, 
                    `${emergencyType.toUpperCase()} emergency in ${location}`
                );
                
                // Add to map with proper styling
                const addedToMap = this.mapController.addAlert(
                    alertId, 
                    coords, 
                    emergencyType, 
                    isServiceRequest ? `${responseType.toUpperCase()} SERVICE NEEDED` : undefined
                );
                
                if (!addedToMap) {
                    return { success: false, message: "Failed to add marker to map" };
                }
                
                // Notify agencies and handle response
                const nearbyAgencies = await this.notificationService.notifyNearbyAgencies(
                    coords, 
                    emergencyType, 
                    location,
                    { isServiceRequest, responseType }
                );
                
                if (nearbyAgencies.length > 0) {
                    console.log(`Alert sent to ${nearbyAgencies.length} nearby agencies`);
                    this.logCommand(`Alert sent to ${nearbyAgencies.length} nearby agencies`);
                } else {
                    this.logCommand(`No nearby agencies found for ${responseType}`);
                }
                
                return { 
                    success: true, 
                    agenciesNotified: nearbyAgencies.length,
                    message: `${nearbyAgencies.length} agencies notified`
                };
            } catch (error) {
                console.error("Error processing emergency command:", error);
                return { success: false, message: "An error occurred" };
            }
        },
        
        /**
         * Show emergency command examples to help users
         */
        showEmergencyCommandHelp() {
            const commandLog = document.getElementById('command-log');
            if (!commandLog) return;
            
            const helpCommands = [
                "Example commands:",
                "➤ 'Fire in Mumbai'",
                "➤ 'Need flood response in Bihar'",
                "➤ 'Earthquake in Uttarakhand'",
                "➤ 'Send ambulance to Chennai'",
                "➤ 'Report cyclone in Odisha'",
                "➤ 'Landslide in Darjeeling'"
            ];
            
            helpCommands.forEach(cmd => {
                const entry = document.createElement('div');
                entry.innerHTML = cmd;
                entry.className = cmd === "Example commands:" ? "font-bold" : "";
                commandLog.appendChild(entry);
            });
            
            commandLog.scrollTop = commandLog.scrollHeight;
        },
        
        logCommand: function(message) {
            const logElement = document.getElementById('command-log');
            const entry = document.createElement('div');
            entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            logElement.appendChild(entry);
            
            // Scroll to bottom
            logElement.scrollTop = logElement.scrollHeight;
            
            // Limit log entries
            while (logElement.children.length > 10) {
                logElement.removeChild(logElement.firstChild);
            }
        }
    };
    
    // Initialize the app
    window.app.init();
});
