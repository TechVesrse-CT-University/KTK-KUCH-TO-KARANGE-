import speech_recognition as sr
import pyttsx3
import base64
import tempfile
import os
import logging

logger = logging.getLogger(__name__)

def voice_to_text():
    """
    Record audio from microphone and convert to text
    
    Returns:
        str or None: Transcribed text or None if failed
    """
    recognizer = sr.Recognizer()
    try:
        with sr.Microphone() as source:
            logger.info("Listening to microphone...")
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio = recognizer.listen(source, timeout=10, phrase_time_limit=10)
            logger.info("Audio captured, processing...")
            
            try:
                text = recognizer.recognize_google(audio)
                logger.info(f"Recognized Text: {text}")
                return text
            except sr.UnknownValueError:
                logger.warning("Could not understand audio")
                return None
            except sr.RequestError as e:
                logger.error(f"Google Speech API error: {e}")
                return None
    except Exception as e:
        logger.error(f"Microphone error: {e}")
        return None

def speech_to_text_from_file(audio_file_path):
    """
    Convert speech from an audio file to text
    
    Args:
        audio_file_path (str): Path to audio file
        
    Returns:
        str or None: Transcribed text or None if failed
    """
    if not os.path.exists(audio_file_path):
        logger.error(f"Audio file not found: {audio_file_path}")
        return None
        
    recognizer = sr.Recognizer()
    try:
        with sr.AudioFile(audio_file_path) as source:
            audio = recognizer.record(source)
            try:
                text = recognizer.recognize_google(audio)
                logger.info(f"Recognized Text from File: {text}")
                return text
            except sr.UnknownValueError:
                logger.warning("Could not understand audio file")
                return None
            except sr.RequestError as e:
                logger.error(f"Google Speech API error: {e}")
                return None
    except Exception as e:
        logger.error(f"Error processing audio file: {e}")
        return None

def text_to_voice(text, language='en'):
    """
    Convert text to speech and play it
    
    Args:
        text (str): Text to convert to speech
        language (str): Language code
    """
    if not text:
        logger.warning("Empty text provided to speech engine")
        return
        
    try:
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)  # Speed of speech
        
        if language != 'en':  # Try to set voice based on language
            try:
                voices = engine.getProperty('voices')
                for voice in voices:
                    if language in voice.id.lower():
                        engine.setProperty('voice', voice.id)
                        break
            except Exception as e:
                logger.warning(f"Error setting voice for language {language}: {e}")
        
        engine.say(text)
        engine.runAndWait()
        logger.info(f"Successfully played speech for text: '{text[:30]}...'")
    except Exception as e:
        logger.error(f"Text to speech error: {e}")

def text_to_speech_file(text, language='en'):
    """
    Convert text to speech and save to a file, return as base64
    
    Args:
        text (str): Text to convert to speech
        language (str): Language code
        
    Returns:
        str or None: Base64 encoded audio or None if failed
    """
    if not text:
        logger.warning("Empty text provided to speech file generator")
        return None
        
    try:
        engine = pyttsx3.init()
        engine.setProperty('rate', 150)  # Speed of speech
        
        if language != 'en':  # Try to set voice based on language
            try:
                voices = engine.getProperty('voices')
                for voice in voices:
                    if language in voice.id.lower():
                        engine.setProperty('voice', voice.id)
                        break
            except Exception as e:
                logger.warning(f"Error setting voice for language {language}: {e}")
        
        # Save to temp file
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
            temp_filename = temp_file.name
        
        engine.save_to_file(text, temp_filename)
        engine.runAndWait()
        
        # Read the file as binary
        with open(temp_filename, 'rb') as audio_file:
            audio_data = audio_file.read()
        
        # Clean up temp file
        os.unlink(temp_filename)
        
        # Return base64 encoded audio
        logger.info(f"Successfully created speech audio file for text: '{text[:30]}...'")
        return base64.b64encode(audio_data).decode('utf-8')
    except Exception as e:
        logger.error(f"Text to speech file error: {e}")
        return None