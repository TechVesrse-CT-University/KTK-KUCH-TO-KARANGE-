from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import logging
import tempfile
import base64
import time

from utils.speech_service import speech_to_text_from_file, text_to_speech_file
from utils.translation_service import detect_language, translate_text
from utils.llm_handler import get_llm_response
from config import UPLOAD_FOLDER, DEBUG, HOST, PORT

# Get logger
logger = logging.getLogger(__name__)

# Initialize the Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Error handling
@app.errorhandler(404)
def not_found(error):
    logger.warning(f"Route not found: {request.path}")
    return jsonify({"success": False, "error": "Not found"}), 404

@app.errorhandler(500)
def server_error(error):
    logger.error(f"Server error: {error}")
    return jsonify({"success": False, "error": "Internal server error"}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    logger.error(f"Unhandled exception: {str(e)}")
    return jsonify({"success": False, "error": "An unexpected error occurred"}), 500

# Request logging middleware
@app.before_request
def before_request():
    request.start_time = time.time()
    if request.path != "/api/health":  # Don't log health checks
        logger.info(f"Request received: {request.method} {request.path}")

@app.after_request
def after_request(response):
    if hasattr(request, 'start_time') and request.path != "/api/health":
        elapsed = time.time() - request.start_time
        logger.info(f"Request completed: {request.method} {request.path} - Status: {response.status_code} - Time: {elapsed:.3f}s")
    return response

@app.route('/')
def serve_frontend():
    """Serve the main frontend page"""
    return send_from_directory('static', 'index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    """Serve static files (JS, CSS, etc.)"""
    return send_from_directory('static', path)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    try:
        return jsonify({"status": "ok", "message": "API is running"})
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/text', methods=['POST'])
def text_chat():
    """Text-based chat endpoint"""
    try:
        data = request.json
        if not data or 'text' not in data:
            logger.warning("No text provided in request")
            return jsonify({"success": False, "error": "No text provided"}), 400
            
        user_input = data['text']
        if not user_input or not user_input.strip():
            logger.warning("Empty text provided")
            return jsonify({"success": False, "error": "Empty text provided"}), 400
        
        logger.info(f"Received text input: {user_input[:50]}...")
        
        # Detect or use provided language
        user_language = data.get('language', detect_language(user_input))
        
        # Translate to English if not already English
        if user_language != 'en':
            english_input = translate_text(user_input, target_language='en')
            if not english_input:
                logger.error("Translation failed")
                english_input = user_input  # Fallback to original input
            logger.info(f"Translated from {user_language} to English")
        else:
            english_input = user_input
        
        # Generate response
        response = get_llm_response(english_input)
        if not response:
            logger.error("Failed to generate response")
            return jsonify({
                "success": False,
                "error": "Failed to generate response"
            }), 500
        
        # Translate back to user language if needed
        if user_language != 'en':
            response_in_user_language = translate_text(response, target_language=user_language)
            if not response_in_user_language:
                logger.error("Response translation failed")
                response_in_user_language = response  # Fallback to English response
            logger.info(f"Translated response from English to {user_language}")
        else:
            response_in_user_language = response
        
        logger.info("Text response generated successfully")
        return jsonify({
            "success": True,
            "input": user_input,
            "response": response_in_user_language,
            "language": user_language
        })
        
    except Exception as e:
        logger.error(f"Error in text chat endpoint: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/voice', methods=['POST'])
def voice_chat():
    """Voice-based chat endpoint"""
    temp_filename = None
    try:
        # Check if audio is sent as file or base64 string
        if request.files and 'audio' in request.files:
            # Handle file upload
            audio_file = request.files['audio']
            logger.info("Processing audio from file upload")
            
            if not audio_file.filename:
                logger.warning("Empty file received")
                return jsonify({"success": False, "error": "Empty file received"}), 400
                
            try:
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                    audio_file.save(temp_file.name)
                    temp_filename = temp_file.name
            except Exception as e:
                logger.error(f"Error saving audio file: {e}")
                return jsonify({"success": False, "error": "Could not process audio file"}), 500
                
        elif request.json and 'audio' in request.json:
            # Handle base64 encoded audio
            logger.info("Processing audio from base64 data")
            
            try:
                audio_data = base64.b64decode(request.json['audio'])
                with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                    temp_file.write(audio_data)
                    temp_filename = temp_file.name
            except Exception as e:
                logger.error(f"Error processing base64 audio: {e}")
                return jsonify({"success": False, "error": "Could not decode audio data"}), 400
        else:
            logger.warning("No audio provided in request")
            return jsonify({"success": False, "error": "No audio provided"}), 400
        
        # Convert speech to text
        user_input = None
        try:
            user_input = speech_to_text_from_file(temp_filename)
        except Exception as e:
            logger.error(f"Speech to text error: {e}")
        finally:
            # Clean up temp file
            if temp_filename and os.path.exists(temp_filename):
                os.unlink(temp_filename)
                logger.info(f"Deleted temp file")
        
        if not user_input:
            logger.warning("Could not understand audio")
            return jsonify({
                "success": False,
                "error": "Could not understand audio"
            }), 400
        
        logger.info(f"Recognized text from audio: {user_input[:50]}...")
            
        # Detect language
        user_language = detect_language(user_input)
        
        # Translate to English if needed
        if user_language != 'en':
            english_input = translate_text(user_input, target_language='en')
            if not english_input:
                logger.error("Translation failed")
                english_input = user_input  # Fallback to original input
            logger.info(f"Translated from {user_language} to English")
        else:
            english_input = user_input
        
        # Generate response
        response = get_llm_response(english_input)
        if not response:
            logger.error("Failed to generate response")
            return jsonify({
                "success": False,
                "error": "Failed to generate response"
            }), 500
        
        # Translate back to user language if needed
        if user_language != 'en':
            response_in_user_language = translate_text(response, target_language=user_language)
            if not response_in_user_language:
                logger.error("Response translation failed")
                response_in_user_language = response  # Fallback to English response
            logger.info(f"Translated response from English to {user_language}")
        else:
            response_in_user_language = response
        
        # Convert response to speech
        audio_base64 = text_to_speech_file(response_in_user_language, user_language)
        if not audio_base64:
            logger.error("Failed to generate audio response")
            return jsonify({
                "success": True,
                "input": user_input,
                "response": response_in_user_language,
                "language": user_language,
                "error_audio": "Failed to generate audio"
            })
        
        logger.info(f"Voice response generated successfully")
        return jsonify({
            "success": True,
            "input": user_input,
            "response": response_in_user_language,
            "language": user_language,
            "audio": audio_base64
        })
        
    except Exception as e:
        logger.error(f"Error in voice chat endpoint: {str(e)}")
        # Clean up temp file if it exists
        if temp_filename and os.path.exists(temp_filename):
            try:
                os.unlink(temp_filename)
            except:
                pass
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    logger.info(f"Starting server on {HOST}:{PORT} (debug={DEBUG})")
    app.run(host=HOST, port=PORT, debug=DEBUG)