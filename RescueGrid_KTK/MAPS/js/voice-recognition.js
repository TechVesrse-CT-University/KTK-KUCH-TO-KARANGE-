class VoiceRecognition {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.isProcessing = false;
        this.commandHandlers = {};
        this.commandThrottle = null; // Throttle for commands
        this.speakThrottle = null; // Throttle for speech
        
        // Initialize only when needed (lazy initialization)
        document.getElementById('voice-indicator').addEventListener('click', () => {
            if (!this.recognition) {
                this.initRecognition();
            }
            this.toggleListening();
        });
    }

    initRecognition() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice recognition not supported in this browser. Please use Chrome or Edge.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateStatus('How can I help you?');
            document.getElementById('voice-indicator').classList.add('listening');
            
            // Speak the prompt (throttled)
            this.throttledSpeak('How can I help you?');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript.trim().toLowerCase();
            this.logCommand(`You said: ${transcript}`);
            
            // Process command with throttling
            this.throttledProcessCommand(transcript);
        };

        this.recognition.onend = () => {
            document.getElementById('voice-indicator').classList.remove('listening');
            if (this.isProcessing) {
                document.getElementById('voice-indicator').classList.add('processing');
            } else {
                this.updateStatus('Click microphone to activate');
            }
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            this.logCommand(`Error: ${event.error}`);
            document.getElementById('voice-indicator').classList.remove('listening');
            this.updateStatus('Click microphone to activate');
        };
    }
    
    toggleListening() {
        if (this.isProcessing) return;
        
        if (!this.isListening) {
            this.startListening();
        } else {
            this.stopListening();
        }
    }

    startListening() {
        if (!this.recognition) {
            this.initRecognition();
            if (!this.recognition) return;
        }

        try {
            this.recognition.start();
        } catch (e) {
            console.error('Could not start recognition', e);
            this.updateStatus('Error starting voice recognition');
        }
    }

    stopListening() {
        if (this.recognition && this.isListening) {
            this.isListening = false;
            try {
                this.recognition.stop();
            } catch (e) {
                console.error('Error stopping recognition', e);
            }
        }
        this.updateStatus('Click microphone to activate');
    }

    registerCommand(pattern, handler) {
        this.commandHandlers[pattern] = handler;
    }

    // Throttled process command to improve INP
    throttledProcessCommand(command) {
        clearTimeout(this.commandThrottle);
        this.commandThrottle = setTimeout(() => this.processCommand(command), 50);
    }
    
    // Throttled speak function to improve performance
    throttledSpeak(message) {
        clearTimeout(this.speakThrottle);
        this.speakThrottle = setTimeout(() => this.speak(message), 50);
    }

    processCommand(command) {
        this.isProcessing = true;
        document.getElementById('voice-indicator').classList.add('processing');
        this.updateStatus('Processing your request...');
        
        // Check for join/coordination commands
        if (/join|connect|coordinate with|work with/.test(command.toLowerCase())) {
            this.processJoinCommand(command);
            return;
        }
        
        // Check for leave/disconnect commands
        if (/leave|disconnect|stop coordinating|end coordination/.test(command.toLowerCase())) {
            this.processLeaveCommand(command);
            return;
        }
        
        // Enhanced disaster recognition for India-specific disasters
        const disasterMapping = {
            // Fire disasters
            'fire': { type: 'fire', responseType: 'fire' },
            'burning': { type: 'fire', responseType: 'fire' },
            'blaze': { type: 'fire', responseType: 'fire' },
            'wildfire': { type: 'fire', responseType: 'fire' },
            'forest fire': { type: 'fire', responseType: 'fire' },
            
            // Water disasters
            'flood': { type: 'flood', responseType: 'flood' },
            'flooding': { type: 'flood', responseType: 'flood' },
            'flash flood': { type: 'flood', responseType: 'flood' },
            'water logging': { type: 'flood', responseType: 'flood' },
            
            // Earthquake
            'earthquake': { type: 'earthquake', responseType: 'disaster' },
            'quake': { type: 'earthquake', responseType: 'disaster' },
            'tremor': { type: 'earthquake', responseType: 'disaster' },
            'seismic': { type: 'earthquake', responseType: 'disaster' },
            
            // Cyclone
            'cyclone': { type: 'cyclone', responseType: 'disaster' },
            'hurricane': { type: 'cyclone', responseType: 'disaster' },
            'storm': { type: 'cyclone', responseType: 'disaster' },
            'typhoon': { type: 'cyclone', responseType: 'disaster' },
            
            // Landslide
            'landslide': { type: 'landslide', responseType: 'disaster' },
            'mudslide': { type: 'landslide', responseType: 'disaster' },
            'rockslide': { type: 'landslide', responseType: 'disaster' },
            'landslip': { type: 'landslide', responseType: 'disaster' },
            
            // Drought
            'drought': { type: 'drought', responseType: 'disaster' },
            'water shortage': { type: 'drought', responseType: 'disaster' },
            'famine': { type: 'drought', responseType: 'disaster' },
            
            // Tsunami
            'tsunami': { type: 'tsunami', responseType: 'flood' },
            'tidal wave': { type: 'tsunami', responseType: 'flood' },
            
            // Weather extremes
            'heatwave': { type: 'heatwave', responseType: 'medical' },
            'heat wave': { type: 'heatwave', responseType: 'medical' },
            'coldwave': { type: 'coldwave', responseType: 'medical' },
            'cold wave': { type: 'coldwave', responseType: 'medical' },
            'frost': { type: 'coldwave', responseType: 'medical' },
            
            // Health related
            'epidemic': { type: 'epidemic', responseType: 'medical' },
            'outbreak': { type: 'epidemic', responseType: 'medical' },
            'pandemic': { type: 'epidemic', responseType: 'medical' },
            'virus': { type: 'epidemic', responseType: 'medical' },
            
            // Chemical/Industrial
            'chemical': { type: 'chemical', responseType: 'chemical' },
            'toxic': { type: 'chemical', responseType: 'chemical' },
            'leak': { type: 'chemical', responseType: 'chemical' },
            'industrial': { type: 'industrial', responseType: 'fire' },
            'factory': { type: 'industrial', responseType: 'fire' },
            'radiation': { type: 'chemical', responseType: 'chemical' },
            
            // Human crowd
            'stampede': { type: 'stampede', responseType: 'medical' },
            'crowd crush': { type: 'stampede', responseType: 'medical' },
            'riot': { type: 'stampede', responseType: 'police' },
            
            // Medical emergencies
            'medical': { type: 'medical', responseType: 'medical' },
            'injury': { type: 'medical', responseType: 'medical' },
            'accident': { type: 'medical', responseType: 'medical' },
            'heart attack': { type: 'medical', responseType: 'medical' },
            'emergency': { type: 'medical', responseType: 'medical' }
        };
        
        // Emergency service keywords mapping
        const emergencyServiceMapping = {
            // Fire services
            'fire brigade': { type: 'fire', vehicle: 'firetruck' },
            'fire truck': { type: 'fire', vehicle: 'firetruck' },
            'fire engine': { type: 'fire', vehicle: 'firetruck' },
            'fire department': { type: 'fire', vehicle: 'firetruck' },
            'firefighters': { type: 'fire', vehicle: 'firetruck' },
            
            // Medical services
            'ambulance': { type: 'medical', vehicle: 'ambulance' },
            'paramedic': { type: 'medical', vehicle: 'ambulance' },
            'medical team': { type: 'medical', vehicle: 'ambulance' },
            'doctor': { type: 'medical', vehicle: 'ambulance' },
            'hospital': { type: 'medical', vehicle: 'ambulance' },
            
            // Police services
            'police': { type: 'police', vehicle: 'police' },
            'cops': { type: 'police', vehicle: 'police' },
            'security force': { type: 'police', vehicle: 'police' },
            
            // Disaster response
            'ndrf': { type: 'disaster', vehicle: 'disaster' },
            'disaster team': { type: 'disaster', vehicle: 'disaster' },
            'rescue team': { type: 'disaster', vehicle: 'disaster' },
            'relief team': { type: 'disaster', vehicle: 'disaster' },
            
            // Water rescue
            'boat': { type: 'flood', vehicle: 'boat' },
            'rescue boat': { type: 'flood', vehicle: 'boat' },
            'navy': { type: 'flood', vehicle: 'boat' },
            
            // Air rescue
            'helicopter': { type: 'disaster', vehicle: 'helicopter' },
            'air ambulance': { type: 'disaster', vehicle: 'helicopter' },
            'air lift': { type: 'disaster', vehicle: 'helicopter' }
        };
        
        // Detect disaster and need keywords
        const needKeywords = ['need', 'required', 'wanted', 'send', 'dispatch', 'deploy', 'help', 'rescue', 'assist', 'emergency', 'immediate'];
        
        // Process the command - first check if it's a request for emergency services
        let requestedService = null;
        let locationName = null;
        let disasterType = null;
        
        // Check for direct emergency service request
        for (const [keyword, details] of Object.entries(emergencyServiceMapping)) {
            if (command.toLowerCase().includes(keyword)) {
                requestedService = {...details, keyword};
                break;
            }
        }
        
        // If no direct service request, check for disaster type
        if (!requestedService) {
            for (const [keyword, details] of Object.entries(disasterMapping)) {
                if (command.toLowerCase().includes(keyword)) {
                    disasterType = {...details, keyword};
                    break;
                }
            }
        }
        
        // Extract location from command
        for (const prep of ['in', 'at', 'near', 'around', 'by']) {
            const pattern = new RegExp(`${prep}\\s+([\\w\\s]+)(?:\\s|$)`, 'i');
            const match = command.match(pattern);
            if (match && match[1]) {
                locationName = match[1].trim();
                break;
            }
        }
        
        // If still no location, try to extract from the end of the command
        if (!locationName) {
            const words = command.split(' ');
            if (words.length >= 2) {
                // Try the last 2-3 words as potential location
                locationName = words.slice(-Math.min(3, words.length)).join(' ');
            }
        }
        
        // Now process the command based on what we found
        if (requestedService && locationName) {
            // User requested specific emergency service
            this.updateStatus(`Dispatching ${requestedService.keyword} to ${locationName}...`);
            
            this.displayEmergencyService(requestedService.type, requestedService.vehicle, locationName)
                .then(result => {
                    if (result.success) {
                        this.speak(`${requestedService.keyword} dispatched to ${locationName}`);
                        this.logCommand(`Dispatched ${requestedService.keyword} to ${locationName}`);
                    } else {
                        this.speak(`Could not dispatch ${requestedService.keyword} to ${locationName}. ${result.message}`);
                        this.logCommand(`Error: ${result.message}`);
                    }
                    
                    this.endProcessing();
                });
            
            return;
        }
        else if (disasterType && locationName) {
            // User reported a disaster
            const isNeedPresent = needKeywords.some(keyword => command.toLowerCase().includes(keyword));
            
            if (isNeedPresent) {
                // They need help for this disaster
                const serviceType = this.getAppropriateServiceType(disasterType.type);
                this.updateStatus(`Deploying ${serviceType} teams for ${disasterType.type} in ${locationName}...`);
                
                this.displayDisasterWithResponse(disasterType.type, locationName)
                    .then(result => {
                        if (result.success) {
                            this.speak(`Response teams dispatched to handle the ${disasterType.keyword} in ${locationName}`);
                            this.logCommand(`Emergency response sent for ${disasterType.type} in ${locationName}`);
                        } else {
                            this.speak(`Could not process emergency response for ${locationName}. ${result.message}`);
                            this.logCommand(`Error: ${result.message}`);
                        }
                        
                        this.endProcessing();
                    });
            } else {
                // They're just reporting a disaster
                this.updateStatus(`Recording ${disasterType.type} alert in ${locationName}...`);
                
                this.displayDisaster(disasterType.type, locationName)
                    .then(result => {
                        if (result.success) {
                            this.speak(`${disasterType.type} alert recorded for ${locationName}`);
                            this.logCommand(`Alert recorded: ${disasterType.type} in ${locationName}`);
                        } else {
                            this.speak(`Could not record alert for ${locationName}. ${result.message}`);
                            this.logCommand(`Error: ${result.message}`);
                        }
                        
                        this.endProcessing();
                    });
            }
            
            return;
        }
        
        // Command not understood
        this.speak("I didn't understand that command. Please specify the type of emergency and location, for example, 'Fire in Delhi' or 'Need ambulance in Mumbai'.");
        this.logCommand("Command not recognized: " + command);
        this.endProcessing();
    }
    
    /**
     * Process commands to join with agencies
     */
    processJoinCommand(command) {
        // Extract agency name or type
        const agencyMatches = command.match(/with\s+([a-z\s]+)(?:\s+in|near|at|for|$)/i);
        let agencyIdentifier = null;
        
        if (agencyMatches && agencyMatches[1]) {
            agencyIdentifier = agencyMatches[1].trim();
        }
        
        // Extract location
        let locationName = null;
        for (const prep of ['in', 'at', 'near', 'around']) {
            const pattern = new RegExp(`${prep}\\s+([\\w\\s]+)(?:\\s|$)`, 'i');
            const match = command.match(pattern);
            if (match && match[1]) {
                locationName = match[1].trim();
                break;
            }
        }
        
        if (agencyIdentifier) {
            // Join with specific agency
            this.updateStatus(`Connecting with ${agencyIdentifier}...`);
            
            this.joinWithAgency(agencyIdentifier, locationName)
                .then(result => {
                    if (result.success) {
                        this.speak(result.message);
                        this.logCommand(result.message);
                    } else {
                        this.speak(`Could not connect with ${agencyIdentifier}. ${result.message}`);
                        this.logCommand(`Failed to connect: ${result.message}`);
                    }
                    
                    this.endProcessing();
                });
        } else if (locationName) {
            // Join with nearby agencies at location
            this.updateStatus(`Connecting with agencies near ${locationName}...`);
            
            this.joinWithNearbyAgencies(locationName)
                .then(result => {
                    if (result.success) {
                        this.speak(result.message);
                        this.logCommand(result.message);
                    } else {
                        this.speak(`Could not connect with agencies near ${locationName}. ${result.message}`);
                        this.logCommand(`Failed to connect: ${result.message}`);
                    }
                    
                    this.endProcessing();
                });
        } else {
            this.speak("Please specify which agency to connect with or a location for nearby agencies.");
            this.endProcessing();
        }
    }
    
    /**
     * Process commands to leave coordination
     */
    processLeaveCommand(command) {
        // Extract agency name
        const agencyMatches = command.match(/(?:leave|disconnect from|stop coordinating with)\s+([a-z\s]+)(?:\s|$)/i);
        let agencyIdentifier = null;
        
        if (agencyMatches && agencyMatches[1]) {
            agencyIdentifier = agencyMatches[1].trim();
        }
        
        if (agencyIdentifier) {
            // Leave specific agency
            this.updateStatus(`Disconnecting from ${agencyIdentifier}...`);
            
            const agency = window.app.agencyManager.joinedAgencies.find(a => 
                a.name.toLowerCase().includes(agencyIdentifier.toLowerCase())
            );
            
            if (agency) {
                const success = window.app.agencyManager.leaveAgency(agency.id);
                if (success) {
                    window.app.mapController.removeAgencyConnection(agency.id);
                    this.speak(`Disconnected from ${agency.name}`);
                    this.logCommand(`Disconnected from ${agency.name}`);
                } else {
                    this.speak(`Could not disconnect from ${agencyIdentifier}`);
                    this.logCommand(`Failed to disconnect from ${agencyIdentifier}`);
                }
            } else {
                this.speak(`You are not connected with ${agencyIdentifier}`);
                this.logCommand(`Not connected with ${agencyIdentifier}`);
            }
        } else if (/leave all|disconnect all|end all|stop all coordination/.test(command.toLowerCase())) {
            // Leave all agencies
            this.updateStatus('Ending all coordination...');
            
            const success = window.app.agencyManager.endCurrentCoordination();
            if (success) {
                // Remove all connections from map
                for (const agency of window.app.agencyManager.joinedAgencies) {
                    window.app.mapController.removeAgencyConnection(agency.id);
                }
                
                this.speak('All agency coordination ended');
                this.logCommand('All agency coordination ended');
            } else {
                this.speak('No active coordination to end');
                this.logCommand('No active coordination');
            }
        } else {
            this.speak("Please specify which agency to disconnect from or say 'leave all' to end all coordination.");
        }
        
        this.endProcessing();
    }
    
    /**
     * Join with a specific agency
     */
    async joinWithAgency(agencyIdentifier, locationName) {
        try {
            const app = window.app;
            if (!app || !app.agencyManager || !app.mapController) {
                return { success: false, message: "Application not initialized" };
            }
            
            // Find agency by name or type
            let agency = null;
            
            for (const a of app.agencyManager.agencies) {
                if (a.name.toLowerCase().includes(agencyIdentifier.toLowerCase()) || 
                    a.type.toLowerCase() === agencyIdentifier.toLowerCase()) {
                    agency = a;
                    break;
                }
            }
            
            if (!agency) {
                return { success: false, message: `Could not find agency: ${agencyIdentifier}` };
            }
            
            // Get location coordinates
            let coords;
            if (locationName) {
                coords = app.mapController.getCoordinatesForLocation(locationName);
                if (!coords) {
                    return { success: false, message: `Could not find location: ${locationName}` };
                }
            } else {
                // Use map center if no location specified
                const center = app.mapController.map.getCenter();
                coords = { lat: center.lat, lng: center.lng };
                locationName = "current location";
            }
            
            // Join with the agency
            const result = app.agencyManager.joinAgency(agency, 'coordination', coords);
            
            if (result.success) {
                // Show connection on map
                app.mapController.showAgencyConnection(agency, coords);
                return { success: true, message: `Connected with ${agency.name}` };
            } else {
                return result;
            }
        } catch (error) {
            console.error('Error joining agency:', error);
            return { success: false, message: error.message || "An error occurred" };
        }
    }
    
    /**
     * Join with nearby agencies at a location
     */
    async joinWithNearbyAgencies(locationName) {
        try {
            const app = window.app;
            if (!app || !app.agencyManager || !app.mapController) {
                return { success: false, message: "Application not initialized" };
            }
            
            // Get location coordinates
            const coords = app.mapController.getCoordinatesForLocation(locationName);
            if (!coords) {
                return { success: false, message: `Could not find location: ${locationName}` };
            }
            
            // Find nearby agencies
            const nearbyAgencies = app.agencyManager.findNearbyAgencies(coords, null, 30);
            
            if (nearbyAgencies.length === 0) {
                return { success: false, message: `No agencies found near ${locationName}` };
            }
            
            // Join with up to 3 closest agencies
            const agenciesToJoin = nearbyAgencies.slice(0, 3);
            let joinedCount = 0;
            
            for (const agency of agenciesToJoin) {
                const result = app.agencyManager.joinAgency(agency, 'coordination', coords);
                
                if (result.success) {
                    app.mapController.showAgencyConnection(agency, coords);
                    joinedCount++;
                }
            }
            
            if (joinedCount > 0) {
                return { 
                    success: true, 
                    message: `Connected with ${joinedCount} agencies near ${locationName}` 
                };
            } else {
                return { success: false, message: "Could not connect with any agencies" };
            }
        } catch (error) {
            console.error('Error joining nearby agencies:', error);
            return { success: false, message: error.message || "An error occurred" };
        }
    }
    
    /**
     * End the command processing state
     */
    endProcessing() {
        setTimeout(() => {
            this.isProcessing = false;
            document.getElementById('voice-indicator').classList.remove('processing');
            this.updateStatus('Click microphone to activate');
        }, 1000);
    }
    
    /**
     * Get appropriate service type for a disaster
     */
    getAppropriateServiceType(disasterType) {
        switch(disasterType) {
            case 'fire': return 'fire brigade';
            case 'flood': return 'rescue boats';
            case 'medical': return 'medical';
            case 'earthquake': return 'NDRF';
            case 'cyclone': return 'disaster response';
            case 'landslide': return 'rescue';
            case 'chemical': return 'hazmat';
            default: return 'emergency';
        }
    }
    
    /**
     * Display a disaster on the map
     */
    async displayDisaster(disasterType, locationName) {
        try {
            const mapController = window.app.mapController;
            if (!mapController) return { success: false, message: "Map not initialized" };
            
            const coords = mapController.getCoordinatesForLocation(locationName);
            if (!coords) return { success: false, message: `Could not find location: ${locationName}` };
            
            const alertId = `alert-${disasterType}-${Date.now()}`;
            const added = mapController.addAlert(alertId, coords, disasterType, `${disasterType.toUpperCase()} reported`);
            
            return { success: added };
        } catch (error) {
            console.error('Error displaying disaster:', error);
            return { success: false, message: error.message };
        }
    }
    
    /**
     * Display a disaster with emergency response
     */
    async displayDisasterWithResponse(disasterType, locationName) {
        try {
            // First add the disaster marker
            const result = await this.displayDisaster(disasterType, locationName);
            if (!result.success) return result;
            
            // Then dispatch appropriate emergency vehicles
            const mapController = window.app.mapController;
            const coords = mapController.getCoordinatesForLocation(locationName);
            
            // Get response type for this disaster
            const responseType = mapController.getResponseTypeForDisaster(disasterType);
            
            // Add appropriate vehicles
            const vehicleCount = disasterType === 'earthquake' || disasterType === 'cyclone' ? 5 : 3;
            
            for (let i = 1; i <= vehicleCount; i++) {
                const vehicleType = this.getVehicleTypeForDisaster(disasterType, i);
                mapController.addEmergencyVehicle(`vehicle-${disasterType}-${Date.now()}-${i}`, coords, vehicleType);
            }
            
            return { success: true };
        } catch (error) {
            console.error('Error displaying disaster with response:', error);
            return { success: false, message: error.message };
        }
    }
    
    /**
     * Get appropriate vehicle type based on disaster and sequence
     */
    getVehicleTypeForDisaster(disasterType, index) {
        switch(disasterType) {
            case 'fire':
                return index <= 3 ? 'firetruck' : 'ambulance';
            case 'flood':
                return index <= 2 ? 'boat' : (index === 3 ? 'disaster' : 'ambulance');
            case 'earthquake':
            case 'landslide':
                return index === 1 ? 'disaster' : (index === 2 ? 'helicopter' : (index <= 4 ? 'ambulance' : 'police'));
            case 'cyclone':
                return index === 1 ? 'helicopter' : (index <= 3 ? 'disaster' : 'ambulance');
            case 'medical':
                return index === 1 ? 'ambulance' : 'police';
            case 'chemical':
                return index <= 2 ? 'disaster' : 'ambulance';
            default:
                return index % 3 === 0 ? 'ambulance' : (index % 2 === 0 ? 'disaster' : 'police');
        }
    }

    /**
     * Display emergency service vehicles on the map
     * @param {string} serviceType - Type of service (fire, medical, etc.)
     * @param {string} vehicleType - Type of vehicle to display
     * @param {string} location - Location name
     * @returns {Promise<Object>} - Result with success status
     */
    async displayEmergencyService(serviceType, vehicleType, location) {
        try {
            const mapController = window.app.mapController;
            if (!mapController) {
                return { success: false, message: "Map controller not initialized" };
            }
            
            const coords = mapController.getCoordinatesForLocation(location);
            if (!coords) {
                return { success: false, message: `Could not find location: ${location}` };
            }
            
            const serviceId = `service-${serviceType}-${Date.now()}`;
            
            const vehicleCount = serviceType === 'fire' ? 3 : 
                              serviceType === 'disaster' ? 4 : 
                              serviceType === 'medical' ? 1 : 2;
            
            for (let i = 1; i <= vehicleCount; i++) {
                mapController.addEmergencyVehicle(serviceId + `-${i}`, coords, vehicleType);
            }
            
            const markerDetails = `${serviceType.toUpperCase()} SERVICE REQUESTED`;
            mapController.addServiceMarker(serviceId, coords, serviceType, markerDetails);
            
            return { success: true };
            
        } catch (error) {
            console.error("Error displaying emergency service:", error);
            return { success: false, message: "Error displaying emergency service" };
        }
    }

    speak(message) {
        window.speechSynthesis.cancel();
        
        const speech = new SpeechSynthesisUtterance(message);
        speech.volume = 1;
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    }

    updateStatus(message) {
        requestAnimationFrame(() => {
            document.getElementById('status-text').textContent = message;
        });
    }

    logCommand(message) {
        requestAnimationFrame(() => {
            const logElement = document.getElementById('command-log');
            const entry = document.createElement('div');
            entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
            logElement.appendChild(entry);
            
            logElement.scrollTop = logElement.scrollHeight;
            
            while (logElement.children.length > 10) {
                logElement.removeChild(logElement.firstChild);
            }
        });
    }
}
