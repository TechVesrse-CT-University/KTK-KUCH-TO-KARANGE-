# RescueX India - Disaster Management Chatbot

RescueX India is a specialized multilingual disaster management chatbot designed for the Indian context, providing critical emergency information through text and voice interfaces in multiple Indian languages. Built with Google's Gemini AI, it delivers contextual, location-specific guidance for disaster preparedness, response, and recovery.

## 🔑 Key Features

- **🇮🇳 India-Specific Disaster Knowledge**: Specialized information for floods, cyclones, earthquakes, landslides, droughts, heat waves, and other disasters common in India
- **🗣️ Multilingual Support**: Communicate in 20+ Indian languages including Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, and more
- **🚨 Location-Aware Guidance**: Region-specific disaster information (e.g., cyclone preparedness for coastal areas like Odisha or Tamil Nadu)
- **📞 Emergency Contacts**: Direct access to NDRF, SDMA, and other Indian emergency helplines (112, 1078, 108, 101)
- **🗣️ Voice Interface**: Natural voice interaction in multiple languages using speech recognition and text-to-speech
- **🤖 AI-Powered Intelligence**: Context-aware responses using Google's Gemini AI large language model
- **📱 Responsive Design**: Mobile-first interface for access during emergencies
- **🔄 Translation Services**: Automatic language detection and translation between Indian languages

## 💻 Technical Architecture

RescueX India Chatbot consists of several interconnected components:

```
┌─────────────────────────────────────────┐
│              Flask Web App              │
│       (Frontend + API Endpoints)        │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│         Core Processing Modules         │
├─────────────────┬─────────────────┬─────┴───────────┐
│  LLM Handler    │  Translation    │  Speech         │
│  (Gemini AI)    │  Services       │  Services       │
└─────────────────┴─────────────────┴─────────────────┘
```

- **Web Interface**: HTML/CSS/JS frontend for user interaction
- **Flask Backend**: Handles API requests and service coordination
- **LLM Handler**: Processes natural language using Google's Gemini AI
- **Translation Service**: Detects languages and translates content
- **Speech Service**: Handles voice input and speech synthesis

## 🛠️ Setup and Installation

### Prerequisites

- Python 3.9+
- Google API key for Gemini AI
- Internet connection for API services

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/RescueGrid_KTK.git
   cd RescueGrid_KTK/CHATBOTSERVER
   ```

2. **Create and activate virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the CHATBOTSERVER directory with:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   DEBUG=True
   PORT=5000
   HOST=0.0.0.0
   LOG_LEVEL=INFO
   ```

5. **Start the server**
   ```bash
   python app.py
   ```
   
   The server will start on http://localhost:5000

## 📋 Supported Indian Languages

RescueX India supports the following languages:

| Language  | Code | Native Name     |
|-----------|------|----------------|
| Hindi     | hi   | हिन्दी          |
| Tamil     | ta   | தமிழ்           |
| Telugu    | te   | తెలుగు          |
| Bengali   | bn   | বাংলা           |
| Marathi   | mr   | मराठी           |
| Gujarati  | gu   | ગુજરાતી         |
| Kannada   | kn   | ಕನ್ನಡ           |
| Malayalam | ml   | മലയാളം          |
| Punjabi   | pa   | ਪੰਜਾਬੀ          |
| Odia      | or   | ଓଡିଆ           |
| Assamese  | as   | অসমীয়া         |
| Urdu      | ur   | اردو           |
| English   | en   | English        |
| And more  | ...  | ...            |

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```
Returns the status of the server.

### Text Chat
```
POST /api/text
Content-Type: application/json

{
  "text": "What should I do during an earthquake?",
  "language": "hi"  // Optional, auto-detects if not provided
}
```

### Voice Chat
```
POST /api/voice
Content-Type: application/json

{
  "audio": "base64_encoded_audio_data"
}
```

## 🛡️ Disaster Knowledge Base

The chatbot contains specialized knowledge about various disasters in the Indian context:

- **Earthquakes**: Guidance for high-risk zones like Kashmir, Uttarakhand, Himachal Pradesh
- **Floods**: Preparedness for regions like Bihar, Assam, West Bengal
- **Cyclones**: Safety measures for coastal areas along Bay of Bengal, Arabian Sea
- **Landslides**: Precautions for hilly regions including Himalayas, Western Ghats
- **Heat Waves**: Protection strategies for central/northern India
- **Drought**: Water conservation for Rajasthan, Maharashtra, Karnataka
- **Fire**: Emergency procedures with Indian fire service contacts (101)
- **Industrial Disasters**: Chemical spill response and emergency contacts

## 🗣️ Voice Interaction Guide

The voice interface allows users to:

1. **Ask questions verbally** in their preferred language
2. **Receive spoken responses** in the same language
3. **Get emergency guidance** hands-free during critical situations

The system automatically detects the language from speech and responds accordingly.

## 🔧 Configuration Options

Edit `config.py` to customize:

- Server host and port
- Debug settings
- Logging configuration
- API keys and services
- File paths and storage locations

## ⚠️ Troubleshooting

### Common Issues:

- **API Key Errors**: Verify your Google API key is correctly set in the `.env` file
- **Language Detection Problems**: Ensure sufficient text length for accurate language detection
- **Voice Recognition Issues**: Check microphone permissions and audio quality
- **Server Connection Errors**: Verify the server is running and network connectivity is available
- **Translation Problems**: Some languages may have limited translation quality

## 🔗 Integration with RescueGrid

This chatbot server is part of the larger RescueGrid platform for disaster management:

- Shares disaster information with other RescueGrid components
- Provides multilingual interface for the entire platform
- Works alongside RescueConnect, DisasterPredict and RescueMap

## 🧪 Testing

To verify your installation:

1. Start the server: `python app.py`
2. Open http://localhost:5000 in your browser
3. Try asking questions in different Indian languages
4. Test the voice interface using your microphone

Alternatively, use the included test script to verify API connectivity:
```bash
python test_api.py
```

---

<div align="center">
  <p>RescueX India | Disaster Management Chatbot</p>
  <p>Developed as part of the RescueGrid Platform | Team KTK</p>
</div>