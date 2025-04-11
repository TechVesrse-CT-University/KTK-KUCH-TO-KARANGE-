import logging
from googletrans import Translator
import langid
from utils.indian_languages import is_indian_language, get_language_name, get_default_language

logger = logging.getLogger(__name__)

def detect_language(text):
    """
    Detect the language of input text and verify it's an Indian language
    
    Args:
        text (str): Text to detect language
    
    Returns:
        str: Language code (e.g., 'hi', 'ta') or default if not Indian language
    """
    try:
        lang, _ = langid.classify(text)
        
        # If detected language is Indian, return it
        if is_indian_language(lang):
            logger.info(f"Detected Indian language: {get_language_name(lang)} ({lang})")
            return lang
        else:
            # If not Indian language, default to Hindi
            logger.warning(f"Detected non-Indian language: {lang}. Defaulting to {get_language_name(get_default_language())}")
            return get_default_language()
            
    except Exception as e:
        logger.error(f"Language detection error: {e}")
        return get_default_language()  # Default to Hindi on error

def translate_text(text, target_language='en'):
    """
    Translate text to specified Indian language or from Indian language to English
    
    Args:
        text (str): Text to translate
        target_language (str): Target language code
        
    Returns:
        str: Translated text or original text if translation fails
    """
    if not text:
        logger.warning("Empty text provided for translation")
        return text
        
    # If target isn't English and isn't Indian, default to Hindi
    if target_language != 'en' and not is_indian_language(target_language):
        logger.warning(f"Non-Indian target language requested: {target_language}. Defaulting to {get_language_name(get_default_language())}")
        target_language = get_default_language()
        
    # If target language is same as source or both are English, no need to translate
    if target_language == detect_language(text):
        return text
        
    translator = Translator()
    try:
        translated = translator.translate(text, dest=target_language)
        logger.info(f"Successfully translated text to {get_language_name(target_language)} ({target_language})")
        return translated.text
    except Exception as e:
        logger.error(f"Translation error: {e}")
        return text  # Return original text if translation fails