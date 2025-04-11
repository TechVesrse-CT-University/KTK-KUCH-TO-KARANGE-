import os
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize logger
logger = logging.getLogger(__name__)

# India-specific disaster knowledge database
indian_disaster_knowledge = {
    "earthquake": "For earthquakes in India: Drop, Cover, Hold. Stay away from windows, especially in regions like Kashmir, Uttarakhand, Himachal Pradesh, Northeast India and Gujarat which are in high seismic zones. Keep emergency supplies ready including water, first aid kit, and torch.",
    
    "flood": "During floods in India (common in Bihar, Assam, West Bengal): Move to higher ground immediately. Contact NDRF or local disaster management at 1078. Keep medication and important documents in waterproof bags. Listen to All India Radio for emergency broadcasts.",
    
    "cyclone": "For cyclones affecting coastal India (Bay of Bengal, Arabian Sea): Secure your home, keep emergency kit ready. Follow evacuation orders from authorities. Indian Meteorological Department issues warnings - monitor them. Contact NDRF or call disaster helpline 1078.",
    
    "landslide": "For landslides in hilly regions (Himalayas, Western Ghats): Evacuate immediately if you notice cracks in land, tilting trees. Contact local authorities or call 108. During monsoon, avoid traveling in landslide-prone areas. Stay alert to warnings issued by District Administration.",
    
    "heat wave": "During heat waves (common in central/northern India): Stay indoors during peak hours (11am-3pm). Drink water frequently, wear light cotton clothes. Cover head when outside. Check on vulnerable people. Call 108 for medical emergencies.",
    
    "drought": "During droughts (Rajasthan, Maharashtra, Karnataka): Use water judiciously, collect rainwater when possible. Contact local authorities for water supply information. Government relief centers provide assistance. Dial 1077 (District Control Room) for emergencies.",
    
    "fire": "For fire emergencies in India: Call fire services at 101 immediately. Use nearest fire exit in buildings. In urban areas, know your building evacuation plan. Keep emergency contacts of local fire station. Cover nose and mouth with wet cloth when escaping through smoke.",
    
    "industrial disaster": "For industrial accidents/chemical spills: Move upwind from leak/spill area. Call emergency services at 108. Local disaster management authorities should be contacted at 1077. For chemical exposure, rinse affected area with clean water while awaiting medical help.",
    
    "building collapse": "During building collapse (urban areas): Call NDRF at 011-24363260 or local emergency at 108. If trapped, make noise periodically to alert rescuers. Stay near walls/sturdy furniture. Local municipal authorities should be informed immediately.",
    
    "emergency contacts": "Key Indian emergency numbers: National Emergency Number: 112, Ambulance: 108, Fire: 101, Disaster Management: 1078, Women Helpline: 1091, Police: 100, NDRF: 011-24363260, Railway Helpline: 139.",
    
    "first aid": "Basic first aid for emergencies in India: Keep antiseptic, bandages, and ORS ready. For snake bites (common in rural India), immobilize affected limb and rush to hospital. For heat stroke, move person to shade and apply wet cloths. Call 108 for ambulance.",
    
    "emergency kit": "Indian emergency kit should include: Potable water, dry food, torch with batteries, first aid supplies, copies of Aadhar/important documents in waterproof bag, emergency contact list, battery bank for mobile, battery-operated radio, and cash.",
    
    "evacuation": "During evacuation in India: Follow instructions from police/NDRF. Carry Aadhar and essential documents. If in flood zones (like Bihar/Assam), move to designated relief camps. Register yourself at relief camps for government assistance.",
    
    "monsoon": "During monsoon emergencies (June-September): Avoid waterlogged areas to prevent leptospirosis. Don't walk through flowing water. Keep emergency numbers handy. In Mumbai/Chennai, follow BMC/Chennai Corporation alerts for waterlogging updates.",
    
    "relief camps": "At Indian relief camps: Register with camp authorities. Aadhar may be needed for benefits. Medical teams visit regularly - inform them of health needs. Community kitchens provide food. Contact local officials if you need special assistance."
}

def get_llm_response(user_input):
    """
    Get response from Google Gemini API, enhanced with India-specific disaster information
    
    Args:
        user_input (str): The user's message
        
    Returns:
        str: Response message
    """
    try:
        # Check for relevant keywords to enhance context
        user_input_lower = user_input.lower()
        additional_context = "INDIAN DISASTER MANAGEMENT CONTEXT:\n"
        
        # Look for keywords to enhance context
        matched_keywords = []
        for keyword, knowledge in indian_disaster_knowledge.items():
            if keyword in user_input_lower:
                matched_keywords.append(keyword)
                additional_context += f"{keyword.upper()}: {knowledge}\n\n"
        
        # Add general Indian context if no specific matches
        if not matched_keywords:
            additional_context += """
            India faces diverse disasters including floods (Bihar/Assam/Bengal), cyclones (coastal regions), 
            earthquakes (Himalayan belt/Gujarat), heat waves (Central/North India), landslides (hilly regions), 
            and urban flooding (Mumbai/Chennai). The National Disaster Management Authority (NDMA) coordinates response.
            Key emergency contacts: National Emergency: 112, NDRF: 011-24363260, Disaster Helpline: 1078.
            """
            
        if matched_keywords:
            logger.info(f"Enhanced context with Indian disaster keywords: {matched_keywords}")
        
        try:
            # Get API key from environment variable
            api_key = os.environ.get("GOOGLE_API_KEY")
            if not api_key:
                logger.error("API key not configured")
                return "I'm having trouble accessing my knowledge base. For emergency assistance in India, please call the National Emergency Number 112 or Disaster Management Helpline 1078."
            
            # Configure the Gemini API
            genai.configure(api_key=api_key)
            
            # Create a Gemini model instance - using gemini-1.5-flash as in test_api.py
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            # Create the prompt with India-specific guidance
            prompt = f"""You are an Indian disaster management assistant for disaster preparedness in India. 
Provide information specific to Indian regions, authorities, and emergency procedures.
Only mention Indian emergency contacts, Indian disaster management bodies like NDRF, SDMA, and NDMA.
Keep responses brief, actionable, and appropriate for Indian context.
Only respond in Indian languages or English.
Mention location-specific information where relevant (e.g., cyclone preparedness for coastal states like Odisha or Tamil Nadu).
Always provide Indian helpline numbers such as 112 (National Emergency), 1078 (Disaster), 108 (Ambulance), or 101 (Fire).

{additional_context}
User: {user_input}
"""
            
            # Generate response
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    temperature=0.2,
                    top_p=0.8,
                    top_k=40,
                    max_output_tokens=300,
                ),
                safety_settings=[
                    {
                        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
                    }
                ]
            )
            
            logger.info("Successfully generated Gemini response for Indian context")
            return response.text
        
        except Exception as api_error:
            logger.error(f"API error details: {type(api_error).__name__}: {str(api_error)}")
            return "I'm having trouble connecting to my knowledge base. For emergencies in India, please call 112 (National Emergency Number) or 1078 (Disaster Management Helpline). Keep emergency supplies ready and follow instructions from local authorities."
    
    except Exception as e:
        logger.critical(f"Critical error in LLM response generation: {str(e)}")
        return "I apologize, but I'm experiencing technical difficulties. For emergency assistance in India, please contact 112 (National Emergency) or your local disaster management office."