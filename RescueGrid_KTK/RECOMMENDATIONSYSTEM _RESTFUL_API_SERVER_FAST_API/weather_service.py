import requests
from models import WeatherData, Location
from config import WEATHER_API_KEY, WEATHER_API_URL

class WeatherService:
    def __init__(self):
        self.api_key = WEATHER_API_KEY
        self.base_url = WEATHER_API_URL
    
    def get_current_weather(self, location: str) -> (WeatherData, Location):
        """Get current weather data for location"""
        url = f"{self.base_url}/current.json?key={self.api_key}&q={location}"
        
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(f"Weather API error: {response.json()}")
        
        data = response.json()
        
        # Extract weather data
        weather_data = WeatherData(
            temperature=data['current']['temp_c'],
            humidity=data['current']['humidity'],
            wind_speed=data['current']['wind_kph'],
            precipitation=data['current']['precip_mm'],
            pressure=data['current']['pressure_mb']
        )
        
        # Extract location data
        location_data = Location(
            city=data['location']['name'],
            country=data['location']['country'],
            latitude=data['location']['lat'],
            longitude=data['location']['lon']
        )
        
        return weather_data, location_data
        
    def get_forecast(self, location: str, days=3):
        """Get weather forecast for a location"""
        url = f"{self.base_url}/forecast.json?key={self.api_key}&q={location}&days={days}"
        
        response = requests.get(url)
        if response.status_code != 200:
            raise Exception(f"Weather API error: {response.json()}")
            
        return response.json()