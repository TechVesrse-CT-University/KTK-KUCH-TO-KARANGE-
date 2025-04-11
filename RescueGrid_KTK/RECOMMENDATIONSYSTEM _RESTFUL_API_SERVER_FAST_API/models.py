from pydantic import BaseModel
from typing import List, Optional, Dict

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    wind_speed: float
    precipitation: float
    pressure: float
    
class Location(BaseModel):
    city: str
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class DisasterPrediction(BaseModel):
    disaster_type: str
    probability: float
    severity: str
    description: str
    
class PreventionMeasure(BaseModel):
    title: str
    description: str
    urgency: str
    
class PredictionResponse(BaseModel):
    location: Location
    weather: WeatherData
    predictions: List[DisasterPrediction]
    preventions: Dict[str, List[PreventionMeasure]]