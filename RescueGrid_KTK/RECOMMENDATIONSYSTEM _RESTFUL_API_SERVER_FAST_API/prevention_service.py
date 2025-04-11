from models import PreventionMeasure, DisasterPrediction
from typing import Dict, List

class PreventionService:
    def get_prevention_measures(self, predictions: List[DisasterPrediction]) -> Dict[str, List[PreventionMeasure]]:
        """Get prevention recommendations based on predicted disasters"""
        prevention_measures = {}
        
        for prediction in predictions:
            disaster_type = prediction.disaster_type
            severity = prediction.severity
            
            if disaster_type == "Flood":
                prevention_measures["Flood"] = self._get_flood_preventions(severity)
            elif disaster_type == "Heat Wave":
                prevention_measures["Heat Wave"] = self._get_heat_wave_preventions(severity)
            elif disaster_type == "Storm":
                prevention_measures["Storm"] = self._get_storm_preventions(severity)
            elif disaster_type == "Wildfire":
                prevention_measures["Wildfire"] = self._get_wildfire_preventions(severity)
                
        return prevention_measures
    
    def _get_flood_preventions(self, severity: str) -> List[PreventionMeasure]:
        preventions = [
            PreventionMeasure(
                title="Avoid flood-prone areas",
                description="Stay away from low-lying areas and river banks",
                urgency="High"
            ),
            PreventionMeasure(
                title="Prepare emergency kit",
                description="Include water, food, medications, and important documents",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Move valuables to higher levels",
                description="Relocate important items and electrical equipment to upper floors",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Clear drains and gutters",
                description="Ensure proper drainage around your property to reduce flooding",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Install flood barriers",
                description="Use sandbags or specialized flood barriers around entry points",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Turn off utilities",
                description="Disconnect electricity and gas if flooding is imminent",
                urgency="High"
            ),
            PreventionMeasure(
                title="Plan evacuation routes",
                description="Familiarize yourself with safe evacuation paths and meeting points",
                urgency="Medium"
            )
        ]
        
        if severity in ["Severe", "Extreme"]:
            preventions.append(PreventionMeasure(
                title="Consider evacuation",
                description="Follow local authority evacuation instructions if issued",
                urgency="High"
            ))
            preventions.append(PreventionMeasure(
                title="Move to higher ground",
                description="Relocate to higher elevation if in a flood-prone area",
                urgency="High"
            ))
            
        return preventions
    
    def _get_heat_wave_preventions(self, severity: str) -> List[PreventionMeasure]:
        preventions = [
            PreventionMeasure(
                title="Stay hydrated",
                description="Drink plenty of water even if not thirsty",
                urgency="High"
            ),
            PreventionMeasure(
                title="Stay in cool areas",
                description="Use air conditioning or visit public cooling centers",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Wear lightweight clothing",
                description="Choose light-colored, loose-fitting clothes that breathe",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Avoid strenuous activity",
                description="Postpone outdoor activities during peak heat hours (10am-4pm)",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Use fans and cold compresses",
                description="Enhance cooling with fans and damp cloths on pulse points",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Close blinds during day",
                description="Block direct sunlight to keep indoor spaces cooler",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Know heat illness signs",
                description="Learn to recognize symptoms of heat exhaustion and heat stroke",
                urgency="High"
            )
        ]
        
        if severity in ["High", "Extreme"]:
            preventions.append(PreventionMeasure(
                title="Check on vulnerable people",
                description="Monitor elderly, young children, and those with health conditions",
                urgency="High"
            ))
            preventions.append(PreventionMeasure(
                title="Never leave pets or people in cars",
                description="Vehicle temperatures can reach deadly levels within minutes",
                urgency="Critical"
            ))
            
        return preventions
    
    def _get_storm_preventions(self, severity: str) -> List[PreventionMeasure]:
        preventions = [
            PreventionMeasure(
                title="Stay indoors",
                description="Remain inside and away from windows",
                urgency="High"
            ),
            PreventionMeasure(
                title="Secure loose objects",
                description="Bring in or tie down outdoor furniture and items",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Charge essential devices",
                description="Ensure phones and emergency communication devices are charged",
                urgency="High"
            ),
            PreventionMeasure(
                title="Fill bathtubs and containers",
                description="Store water for sanitation and drinking if supply is disrupted",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Keep emergency supplies ready",
                description="Prepare flashlights, batteries, first aid kit, and non-perishable food",
                urgency="High"
            ),
            PreventionMeasure(
                title="Stay updated with alerts",
                description="Keep a battery-powered radio to receive emergency information",
                urgency="High"
            ),
            PreventionMeasure(
                title="Identify safe shelter areas",
                description="Choose interior rooms on lowest floors away from windows",
                urgency="Medium"
            )
        ]
        
        if severity == "Severe":
            preventions.append(PreventionMeasure(
                title="Prepare for power outages",
                description="Have flashlights, batteries, and emergency supplies ready",
                urgency="High"
            ))
            preventions.append(PreventionMeasure(
                title="Avoid flooded areas",
                description="Never drive or walk through floodwaters - turn around, don't drown",
                urgency="Critical"
            ))
            
        return preventions
    
    def _get_wildfire_preventions(self, severity: str) -> List[PreventionMeasure]:
        preventions = [
            PreventionMeasure(
                title="Create defensible space",
                description="Clear vegetation around your home",
                urgency="High"
            ),
            PreventionMeasure(
                title="Stay informed",
                description="Monitor local news and emergency alerts",
                urgency="High"
            ),
            PreventionMeasure(
                title="Prepare evacuation kit",
                description="Include essential items, medications, documents, and water",
                urgency="High"
            ),
            PreventionMeasure(
                title="Create evacuation plan",
                description="Identify multiple evacuation routes and a family meeting place",
                urgency="High"
            ),
            PreventionMeasure(
                title="Close all windows and doors",
                description="Prevent embers from entering your home",
                urgency="High"
            ),
            PreventionMeasure(
                title="Remove flammable materials",
                description="Move patio furniture, firewood, and other combustibles away from structures",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Fill containers with water",
                description="Have water available for firefighting and personal use",
                urgency="Medium"
            ),
            PreventionMeasure(
                title="Ensure proper home vents",
                description="Install ember-resistant vents to prevent sparks from entering",
                urgency="Medium"
            )
        ]
        
        if severity == "High":
            preventions.append(PreventionMeasure(
                title="Consider early evacuation",
                description="Leave before evacuation becomes mandatory for better safety",
                urgency="High"
            ))
            preventions.append(PreventionMeasure(
                title="Wear protective clothing",
                description="Use long sleeves, pants, masks, and goggles if smoke is present",
                urgency="High"
            ))
            
        return preventions