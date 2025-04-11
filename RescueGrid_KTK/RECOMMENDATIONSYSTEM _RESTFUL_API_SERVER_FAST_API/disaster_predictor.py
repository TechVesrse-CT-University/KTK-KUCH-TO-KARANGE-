from models import WeatherData, DisasterPrediction

class DisasterPredictor:
    def predict_disasters(self, weather_data: WeatherData) -> list[DisasterPrediction]:
        """Predict potential disasters based on weather data"""
        predictions = []
        
        # Flood prediction
        if weather_data.precipitation > 50:
            predictions.append(DisasterPrediction(
                disaster_type="Flood",
                probability=0.85,
                severity="Severe",
                description="Heavy rainfall may cause flooding in low-lying areas"
            ))
        elif weather_data.precipitation > 30:
            predictions.append(DisasterPrediction(
                disaster_type="Flood",
                probability=0.5,
                severity="Moderate",
                description="Moderate flooding possible in susceptible areas"
            ))
        
        # Heat wave prediction
        if weather_data.temperature > 40:
            predictions.append(DisasterPrediction(
                disaster_type="Heat Wave",
                probability=0.9,
                severity="Extreme",
                description="Dangerous heat levels that may cause health issues"
            ))
        elif weather_data.temperature > 35:
            predictions.append(DisasterPrediction(
                disaster_type="Heat Wave",
                probability=0.7,
                severity="High",
                description="High temperatures may cause heat-related illnesses"
            ))
        
        # Storm prediction
        if weather_data.wind_speed > 60 and weather_data.pressure < 990:
            predictions.append(DisasterPrediction(
                disaster_type="Storm",
                probability=0.8,
                severity="Severe",
                description="High winds and low pressure indicate severe storm conditions"
            ))
        elif weather_data.wind_speed > 40 and weather_data.pressure < 1000:
            predictions.append(DisasterPrediction(
                disaster_type="Storm",
                probability=0.6,
                severity="Moderate",
                description="Potential for strong winds and rain"
            ))
        
        # Wildfire risk
        if weather_data.temperature > 30 and weather_data.humidity < 30 and weather_data.precipitation < 5:
            predictions.append(DisasterPrediction(
                disaster_type="Wildfire",
                probability=0.75,
                severity="High",
                description="Hot, dry conditions create high fire danger"
            ))
        
        # Default case: no immediate threats
        if not predictions:
            predictions.append(DisasterPrediction(
                disaster_type="None",
                probability=0.1,
                severity="Low",
                description="No significant disaster risk detected"
            ))
            
        return predictions