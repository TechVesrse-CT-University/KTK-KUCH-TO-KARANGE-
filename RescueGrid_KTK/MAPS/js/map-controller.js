class MapController {
    constructor() {
        this.map = null;
        this.markers = {};
        this.connections = {}; // Store connection lines between agencies
        this.sectors = {
            'sector 1': { lat: 31.5204, lng: 74.3587 }, // Lahore
            'sector 2': { lat: 31.5704, lng: 74.4087 },
            'sector 3': { lat: 31.6204, lng: 74.3087 },
            'sector 4': { lat: 31.4704, lng: 74.3087 },
            'sector 5': { lat: 31.5204, lng: 74.2587 },
            'sector 6': { lat: 31.4704, lng: 74.4087 },
            'sector 7': { lat: 31.5704, lng: 74.2587 }
        };
        this.regions = {
            'punjab': { lat: 31.1704, lng: 75.3402 },
            'sindh': { lat: 25.8943, lng: 68.5247 },
            'balochistan': { lat: 28.4907, lng: 65.0953 },
            'khyber pakhtunkhwa': { lat: 34.9526, lng: 72.3311 }
        };
        this.states = {
            'punjab': { lat: 31.1704, lng: 75.3402 },
            'sindh': { lat: 25.8943, lng: 68.5247 },
            'balochistan': { lat: 28.4907, lng: 65.0953 },
            'khyber': { lat: 34.9526, lng: 72.3311 },
            'kashmir': { lat: 34.2259, lng: 75.7746 },
            'rajasthan': { lat: 26.9124, lng: 75.7873 },
            'gujarat': { lat: 22.2587, lng: 71.1924 },
            'maharashtra': { lat: 19.7515, lng: 75.7139 },
            'telangana': { lat: 17.8495, lng: 79.1151 },
            'karnataka': { lat: 15.3173, lng: 75.7139 },
            'tamil nadu': { lat: 11.1271, lng: 78.6569 },
            'bihar': { lat: 25.0961, lng: 85.3131 },
            'uttar pradesh': { lat: 26.8467, lng: 80.9462 },
            'madhya pradesh': { lat: 22.9734, lng: 78.6569 }
        };
        this.cities = {
            'jalandhar': { lat: 31.3260, lng: 75.5762 },
            'amritsar': { lat: 31.6340, lng: 74.8723 },
            'ludhiana': { lat: 30.9010, lng: 75.8573 },
            'chandigarh': { lat: 30.7333, lng: 76.7794 },
            'delhi': { lat: 28.7041, lng: 77.1025 },
            'mumbai': { lat: 19.0760, lng: 72.8777 },
            'kolkata': { lat: 22.5726, lng: 88.3639 },
            'chennai': { lat: 13.0827, lng: 80.2707 }
        };
        this.three = {}; // For storing Three.js objects
        this.locations = {
            // Major cities
            'delhi': { lat: 28.7041, lng: 77.1025 },
            'new delhi': { lat: 28.6139, lng: 77.2090 },
            'mumbai': { lat: 19.0760, lng: 72.8777 },
            'chennai': { lat: 13.0827, lng: 80.2707 },
            'kolkata': { lat: 22.5726, lng: 88.3639 },
            'bangalore': { lat: 12.9716, lng: 77.5946 },
            'hyderabad': { lat: 17.3850, lng: 78.4867 },
            'ahmedabad': { lat: 23.0225, lng: 72.5714 },
            'pune': { lat: 18.5204, lng: 73.8567 },
            'jaipur': { lat: 26.9124, lng: 75.7873 },
            
            // Punjab Region
            'punjab': { lat: 31.1471, lng: 75.3412 },
            'chandigarh': { lat: 30.7333, lng: 76.7794 },
            'amritsar': { lat: 31.6340, lng: 74.8723 },
            'ludhiana': { lat: 30.9010, lng: 75.8573 },
            'jalandhar': { lat: 31.3260, lng: 75.5762 },
            'patiala': { lat: 30.3398, lng: 76.3869 },
            'bathinda': { lat: 30.2110, lng: 74.9455 },
            'pathankot': { lat: 32.2643, lng: 75.6393 },
            
            // North India
            'shimla': { lat: 31.1048, lng: 77.1734 },
            'manali': { lat: 32.2432, lng: 77.1892 },
            'dehradun': { lat: 30.3165, lng: 78.0322 },
            'rishikesh': { lat: 30.1087, lng: 78.2946 },
            'haridwar': { lat: 29.9457, lng: 78.1642 },
            'srinagar': { lat: 34.0837, lng: 74.7973 },
            'leh': { lat: 34.1526, lng: 77.5771 },
            'jammu': { lat: 32.7266, lng: 74.8570 },
            'lucknow': { lat: 26.8467, lng: 80.9462 },
            
            // East India
            'patna': { lat: 25.5941, lng: 85.1376 },
            'ranchi': { lat: 23.3441, lng: 85.3096 },
            'guwahati': { lat: 26.1445, lng: 91.7362 },
            'bhubaneswar': { lat: 20.2961, lng: 85.8245 },
            'cuttack': { lat: 20.4625, lng: 85.8830 },
            'siliguri': { lat: 26.7271, lng: 88.3953 },
            'gangtok': { lat: 27.3389, lng: 88.6065 },
            'darjeeling': { lat: 27.0410, lng: 88.2663 },
            
            // West India
            'surat': { lat: 21.1702, lng: 72.8311 },
            'vadodara': { lat: 22.3072, lng: 73.1812 },
            'rajkot': { lat: 22.3039, lng: 70.8022 },
            'nagpur': { lat: 21.1458, lng: 79.0882 },
            'nashik': { lat: 19.9975, lng: 73.7898 },
            'goa': { lat: 15.2993, lng: 74.1240 },
            'panaji': { lat: 15.4909, lng: 73.8278 },
            
            // South India
            'kochi': { lat: 9.9312, lng: 76.2673 },
            'thiruvananthapuram': { lat: 8.5241, lng: 76.9366 },
            'coimbatore': { lat: 11.0168, lng: 76.9558 },
            'madurai': { lat: 9.9252, lng: 78.1198 },
            'visakhapatnam': { lat: 17.6868, lng: 83.2185 },
            'vijayawada': { lat: 16.5062, lng: 80.6480 },
            'mysore': { lat: 12.2958, lng: 76.6394 },
            
            // Central India
            'bhopal': { lat: 23.2599, lng: 77.4126 },
            'indore': { lat: 22.7196, lng: 75.8577 },
            'jabalpur': { lat: 23.1815, lng: 79.9864 },
            'raipur': { lat: 21.2514, lng: 81.6296 },
            
            // States
            'uttar pradesh': { lat: 26.8467, lng: 80.9462 },
            'maharashtra': { lat: 19.7515, lng: 75.7139 },
            'bihar': { lat: 25.0961, lng: 85.3131 },
            'west bengal': { lat: 22.9868, lng: 87.8550 },
            'madhya pradesh': { lat: 22.9734, lng: 78.6569 },
            'tamil nadu': { lat: 11.1271, lng: 78.6569 },
            'rajasthan': { lat: 27.0238, lng: 74.2179 },
            'karnataka': { lat: 15.3173, lng: 75.7139 },
            'gujarat': { lat: 22.2587, lng: 71.1924 },
            'andhra pradesh': { lat: 15.9129, lng: 79.7400 },
            'odisha': { lat: 20.9517, lng: 85.0985 },
            'telangana': { lat: 18.1124, lng: 79.0193 },
            'kerala': { lat: 10.8505, lng: 76.2711 },
            'jharkhand': { lat: 23.6102, lng: 85.2799 },
            'assam': { lat: 26.2006, lng: 92.9376 },
            'himachal pradesh': { lat: 31.1048, lng: 77.1734 },
            'uttarakhand': { lat: 30.0668, lng: 79.0193 },
            'goa state': { lat: 15.2993, lng: 74.1240 }
        };
        this.disasterIcons = {
            fire: { emoji: '🔥', color: '#FF4136', label: 'Fire' },
            flood: { emoji: '🌊', color: '#0074D9', label: 'Flood' },
            earthquake: { emoji: '🏚️', color: '#85144b', label: 'Earthquake' },
            medical: { emoji: '🩺', color: '#2ECC40', label: 'Medical' },
            chemical: { emoji: '☣️', color: '#FFDC00', label: 'Chemical' },
            cyclone: { emoji: '🌪️', color: '#7FDBFF', label: 'Cyclone' },
            landslide: { emoji: '⛰️', color: '#B10DC9', label: 'Landslide' },
            tsunami: { emoji: '🌊', color: '#001f3f', label: 'Tsunami' },
            drought: { emoji: '☀️', color: '#FF851B', label: 'Drought' },
            heatwave: { emoji: '🌡️', color: '#FF4136', label: 'Heat Wave' },
            coldwave: { emoji: '❄️', color: '#39CCCC', label: 'Cold Wave' },
            epidemic: { emoji: '🦠', color: '#2ECC40', label: 'Epidemic' },
            industrial: { emoji: '🏭', color: '#AAAAAA', label: 'Industrial' },
            stampede: { emoji: '👥', color: '#F012BE', label: 'Stampede' }
        };
        this.vehicleIcons = {
            'firetruck': { emoji: '🚒', color: '#FF4136', label: 'Fire Truck' },
            'ambulance': { emoji: '🚑', color: '#2ECC40', label: 'Ambulance' },
            'police': { emoji: '🚓', color: '#001f3f', label: 'Police Car' },
            'boat': { emoji: '🚤', color: '#0074D9', label: 'Rescue Boat' },
            'helicopter': { emoji: '🚁', color: '#FF851B', label: 'Helicopter' },
            'disaster': { emoji: '🚛', color: '#B10DC9', label: 'Disaster Response' }
        };
        this.serviceMarkers = {
            'fire': { emoji: '🔥', color: '#FF4136', label: 'Fire Emergency' },
            'medical': { emoji: '🏥', color: '#2ECC40', label: 'Medical Emergency' },
            'police': { emoji: '🚨', color: '#001f3f', label: 'Police Emergency' },
            'flood': { emoji: '💧', color: '#0074D9', label: 'Flood Emergency' },
            'disaster': { emoji: '⚠️', color: '#FF851B', label: 'Disaster Emergency' }
        };
        this.initMap();
        this.initThreeJsLayer();
    }

    initMap() {
        // Initialize the map with better performance settings
        this.map = L.map('map', {
            preferCanvas: true, // Use canvas renderer for better performance
            updateWhenZooming: false, // Delay updating until zoom ends
            updateWhenIdle: true, // Only update when map is idle
            maxZoom: 18
        }).setView([30.3753, 69.3451], 6);

        // Add OpenStreetMap tile layer with better performance options
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: ['a', 'b', 'c'], // Use multiple subdomains to help with concurrent requests
            minZoom: 4,
            maxZoom: 18,
            updateWhenIdle: true
        }).addTo(this.map);

        // Add event listeners
        this.map.on('zoomend', () => this.adjustMarkerSizes());
    }

    initThreeJsLayer() {
        // Initialize Three.js for 3D markers
        this.three.scene = new THREE.Scene();
        this.three.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.three.renderer = new THREE.WebGLRenderer({ alpha: true });
        this.three.loader = new THREE.GLTFLoader();
        this.three.models = {};

        // Load 3D models for reuse
        this.preloadModels();
    }

    preloadModels() {
        // Simulate loading by creating placeholders
        console.log("Preloading 3D models...");
        console.log("3D models preloaded");
    }

    /**
     * Add an alert marker with proper icon
     */
    addAlert(id, location, type, customDetails) {
        // Remove existing marker if any
        if (this.markers[id]) {
            this.map.removeLayer(this.markers[id]);
        }

        // Get coordinates for the location
        let coords = typeof location === 'string' ? 
            this.getCoordinatesForLocation(location) : 
            location;

        if (!coords) {
            console.error(`Location not found: ${location}`);
            return false;
        }
        
        // Get icon configuration based on disaster type
        const iconConfig = this.disasterIcons[type] || this.disasterIcons.fire;
        
        // Create a custom icon with 3D-like appearance
        const customIcon = L.divIcon({
            className: 'custom-marker-icon',
            html: `<div class="marker-3d disaster" style="background-color: ${iconConfig.color}">
                <span class="icon-emoji">${iconConfig.emoji}</span>
                <span class="icon-label">${iconConfig.label}</span>
            </div>`,
            iconSize: [60, 60],
            iconAnchor: [30, 30]
        });
        
        // Create and add the marker
        this.markers[id] = L.marker([coords.lat, coords.lng], { 
            icon: customIcon,
            title: `${iconConfig.label} Alert: ${customDetails || 'Emergency'}`,
            alt: type,
            riseOnHover: true
        })
            .addTo(this.map)
            .bindPopup(`
                <div class="p-2">
                    <h3 class="text-lg font-bold text-${this.getColorClass(type)}-600">${iconConfig.label.toUpperCase()} ALERT</h3>
                    <p class="mt-1 text-gray-700">${customDetails || 'Emergency response needed'}</p>
                    <p class="mt-2 text-sm text-gray-500">Location: ${typeof location === 'string' ? location : 'Coordinates'}</p>
                    <button id="respond-btn-${id}" class="mt-2 bg-blue-600 text-white text-sm py-1 px-3 rounded hover:bg-blue-700 focus:outline-none">
                        Send Response Teams
                    </button>
                </div>
            `, { 
                maxWidth: 300,
                className: 'disaster-popup'
            });
        
        // Add event listeners
        this.markers[id].on('popupopen', () => {
            setTimeout(() => {
                const respondBtn = document.getElementById(`respond-btn-${id}`);
                if (respondBtn) {
                    respondBtn.addEventListener('click', () => {
                        this.dispatchResponseTeams(coords, type);
                    });
                }
            }, 100);
        });
        
        // Pan to the new marker and zoom appropriately
        this.map.setView([coords.lat, coords.lng], 10, { animate: true });
        
        // Show a notification for the new disaster alert
        this.showNotification(`${iconConfig.label} alert reported in ${typeof location === 'string' ? location : 'the area'}`);

        return true;
    }

    /**
     * Display a notification to the user
     */
    showNotification(message, isError = false) {
        const notificationArea = document.getElementById('notification-area');
        const notification = document.createElement('div');
        
        notification.className = `flex items-center p-3 mb-3 rounded-lg shadow-lg ${isError ? 'bg-red-500' : 'bg-blue-600'} text-white`;
        
        notification.innerHTML = `
            <div class="mr-3 text-xl">
                ${isError ? '⚠️' : '📢'}
            </div>
            <div class="flex-grow">${message}</div>
            <button class="ml-2 text-white hover:text-gray-200 focus:outline-none">
                &times;
            </button>
        `;
        
        // Add close button functionality
        const closeBtn = notification.querySelector('button');
        closeBtn.addEventListener('click', () => {
            notification.classList.add('notification-hide');
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        notificationArea.appendChild(notification);
        
        // Play notification sound
        this.playNotificationSound(isError);
        
        // Auto remove after 8 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.add('notification-hide');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 8000);
    }

    /**
     * Play a notification sound
     */
    playNotificationSound(isError = false) {
        const sound = new Audio();
        sound.src = isError ? 
            'https://assets.mixkit.co/sfx/preview/mixkit-alert-quick-chime-766.mp3' : 
            'https://assets.mixkit.co/sfx/preview/mixkit-confirmation-tone-1643.mp3';
        sound.volume = 0.5;
        sound.play().catch(err => console.log('Sound playback prevented:', err));
    }

    /**
     * Dispatch response teams to an emergency
     */
    dispatchResponseTeams(location, disasterType) {
        // Find the appropriate response teams
        const responseType = this.getResponseTypeForDisaster(disasterType);
        
        // Just show demo response vehicles for now
        this.addResponderVehicle(location, responseType, 1);
        
        if (['fire', 'chemical'].includes(disasterType)) {
            this.addResponderVehicle(location, responseType, 2);
            this.addResponderVehicle(location, responseType, 3);
        }
        
        if (['earthquake', 'flood', 'tsunami'].includes(disasterType)) {
            this.addResponderVehicle(location, 'disaster', 1);
        }
        
        // Always send medical support for any disaster
        this.addResponderVehicle(location, 'medical', 1);
        
        this.showNotification(`Response teams dispatched to the ${disasterType} emergency`);
    }

    /**
     * Add a responder vehicle to the map
     */
    addResponderVehicle(targetLocation, vehicleType, index) {
        // Generate a random starting position within reasonable distance
        const startPos = this.getRandomStartingPosition(targetLocation);
        const id = `vehicle-${vehicleType}-${Date.now()}-${index}`;
        
        // Get icon configuration
        const iconConfig = this.vehicleIcons[vehicleType] || this.vehicleIcons.disaster;
        
        // Create a vehicle icon
        const vehicleIcon = L.divIcon({
            className: 'custom-marker-icon',
            html: `<div class="marker-3d vehicle" style="background-color: ${iconConfig.color}">
                <span class="icon-emoji">${iconConfig.emoji}</span>
                <div class="vehicle-pulse"></div>
            </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 20]
        });
        
        // Add the vehicle marker
        this.markers[id] = L.marker([startPos.lat, startPos.lng], {
            icon: vehicleIcon,
            title: `${iconConfig.label} Responding`,
            alt: vehicleType,
            riseOnHover: true
        })
        .addTo(this.map)
        .bindPopup(`
            <div class="p-2">
                <h3 class="text-base font-bold">${iconConfig.label}</h3>
                <p class="text-sm text-gray-600">En route to emergency</p>
                <div class="text-xs mt-1 text-gray-500">Estimated arrival: <span class="font-bold">
                    ${Math.floor(Math.random() * 10 + 5)} minutes
                </span></div>
            </div>
        `);
        
        // Create a line showing the route
        this.markers[`${id}-route`] = L.polyline(
            [[startPos.lat, startPos.lng], [targetLocation.lat, targetLocation.lng]],
            {
                color: iconConfig.color,
                weight: 3,
                opacity: 0.6,
                dashArray: '10, 10',
                lineCap: 'round'
            }
        ).addTo(this.map);
        
        // Animate the vehicle moving toward the target
        this.animateVehicle(id, startPos, targetLocation);
    }

    /**
     * Animate a vehicle moving from start to destination
     */
    animateVehicle(id, startPos, endPos) {
        const marker = this.markers[id];
        const route = this.markers[`${id}-route`];
        
        if (!marker || !route) return;
        
        const steps = 100;
        let step = 0;
        
        const interval = setInterval(() => {
            step++;
            
            if (step >= steps) {
                clearInterval(interval);
                
                // When vehicle arrives, make it pulse once
                const element = marker.getElement();
                if (element) {
                    element.classList.add('vehicle-arrived');
                    setTimeout(() => {
                        element.classList.remove('vehicle-arrived');
                    }, 2000);
                }
                return;
            }
            
            // Calculate new position
            const ratio = step / steps;
            const lat = startPos.lat + (endPos.lat - startPos.lat) * ratio;
            const lng = startPos.lng + (endPos.lng - startPos.lng) * ratio;
            
            // Update marker position
            marker.setLatLng([lat, lng]);
            
            // Update route to show traveled path
            route.setLatLngs([
                [startPos.lat, startPos.lng],
                [lat, lng],
                [endPos.lat, endPos.lng]
            ]);
        }, 100);
    }

    /**
     * Get a random starting position for a vehicle
     */
    getRandomStartingPosition(targetPos) {
        // Generate position 2-5km away from target
        const distance = (2 + Math.random() * 3) / 111; // Convert km to degrees (approx)
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        
        return {
            lat: targetPos.lat + distance * Math.cos(angle),
            lng: targetPos.lng + distance * Math.sin(angle)
        };
    }

    /**
     * Map a disaster type to an appropriate response type
     */
    getResponseTypeForDisaster(disasterType) {
        const mapping = {
            'fire': 'fire',
            'flood': 'flood',
            'earthquake': 'disaster',
            'medical': 'medical',
            'chemical': 'chemical',
            'cyclone': 'disaster',
            'landslide': 'disaster',
            'tsunami': 'flood',
            'drought': 'disaster',
            'heatwave': 'medical',
            'coldwave': 'medical',
            'epidemic': 'medical',
            'industrial': 'fire',
            'stampede': 'medical'
        };
        return mapping[disasterType] || 'disaster';
    }

    /**
     * Get the appropriate Tailwind color class
     */
    getColorClass(type) {
        const colorMap = {
            'fire': 'red',
            'medical': 'green',
            'police': 'blue',
            'flood': 'blue',
            'disaster': 'orange',
            'earthquake': 'purple',
            'chemical': 'yellow',
            'cyclone': 'teal',
            'landslide': 'pink',
            'tsunami': 'indigo',
            'drought': 'amber',
            'heatwave': 'red',
            'coldwave': 'cyan',
            'epidemic': 'green',
            'industrial': 'gray',
            'stampede': 'fuchsia'
        };
        return colorMap[type] || 'gray';
    }

    getLocationCoordinates(location) {
        if (typeof location !== 'string') {
            return location; // If it's already coordinates object
        }

        const locationLower = location.toLowerCase();

        if (this.sectors && this.sectors[locationLower]) {
            return this.sectors[locationLower];
        } else if (this.regions && this.regions[locationLower]) {
            return this.regions[locationLower];
        } else if (this.states && this.states[locationLower]) {
            return this.states[locationLower];
        } else if (this.cities && this.cities[locationLower]) {
            return this.cities[locationLower];
        }

        for (const key of Object.keys(this.cities || {})) {
            if (key.includes(locationLower) || locationLower.includes(key)) {
                return this.cities[key];
            }
        }

        for (const key of Object.keys(this.states || {})) {
            if (key.includes(locationLower) || locationLower.includes(key)) {
                return this.states[key];
            }
        }

        return null;
    }

    /**
     * Get coordinates for a given location name.
     * @param {string} location - The name of the location.
     * @returns {Object|null} - The coordinates { lat, lng } or null if not found.
     */
    getCoordinatesForLocation(location) {
        if (!location || typeof location !== 'string') {
            console.error('Invalid location provided:', location);
            return null;
        }

        const locationKey = location.toLowerCase();
        const coordinates = this.locations[locationKey];

        if (!coordinates) {
            console.error(`Coordinates not found for location: ${location}`);
            return null;
        }

        return coordinates;
    }

    adjustMarkerSizes() {
        const zoom = this.map.getZoom();
        const basicSize = Math.max(20, Math.min(40, zoom * 4)); // Scale between 20-40px

        Object.values(this.markers).forEach(marker => {
            const element = marker.getElement();
            if (!element) return;

            const iconDiv = element.querySelector('.marker-3d');
            if (iconDiv) {
                const isAlert = marker._popup && marker._popup._content.includes('ALERT');
                const size = isAlert ? basicSize : basicSize * 0.75;

                iconDiv.style.width = `${size}px`;
                iconDiv.style.height = `${size}px`;
                iconDiv.style.fontSize = `${size * 0.5}px`;
            }
        });
    }

    showAlertsInSector(sector) {
        const sectorLower = sector.toLowerCase();
        if (!this.sectors[sectorLower]) {
            return false;
        }

        this.map.setView([this.sectors[sectorLower].lat, this.sectors[sectorLower].lng], 13);
        return true;
    }

    showRegion(region) {
        const regionLower = region.toLowerCase();
        if (!this.regions[regionLower]) {
            return false;
        }

        this.map.setView([this.regions[regionLower].lat, this.regions[regionLower].lng], 8);
        return true;
    }

    assignTeam(teamId, alertId) {
        if (!this.markers[alertId]) {
            return false;
        }

        const marker = this.markers[alertId];
        marker.setPopupContent(marker.getPopup().getContent() + `<br><b>Assigned to:</b> Team ${teamId}`);
        marker.openPopup();
        return true;
    }

    showAllAlerts() {
        const alertMarkers = Object.values(this.markers).filter(marker =>
            marker._popup && marker._popup._content.includes('ALERT')
        );

        if (alertMarkers.length > 0) {
            const bounds = L.latLngBounds(alertMarkers.map(m => m.getLatLng()));
            this.map.fitBounds(bounds, { padding: [50, 50] });
            return true;
        }

        return false;
    }

    /**
     * Show all agencies on the map
     * @param {Array} agencies - List of agency objects
     */
    showAllAgencies(agencies) {
        if (!agencies || !Array.isArray(agencies)) {
            console.error('Invalid agencies data provided');
            return;
        }
        
        // Clear any existing agency markers first
        Object.keys(this.markers).forEach(key => {
            if (key.startsWith('agency-')) {
                this.map.removeLayer(this.markers[key]);
                delete this.markers[key];
            }
        });
        
        // Add markers for each agency
        agencies.forEach(agency => {
            this.addAgencyMarker(agency);
        });
        
        // Fit map to show all agencies
        if (agencies.length > 0) {
            const bounds = L.latLngBounds(agencies.map(a => [a.lat, a.lng]));
            this.map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    
    /**
     * Add an agency marker to the map
     * @param {Object} agency - Agency data object
     * @returns {Object} - The created marker
     */
    addAgencyMarker(agency) {
        if (!agency || !agency.lat || !agency.lng) {
            console.error('Invalid agency data', agency);
            return null;
        }
        
        const id = `agency-${agency.id}`;
        
        // Remove existing marker if any
        if (this.markers[id]) {
            this.map.removeLayer(this.markers[id]);
        }
        
        // Get icon configuration based on agency type
        const agencyType = agency.type || 'disaster';
        let emoji = '🚑'; // Default
        let color = '#4299e1'; // Default blue
        
        // Set emoji and color based on agency type
        switch(agencyType) {
            case 'fire':
                emoji = '🚒';
                color = '#f56565';
                break;
            case 'medical':
                emoji = '🚑';
                color = '#4299e1';
                break;
            case 'police':
                emoji = '🚓';
                color = '#2d3748';
                break;
            case 'flood':
                emoji = '🚤';
                color = '#38b2ac';
                break;
            case 'disaster':
                emoji = '🚁';
                color = '#ed8936';
                break;
        }
        
        // Create a custom icon
        const customIcon = L.divIcon({
            className: 'custom-marker-icon',
            html: `<div class="marker-3d" style="background-color: ${color}; color: white;">${emoji}</div>`,
            iconSize: [30, 30]
        });
        
        // Create and add the marker
        this.markers[id] = L.marker([agency.lat, agency.lng], { 
            icon: customIcon,
            title: agency.name,
            alt: agencyType,
            riseOnHover: true
        })
            .addTo(this.map)
            .bindPopup(`
                <div class="p-2">
                    <h3 class="text-lg font-bold">${agency.name}</h3>
                    <span class="inline-block px-2 py-1 text-xs text-white bg-${this.getColorClass(agencyType)}-600 rounded-full">
                        ${agencyType}
                    </span>
                    <p class="mt-2 text-gray-700">${agency.mainWork || 'Emergency response services'}</p>
                    ${agency.staff ? `<p class="mt-1 text-sm text-gray-600">Staff: ${agency.staff} | Vehicles: ${agency.vehicles || 'N/A'}</p>` : ''}
                </div>
            `, { 
                maxWidth: 300,
                className: 'agency-popup'
            });
        
        return this.markers[id];
    }

    /**
     * Add emergency vehicle to the map with animation
     * @param {string} id - Unique identifier for the vehicle
     * @param {Object} destination - Destination coordinates {lat, lng}
     * @param {string} vehicleType - Type of vehicle (firetruck, ambulance, etc.)
     * @returns {boolean} - Success status
     */
    addEmergencyVehicle(id, destination, vehicleType) {
        try {
            // Generate starting position around the destination
            const startPos = this.generateStartPosition(destination);
            
            // Get vehicle icon config
            const iconConfig = this.vehicleIcons[vehicleType] || this.vehicleIcons.firetruck;
            
            // Create vehicle marker
            const vehicleIcon = L.divIcon({
                className: 'emergency-vehicle-icon',
                html: `
                    <div class="vehicle-marker" style="background-color: ${iconConfig.color}">
                        <span class="vehicle-emoji">${iconConfig.emoji}</span>
                        <div class="pulse-ring"></div>
                    </div>
                `,
                iconSize: [40, 40],
                iconAnchor: [20, 20]
            });
            
            // Add marker
            this.markers[id] = L.marker([startPos.lat, startPos.lng], {
                icon: vehicleIcon,
                title: iconConfig.label,
                zIndexOffset: 1000
            }).addTo(this.map);
            
            // Add route line
            this.markers[id + '-route'] = L.polyline(
                [[startPos.lat, startPos.lng], [destination.lat, destination.lng]],
                {
                    color: iconConfig.color,
                    weight: 3,
                    opacity: 0.7,
                    dashArray: '10, 10'
                }
            ).addTo(this.map);
            
            // Animate vehicle
            this.animateVehicle(id, startPos, destination);
            
            return true;
        } catch (error) {
            console.error("Error adding emergency vehicle:", error);
            return false;
        }
    }
    
    /**
     * Add marker for service request
     * @param {string} id - Marker ID
     * @param {Object} location - Coordinates {lat, lng}
     * @param {string} serviceType - Type of service
     * @param {string} details - Additional details
     * @returns {boolean} - Success status
     */
    addServiceMarker(id, location, serviceType, details) {
        try {
            // Get marker icon config
            const iconConfig = this.serviceMarkers[serviceType] || this.serviceMarkers.fire;
            
            // Create marker icon
            const markerIcon = L.divIcon({
                className: 'service-marker-icon',
                html: `
                    <div class="service-marker" style="background-color: ${iconConfig.color}">
                        <span class="service-emoji">${iconConfig.emoji}</span>
                        <div class="marker-pulse"></div>
                    </div>
                `,
                iconSize: [50, 50],
                iconAnchor: [25, 25]
            });
            
            // Add marker
            this.markers[id] = L.marker([location.lat, location.lng], {
                icon: markerIcon,
                title: details || iconConfig.label
            }).addTo(this.map)
            .bindPopup(`
                <div class="p-3">
                    <h3 class="text-lg font-bold">${iconConfig.label}</h3>
                    <p class="mt-2">${details || 'Emergency response needed'}</p>
                    <div class="mt-3 text-sm text-gray-600">Response units have been dispatched</div>
                </div>
            `);
            
            // Zoom map to show the area
            this.map.setView([location.lat, location.lng], 13);
            
            // Open popup
            this.markers[id].openPopup();
            
            return true;
        } catch (error) {
            console.error("Error adding service marker:", error);
            return false;
        }
    }
    
    /**
     * Generate random starting position for emergency vehicles
     * @param {Object} destination - Destination coordinates
     * @returns {Object} - Starting coordinates
     */
    generateStartPosition(destination) {
        // Generate position 1-3km away from target
        const distance = (1 + Math.random() * 2) / 111; // Convert km to degrees (approx)
        const angle = Math.random() * Math.PI * 2; // Random angle in radians
        
        return {
            lat: destination.lat + distance * Math.cos(angle),
            lng: destination.lng + distance * Math.sin(angle)
        };
    }
    
    /**
     * Animate vehicle moving from start to destination
     * @param {string} id - Vehicle marker ID
     * @param {Object} start - Starting coordinates
     * @param {Object} destination - Destination coordinates
     */
    animateVehicle(id, start, destination) {
        const marker = this.markers[id];
        const routeLine = this.markers[id + '-route'];
        
        if (!marker || !routeLine) return;
        
        // Animation parameters
        const duration = 8000 + Math.random() * 4000; // 8-12 seconds
        const startTime = Date.now();
        const distance = this.calculateDistance(
            start.lat, start.lng,
            destination.lat, destination.lng
        );
        
        // Animation function
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease-in-out function
            const easedProgress = progress < 0.5 ? 
                2 * progress * progress : 
                1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            // Calculate current position
            const lat = start.lat + (destination.lat - start.lat) * easedProgress;
            const lng = start.lng + (destination.lng - start.lng) * easedProgress;
            
            // Update marker position
            marker.setLatLng([lat, lng]);
            
            // Update route line to show traveled path
            routeLine.setLatLngs([
                [start.lat, start.lng],
                [lat, lng],
                [destination.lat, destination.lng]
            ]);
            
            // Continue animation if not complete
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // Animation complete - marker arrived
                marker.getElement().classList.add('arrived');
                
                // Remove route line after arrival
                setTimeout(() => {
                    if (routeLine) {
                        routeLine.removeFrom(this.map);
                        delete this.markers[id + '-route'];
                    }
                }, 2000);
            }
        };
        
        // Start animation
        animate();
    }

    /**
     * Show connection between user and agency
     * @param {Object} agency - Connected agency
     * @param {Object} disasterLocation - Location of disaster
     */
    showAgencyConnection(agency, disasterLocation) {
        if (!this.map || !agency) return false;
        
        // Get user location (use center of map as default)
        const center = this.map.getCenter();
        const userLocation = { lat: center.lat, lng: center.lng };
        
        // Create a line connecting user, agency and disaster
        const connectionId = `connection-${agency.id}`;
        
        // Remove any existing connection
        if (this.connections[connectionId]) {
            this.map.removeLayer(this.connections[connectionId]);
        }
        
        // Create a curved line connecting the three points
        const pointList = [
            [userLocation.lat, userLocation.lng],
            [agency.lat, agency.lng],
            [disasterLocation.lat, disasterLocation.lng]
        ];
        
        // Create connection line with animation
        this.connections[connectionId] = L.polyline(pointList, {
            color: this.getColorByAgencyType(agency.type),
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10',
            className: 'animated-connection'
        }).addTo(this.map);
        
        // Add pulsing effect at the connection points
        this.addConnectionNode(userLocation.lat, userLocation.lng, 'green', `${connectionId}-user`);
        this.addConnectionNode(agency.lat, agency.lng, this.getColorByAgencyType(agency.type), `${connectionId}-agency`);
        
        return true;
    }
    
    /**
     * Add a pulsing connection node
     */
    addConnectionNode(lat, lng, color, id) {
        // Remove existing node if any
        if (this.markers[id]) {
            this.map.removeLayer(this.markers[id]);
        }
        
        // Create node icon
        const nodeIcon = L.divIcon({
            className: 'connection-node',
            html: `<div class="node-pulse" style="background-color: ${color};"></div>`,
            iconSize: [15, 15]
        });
        
        // Add marker
        this.markers[id] = L.marker([lat, lng], {
            icon: nodeIcon,
            interactive: false
        }).addTo(this.map);
    }
    
    /**
     * Remove connection with an agency
     */
    removeAgencyConnection(agencyId) {
        const connectionId = `connection-${agencyId}`;
        
        if (this.connections[connectionId]) {
            this.map.removeLayer(this.connections[connectionId]);
            delete this.connections[connectionId];
        }
        
        // Remove connection nodes
        const userNodeId = `${connectionId}-user`;
        const agencyNodeId = `${connectionId}-agency`;
        
        if (this.markers[userNodeId]) {
            this.map.removeLayer(this.markers[userNodeId]);
            delete this.markers[userNodeId];
        }
        
        if (this.markers[agencyNodeId]) {
            this.map.removeLayer(this.markers[agencyNodeId]);
            delete this.markers[agencyNodeId];
        }
    }
    
    /**
     * Get color based on agency type
     */
    getColorByAgencyType(type) {
        switch (type) {
            case 'fire': return '#FF4136';
            case 'medical': return '#2ECC40';
            case 'police': return '#0074D9';
            case 'flood': return '#7FDBFF';
            case 'disaster': return '#FF851B';
            default: return '#AAAAAA';
        }
    }
}
