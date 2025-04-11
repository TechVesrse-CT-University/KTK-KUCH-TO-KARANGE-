// 50+ dummy rescue agencies with detailed information
const dummyAgencies = [
    { id: 1, name: "Delhi Fire Brigade", type: "fire", lat: 28.7041, lng: 77.1025, mainWork: "Fire fighting and rescue operations in Delhi NCR", staff: 250, vehicles: 45 },
    { id: 2, name: "Mumbai Rescue Squad", type: "disaster", lat: 19.0760, lng: 72.8777, mainWork: "All-hazards emergency response in Mumbai metro area", staff: 180, vehicles: 32 },
    { id: 3, name: "Kolkata Medical Response", type: "medical", lat: 22.5726, lng: 88.3639, mainWork: "Emergency medical services and ambulance services", staff: 120, vehicles: 28 },
    { id: 4, name: "Chennai Emergency Services", type: "police", lat: 13.0827, lng: 80.2707, mainWork: "Law enforcement and emergency coordination", staff: 150, vehicles: 35 },
    { id: 5, name: "Bangalore Fire Department", type: "fire", lat: 12.9716, lng: 77.5946, mainWork: "Fire suppression and technical rescue", staff: 200, vehicles: 40 },
    { id: 6, name: "Hyderabad Flood Response", type: "flood", lat: 17.3850, lng: 78.4867, mainWork: "Flood rescue and water management", staff: 90, vehicles: 25 },
    { id: 7, name: "Pune Medical Team", type: "medical", lat: 18.5204, lng: 73.8567, mainWork: "Advanced life support and trauma care", staff: 110, vehicles: 30 },
    { id: 8, name: "Ahmedabad Police Unit", type: "police", lat: 23.0225, lng: 72.5714, mainWork: "Emergency response coordination", staff: 130, vehicles: 28 },
    { id: 9, name: "Jaipur Fire Brigade", type: "fire", lat: 26.9124, lng: 75.7873, mainWork: "Fire prevention and suppression", staff: 140, vehicles: 30 },
    { id: 10, name: "Lucknow Disaster Relief", type: "disaster", lat: 26.8467, lng: 80.9462, mainWork: "Disaster relief and management", staff: 85, vehicles: 20 },
    { id: 11, name: "Chandigarh Rescue Team", type: "fire", lat: 30.7333, lng: 76.7794, mainWork: "Urban search and rescue", staff: 95, vehicles: 22 },
    { id: 12, name: "Bhopal Medical Response", type: "medical", lat: 23.2599, lng: 77.4126, mainWork: "Medical emergency response", staff: 80, vehicles: 25 },
    { id: 13, name: "Nagpur Fire Services", type: "fire", lat: 21.1458, lng: 79.0882, mainWork: "Firefighting and hazmat response", staff: 110, vehicles: 24 },
    { id: 14, name: "Amritsar Emergency Squad", type: "police", lat: 31.6340, lng: 74.8723, mainWork: "Emergency coordination and public safety", staff: 90, vehicles: 22 },
    { id: 15, name: "Jalandhar Rescue Team", type: "disaster", lat: 31.3260, lng: 75.5762, mainWork: "Urban rescue operations", staff: 65, vehicles: 18 },
    { id: 16, name: "Ludhiana Fire Department", type: "fire", lat: 30.9010, lng: 75.8573, mainWork: "Industrial firefighting and prevention", staff: 120, vehicles: 28 },
    { id: 17, name: "Shimla Mountain Rescue", type: "disaster", lat: 31.1048, lng: 77.1734, mainWork: "Mountain rescue and avalanche response", staff: 55, vehicles: 15 },
    { id: 18, name: "Srinagar Flood Response", type: "flood", lat: 34.0837, lng: 74.7973, mainWork: "Flood rescue and evacuation", staff: 70, vehicles: 22 },
    { id: 19, name: "Dehradun Medical Team", type: "medical", lat: 30.3165, lng: 78.0322, mainWork: "Mountain medical emergencies", staff: 60, vehicles: 20 },
    { id: 20, name: "Patna Disaster Management", type: "disaster", lat: 25.5941, lng: 85.1376, mainWork: "Flood and disaster management", staff: 80, vehicles: 25 },
    { id: 21, name: "Ranchi Fire Squad", type: "fire", lat: 23.3441, lng: 85.3096, mainWork: "Wildland firefighting and prevention", staff: 90, vehicles: 22 },
    { id: 22, name: "Guwahati Flood Relief", type: "flood", lat: 26.1445, lng: 91.7362, mainWork: "Flood response and water rescue", staff: 75, vehicles: 24 },
    { id: 23, name: "Siliguri Mountain Response", type: "disaster", lat: 26.7271, lng: 88.3953, mainWork: "Mountain disaster response", staff: 60, vehicles: 15 },
    { id: 24, name: "Darjeeling Rescue Team", type: "disaster", lat: 27.0410, lng: 88.2663, mainWork: "Hill station emergency services", staff: 50, vehicles: 12 },
    { id: 25, name: "Gangtok Emergency Services", type: "medical", lat: 27.3389, lng: 88.6065, mainWork: "Medical evacuation from remote areas", staff: 45, vehicles: 18 },
    { id: 26, name: "Agra Fire Brigade", type: "fire", lat: 27.1767, lng: 78.0081, mainWork: "Historical monument protection", staff: 85, vehicles: 20 },
    { id: 27, name: "Varanasi Flood Response", type: "flood", lat: 25.3176, lng: 82.9739, mainWork: "River rescue and flood management", staff: 70, vehicles: 22 },
    { id: 28, name: "Kanpur Medical Unit", type: "medical", lat: 26.4499, lng: 80.3319, mainWork: "Industrial accident response", staff: 80, vehicles: 24 },
    { id: 29, name: "Indore Rescue Squad", type: "disaster", lat: 22.7196, lng: 75.8577, mainWork: "Urban disaster management", staff: 95, vehicles: 26 },
    { id: 30, name: "Bhopal Hazard Response", type: "disaster", lat: 23.2599, lng: 77.4126, mainWork: "Chemical incident response", staff: 85, vehicles: 20 },
    { id: 31, name: "Jabalpur Fire Control", type: "fire", lat: 23.1815, lng: 79.9864, mainWork: "Forest fire prevention and response", staff: 80, vehicles: 22 },
    { id: 32, name: "Kota Emergency Team", type: "medical", lat: 25.2138, lng: 75.8648, mainWork: "Student emergency response", staff: 60, vehicles: 18 },
    { id: 33, name: "Jodhpur Desert Rescue", type: "disaster", lat: 26.2389, lng: 73.0243, mainWork: "Desert search and rescue", staff: 55, vehicles: 20 },
    { id: 34, name: "Udaipur Lake Patrol", type: "flood", lat: 24.5854, lng: 73.7125, mainWork: "Lake and water emergency response", staff: 45, vehicles: 15 },
    { id: 35, name: "Ajmer Medical Response", type: "medical", lat: 26.4499, lng: 74.6399, mainWork: "Pilgrimage event medical services", staff: 70, vehicles: 22 },
    { id: 36, name: "Nasik Fire Department", type: "fire", lat: 19.9975, lng: 73.7898, mainWork: "Industrial fire safety", staff: 95, vehicles: 26 },
    { id: 37, name: "Punjab Emergency Services", type: "police", lat: 31.1471, lng: 75.3412, mainWork: "Border area emergency management", staff: 110, vehicles: 30 },
    { id: 38, name: "Ludhiana Rescue Operations", type: "disaster", lat: 30.9010, lng: 75.8573, mainWork: "Industrial accident response", staff: 85, vehicles: 24 },
    { id: 39, name: "Amritsar Fire Control", type: "fire", lat: 31.6340, lng: 74.8723, mainWork: "Heritage building fire protection", staff: 75, vehicles: 20 },
    { id: 40, name: "Jalandhar Medical Team", type: "medical", lat: 31.3260, lng: 75.5762, mainWork: "Sports event medical support", staff: 65, vehicles: 18 },
    { id: 41, name: "Patiala Emergency Response", type: "police", lat: 30.3398, lng: 76.3869, mainWork: "Rural area emergencies", staff: 70, vehicles: 20 },
    { id: 42, name: "Bathinda Fire Brigade", type: "fire", lat: 30.2110, lng: 74.9455, mainWork: "Oil refinery fire specialist", staff: 90, vehicles: 25 },
    { id: 43, name: "Mohali Disaster Management", type: "disaster", lat: 30.7046, lng: 76.7179, mainWork: "IT sector emergency response", staff: 65, vehicles: 18 },
    { id: 44, name: "Ropar Flood Control", type: "flood", lat: 30.9661, lng: 76.5231, mainWork: "Dam-related emergency management", staff: 60, vehicles: 22 },
    { id: 45, name: "Hoshiarpur Medical Response", type: "medical", lat: 31.5143, lng: 75.9115, mainWork: "Rural medical emergencies", staff: 55, vehicles: 18 },
    { id: 46, name: "Pathankot Border Rescue", type: "disaster", lat: 32.2643, lng: 75.6393, mainWork: "Cross-border emergency response", staff: 70, vehicles: 20 },
    { id: 47, name: "Ferozepur Fire Team", type: "fire", lat: 30.9331, lng: 74.6225, mainWork: "Border area fire management", staff: 65, vehicles: 18 },
    { id: 48, name: "Sangrur Emergency Services", type: "medical", lat: 30.2457, lng: 75.8420, mainWork: "Agricultural emergency response", staff: 50, vehicles: 15 },
    { id: 49, name: "Moga Rescue Squad", type: "disaster", lat: 30.8230, lng: 75.1742, mainWork: "Rural disaster response", staff: 45, vehicles: 12 },
    { id: 50, name: "Gurdaspur Fire Control", type: "fire", lat: 32.0419, lng: 75.4053, mainWork: "Border area fire protection", staff: 60, vehicles: 16 },
    { id: 51, name: "Kapurthala Medical Team", type: "medical", lat: 31.3722, lng: 75.3868, mainWork: "Community health emergency", staff: 45, vehicles: 14 },
    { id: 52, name: "Faridkot Emergency Response", type: "police", lat: 30.6765, lng: 74.7479, mainWork: "Rural security emergencies", staff: 55, vehicles: 16 }
];

// 3D model and icon information for different agency types
const agencyIcons = {
    fire: {
        iconUrl: 'assets/icons/fire-truck.png',
        model3dUrl: 'assets/models/fire-truck.glb',
        emoji: '🚒',
        color: '#f56565'
    },
    medical: {
        iconUrl: 'assets/icons/ambulance.png',
        model3dUrl: 'assets/models/ambulance.glb',
        emoji: '🚑',
        color: '#4299e1'
    },
    police: {
        iconUrl: 'assets/icons/police-car.png',
        model3dUrl: 'assets/models/police-car.glb',
        emoji: '🚓',
        color: '#2d3748'
    },
    flood: {
        iconUrl: 'assets/icons/rescue-boat.png',
        model3dUrl: 'assets/models/rescue-boat.glb',
        emoji: '🚤',
        color: '#38b2ac'
    },
    disaster: {
        iconUrl: 'assets/icons/helicopter.png',
        model3dUrl: 'assets/models/helicopter.glb',
        emoji: '🚁',
        color: '#ed8936'
    }
};

// 3D model and icon information for different disaster types
const disasterIcons = {
    fire: {
        iconUrl: 'assets/icons/fire.png',
        model3dUrl: 'assets/models/fire.glb',
        emoji: '🔥',
        color: '#f56565'
    },
    flood: {
        iconUrl: 'assets/icons/flood.png',
        model3dUrl: 'assets/models/flood.glb',
        emoji: '🌊',
        color: '#4299e1'
    },
    earthquake: {
        iconUrl: 'assets/icons/earthquake.png',
        model3dUrl: 'assets/models/earthquake.glb',
        emoji: '⚡',
        color: '#805ad5'
    },
    medical: {
        iconUrl: 'assets/icons/medical-emergency.png',
        model3dUrl: 'assets/models/medical.glb',
        emoji: '🏥',
        color: '#48bb78'
    },
    chemical: {
        iconUrl: 'assets/icons/chemical.png',
        model3dUrl: 'assets/models/chemical.glb',
        emoji: '☢️',
        color: '#ecc94b'
    }
};

// Common geographic locations with coordinates
const locationCoordinates = {
    'delhi': { lat: 28.7041, lng: 77.1025 },
    'mumbai': { lat: 19.0760, lng: 72.8777 },
    'kolkata': { lat: 22.5726, lng: 88.3639 },
    'chennai': { lat: 13.0827, lng: 80.2707 },
    'bangalore': { lat: 12.9716, lng: 77.5946 },
    'hyderabad': { lat: 17.3850, lng: 78.4867 },
    'pune': { lat: 18.5204, lng: 73.8567 },
    'ahmedabad': { lat: 23.0225, lng: 72.5714 },
    'jaipur': { lat: 26.9124, lng: 75.7873 },
    'lucknow': { lat: 26.8467, lng: 80.9462 },
    'chandigarh': { lat: 30.7333, lng: 76.7794 },
    'jalandhar': { lat: 31.3260, lng: 75.5762 },
    'amritsar': { lat: 31.6340, lng: 74.8723 },
    'ludhiana': { lat: 30.9010, lng: 75.8573 },
    'punjab': { lat: 31.1471, lng: 75.3412 },
    'haryana': { lat: 29.0588, lng: 76.0856 },
    'uttar pradesh': { lat: 26.8467, lng: 80.9462 },
    'rajasthan': { lat: 26.9124, lng: 75.7873 },
    'gujarat': { lat: 23.0225, lng: 72.5714 },
    'maharashtra': { lat: 19.7515, lng: 75.7139 },
    'madhya pradesh': { lat: 23.2599, lng: 77.4126 },
    'telangana': { lat: 17.3850, lng: 78.4867 },
    'andhra pradesh': { lat: 15.9129, lng: 79.7400 },
    'karnataka': { lat: 12.9716, lng: 77.5946 },
    'tamil nadu': { lat: 13.0827, lng: 80.2707 },
    'kerala': { lat: 10.8505, lng: 76.2711 },
    'west bengal': { lat: 22.5726, lng: 88.3639 },
    'bihar': { lat: 25.0961, lng: 85.3131 },
    'odisha': { lat: 20.2961, lng: 85.8245 }
};

class AgencyManager {
    constructor() {
        this.agencies = [];
        this.joinedAgencies = [];
        this.currentCoordination = null;
    }
    
    loadAgencies() {
        // Load hardcoded agencies
        this.agencies = [
            { id: 1, name: "Delhi Fire Brigade", type: "fire", lat: 28.7041, lng: 77.1025, mainWork: "Fire fighting and rescue operations in Delhi NCR", staff: 150, vehicles: 45 },
            { id: 2, name: "Mumbai Rescue Squad", type: "disaster", lat: 19.0760, lng: 72.8777, mainWork: "All-hazards emergency response in Mumbai metro area", staff: 180, vehicles: 32 },
            { id: 3, name: "Kolkata Medical Response", type: "medical", lat: 22.5726, lng: 88.3639, mainWork: "Emergency medical services and ambulance services", staff: 120, vehicles: 40 },
            { id: 4, name: "Chennai Emergency Services", type: "police", lat: 13.0827, lng: 80.2707, mainWork: "Law enforcement and emergency coordination", staff: 200, vehicles: 65 },
            { id: 5, name: "Bangalore Fire Department", type: "fire", lat: 12.9716, lng: 77.5946, mainWork: "Fire suppression and technical rescue", staff: 140, vehicles: 38 },
            { id: 6, name: "Hyderabad Flood Response", type: "flood", lat: 17.3850, lng: 78.4867, mainWork: "Flood rescue and water management", staff: 95, vehicles: 28 },
            { id: 7, name: "Pune Medical Team", type: "medical", lat: 18.5204, lng: 73.8567, mainWork: "Advanced life support and trauma care", staff: 85, vehicles: 25 },
            { id: 8, name: "Ahmedabad Police Unit", type: "police", lat: 23.0225, lng: 72.5714, mainWork: "Emergency response coordination", staff: 175, vehicles: 55 },
            { id: 9, name: "Jaipur Fire Brigade", type: "fire", lat: 26.9124, lng: 75.7873, mainWork: "Fire prevention and suppression", staff: 110, vehicles: 32 },
            { id: 10, name: "Lucknow Disaster Relief", type: "disaster", lat: 26.8467, lng: 80.9462, mainWork: "Disaster relief and management", staff: 85, vehicles: 20 },
            { id: 11, name: "Chandigarh Rescue Team", type: "fire", lat: 30.7333, lng: 76.7794, mainWork: "Urban search and rescue", staff: 75, vehicles: 18 },
            { id: 12, name: "Bhopal Medical Response", type: "medical", lat: 23.2599, lng: 77.4126, mainWork: "Medical emergency response", staff: 65, vehicles: 22 },
            { id: 13, name: "Nagpur Fire Services", type: "fire", lat: 21.1458, lng: 79.0882, mainWork: "Firefighting and hazmat response", staff: 90, vehicles: 26 },
            { id: 14, name: "Amritsar Emergency Squad", type: "police", lat: 31.6340, lng: 74.8723, mainWork: "Emergency coordination and public safety", staff: 120, vehicles: 35 },
            { id: 15, name: "Jalandhar Rescue Team", type: "disaster", lat: 31.3260, lng: 75.5762, mainWork: "Urban rescue operations", staff: 65, vehicles: 18 },
            // ...add more agencies as needed
        ];
        
        console.log(`Loaded ${this.agencies.length} total agencies`);
        
        // Update UI
        this.updateAgenciesUI();
    }
    
    /**
     * Join with a nearby agency for coordination
     * @param {Object} agency - Agency to join with
     * @param {string} disasterType - Type of disaster for coordination
     * @param {Object} location - Location coordinates
     */
    joinAgency(agency, disasterType, location) {
        if (!agency || !disasterType || !location) return false;
        
        // Check if already joined
        if (this.joinedAgencies.some(a => a.id === agency.id)) {
            return { success: false, message: 'Already coordinating with this agency' };
        }
        
        // Add to joined agencies
        this.joinedAgencies.push({
            ...agency,
            joinedAt: new Date(),
            disasterType,
            location,
            status: 'active'
        });
        
        // Update UI
        this.updateJoinedAgenciesUI();
        
        // Create a coordination ID if there isn't one already
        if (!this.currentCoordination) {
            this.currentCoordination = {
                id: `coord-${Date.now()}`,
                disasterType,
                location,
                startTime: new Date(),
                agencies: [],
                status: 'active'
            };
        }
        
        // Add agency to coordination
        this.currentCoordination.agencies.push(agency.id);
        
        return { success: true, message: `Now coordinating with ${agency.name}` };
    }
    
    /**
     * End coordination with an agency
     * @param {string|number} agencyId - ID of agency to remove from coordination
     */
    leaveAgency(agencyId) {
        const index = this.joinedAgencies.findIndex(a => a.id === agencyId);
        if (index === -1) return false;
        
        // Remove from joined agencies
        this.joinedAgencies.splice(index, 1);
        
        // Update coordination status
        if (this.currentCoordination) {
            const agencyIndex = this.currentCoordination.agencies.indexOf(agencyId);
            if (agencyIndex !== -1) {
                this.currentCoordination.agencies.splice(agencyIndex, 1);
            }
            
            // If no more agencies, end coordination
            if (this.currentCoordination.agencies.length === 0) {
                this.endCurrentCoordination();
            }
        }
        
        // Update UI
        this.updateJoinedAgenciesUI();
        
        return true;
    }
    
    /**
     * End current coordination session
     */
    endCurrentCoordination() {
        if (!this.currentCoordination) return false;
        
        this.currentCoordination.status = 'ended';
        this.currentCoordination.endTime = new Date();
        this.currentCoordination = null;
        this.joinedAgencies = [];
        
        // Update UI
        this.updateJoinedAgenciesUI();
        
        return true;
    }
    
    /**
     * Update UI to show joined agencies
     */
    updateJoinedAgenciesUI() {
        const agenciesList = document.getElementById('joined-agencies-list');
        if (!agenciesList) return;
        
        // Clear existing items
        agenciesList.innerHTML = '';
        
        if (this.joinedAgencies.length === 0) {
            agenciesList.innerHTML = '<div class="p-3 text-center text-gray-500">No agencies joined yet</div>';
            document.getElementById('joined-agencies-panel')?.classList.add('hidden');
            return;
        }
        
        document.getElementById('joined-agencies-panel')?.classList.remove('hidden');
        
        // Add each joined agency
        this.joinedAgencies.forEach(agency => {
            const agencyItem = document.createElement('div');
            agencyItem.className = 'joined-agency-item flex items-center justify-between p-3 mb-2 bg-green-50 rounded-lg border-l-4 border-green-500';
            
            agencyItem.innerHTML = `
                <div>
                    <div class="font-bold">${agency.name}</div>
                    <div class="text-xs text-gray-600">${agency.mainWork || 'Emergency services'}</div>
                </div>
                <div class="flex items-center">
                    <span class="inline-flex items-center px-2 py-1 mr-2 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        <span class="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>Connected
                    </span>
                    <button class="leave-agency-btn text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded" 
                            data-agency-id="${agency.id}">Leave</button>
                </div>
            `;
            
            agenciesList.appendChild(agencyItem);
            
            // Add event listener to the leave button
            const leaveBtn = agencyItem.querySelector('.leave-agency-btn');
            leaveBtn.addEventListener('click', () => {
                this.leaveAgency(agency.id);
                if (window.app && window.app.mapController) {
                    window.app.mapController.removeAgencyConnection(agency.id);
                }
            });
        });
    }
    
    /**
     * Find nearby agencies based on location and type
     */
    findNearbyAgencies(location, responseType, maxDistance = 50) {
        if (!this.agencies || !location) return [];
        
        const nearbyAgencies = this.agencies
            .map(agency => ({
                ...agency,
                distance: this.calculateDistance(location.lat, location.lng, agency.lat, agency.lng)
            }))
            .filter(agency => {
                return (responseType === null || agency.type === responseType) && 
                       agency.distance <= maxDistance;
            })
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5); // Limit to 5 closest agencies
            
        return nearbyAgencies;
    }
    
    /**
     * Calculate distance between two points
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth's radius in km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1); 
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2); 
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        return R * c;
    }
    
    deg2rad(deg) {
        return deg * (Math.PI/180);
    }
    
    /**
     * Update UI to show agencies
     */
    updateAgenciesUI() {
        const agenciesList = document.getElementById('agencies-list');
        if (!agenciesList) return;
        
        // Clear existing items
        agenciesList.innerHTML = '';
        
        // Add each agency
        this.agencies.slice(0, 6).forEach(agency => {
            const agencyItem = document.createElement('div');
            agencyItem.className = 'agency-item mb-2 p-3 bg-gray-50 rounded-lg';
            
            agencyItem.innerHTML = `
                <div class="font-bold">${agency.name}</div>
                <div class="text-xs bg-${this.getColorClass(agency.type)}-100 text-${this.getColorClass(agency.type)}-800 inline-block px-2 py-1 rounded-full">
                    ${agency.type}
                </div>
                <div class="text-sm text-gray-600 mt-1">${agency.mainWork}</div>
                <div class="text-xs text-gray-500 mt-1">${agency.staff} staff | ${agency.vehicles} vehicles</div>
            `;
            
            agenciesList.appendChild(agencyItem);
        });
    }
    
    getColorClass(type) {
        const colorMap = {
            'fire': 'red',
            'medical': 'green',
            'police': 'blue',
            'flood': 'blue',
            'disaster': 'orange'
        };
        return colorMap[type] || 'gray';
    }
}
