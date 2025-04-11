/**
 * Database of disaster-prone areas in India
 * This helps the app quickly identify which areas are vulnerable to specific disasters
 */
const disasterProneAreas = {
    'earthquake': [
        { name: 'Kashmir Valley', lat: 34.0837, lng: 74.7973, risk: 'high' },
        { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, risk: 'high' },
        { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, risk: 'high' },
        { name: 'North East India', lat: 26.2006, lng: 92.9376, risk: 'high' },
        { name: 'Kutch Region', lat: 23.7337, lng: 69.8597, risk: 'high' },
        { name: 'Andaman & Nicobar Islands', lat: 11.7401, lng: 92.6586, risk: 'high' }
    ],
    
    'flood': [
        { name: 'Bihar', lat: 25.0961, lng: 85.3131, risk: 'high' },
        { name: 'Assam', lat: 26.2006, lng: 92.9376, risk: 'high' },
        { name: 'West Bengal', lat: 22.9868, lng: 87.8550, risk: 'high' },
        { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, risk: 'high' },
        { name: 'Kerala', lat: 10.8505, lng: 76.2711, risk: 'medium' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, risk: 'medium' }
    ],
    
    'cyclone': [
        { name: 'Odisha Coast', lat: 20.9517, lng: 85.0985, risk: 'high' },
        { name: 'Andhra Pradesh Coast', lat: 15.9129, lng: 79.7400, risk: 'high' },
        { name: 'Tamil Nadu Coast', lat: 11.1271, lng: 78.6569, risk: 'high' },
        { name: 'West Bengal Coast', lat: 21.7679, lng: 88.3386, risk: 'high' },
        { name: 'Gujarat Coast', lat: 21.9619, lng: 70.2989, risk: 'medium' }
    ],
    
    'drought': [
        { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, risk: 'high' },
        { name: 'Maharashtra', lat: 19.7515, lng: 75.7139, risk: 'medium' },
        { name: 'Karnataka', lat: 15.3173, lng: 75.7139, risk: 'medium' },
        { name: 'Telangana', lat: 18.1124, lng: 79.0193, risk: 'medium' },
        { name: 'Gujarat', lat: 22.2587, lng: 71.1924, risk: 'medium' }
    ],
    
    'landslide': [
        { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, risk: 'high' },
        { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, risk: 'high' },
        { name: 'Darjeeling', lat: 27.0410, lng: 88.2663, risk: 'high' },
        { name: 'Nilgiris', lat: 11.4916, lng: 76.7337, risk: 'high' },
        { name: 'Western Ghats', lat: 15.3173, lng: 75.7139, risk: 'medium' }
    ],
    
    'fire': [
        { name: 'Delhi NCR', lat: 28.7041, lng: 77.1025, risk: 'high' },
        { name: 'Mumbai', lat: 19.0760, lng: 72.8777, risk: 'high' },
        { name: 'Kolkata', lat: 22.5726, lng: 88.3639, risk: 'medium' },
        { name: 'Chennai', lat: 13.0827, lng: 80.2707, risk: 'medium' },
        { name: 'Forest Areas of Uttarakhand', lat: 30.0668, lng: 79.0193, risk: 'high' }
    ],
    
    'heatwave': [
        { name: 'Delhi', lat: 28.7041, lng: 77.1025, risk: 'high' },
        { name: 'Rajasthan', lat: 27.0238, lng: 74.2179, risk: 'high' },
        { name: 'Telangana', lat: 18.1124, lng: 79.0193, risk: 'high' },
        { name: 'Andhra Pradesh', lat: 15.9129, lng: 79.7400, risk: 'high' },
        { name: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462, risk: 'high' }
    ],
    
    'coldwave': [
        { name: 'Jammu & Kashmir', lat: 33.7782, lng: 76.5762, risk: 'high' },
        { name: 'Ladakh', lat: 34.1526, lng: 77.5770, risk: 'high' },
        { name: 'Himachal Pradesh', lat: 31.1048, lng: 77.1734, risk: 'high' },
        { name: 'Punjab', lat: 31.1471, lng: 75.3412, risk: 'medium' },
        { name: 'Uttarakhand', lat: 30.0668, lng: 79.0193, risk: 'high' }
    ],
    
    'tsunami': [
        { name: 'Andaman & Nicobar', lat: 11.7401, lng: 92.6586, risk: 'high' },
        { name: 'Tamil Nadu Coast', lat: 11.1271, lng: 78.6569, risk: 'medium' },
        { name: 'Kerala Coast', lat: 10.8505, lng: 76.2711, risk: 'medium' },
        { name: 'Andhra Pradesh Coast', lat: 15.9129, lng: 79.7400, risk: 'medium' }
    ],
    
    'industrial': [
        { name: 'Mumbai-Thane Belt', lat: 19.2183, lng: 72.9781, risk: 'high' },
        { name: 'Gujarat Industrial Corridor', lat: 22.2587, lng: 71.1924, risk: 'high' },
        { name: 'Bhopal', lat: 23.2599, lng: 77.4126, risk: 'medium' },
        { name: 'Delhi Industrial Areas', lat: 28.7041, lng: 77.1025, risk: 'medium' }
    ]
};

// Export the data if used in a module environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = disasterProneAreas;
}
