import logging

logger = logging.getLogger(__name__)

# Dictionary of Indian languages with ISO codes
INDIAN_LANGUAGES = {
    'hi': 'Hindi',
    'bn': 'Bengali',
    'te': 'Telugu',
    'mr': 'Marathi',
    'ta': 'Tamil',
    'ur': 'Urdu',
    'gu': 'Gujarati',
    'kn': 'Kannada',
    'ml': 'Malayalam',
    'pa': 'Punjabi',
    'or': 'Odia',
    'as': 'Assamese',
    'mai': 'Maithili',
    'sa': 'Sanskrit',
    'ks': 'Kashmiri',
    'ne': 'Nepali',
    'kok': 'Konkani',
    'mni': 'Manipuri',
    'brx': 'Bodo',
    'sat': 'Santali',
    'sd': 'Sindhi',
    'doi': 'Dogri',
    'en': 'English' # Also supporting English
}

def is_indian_language(language_code):
    """
    Check if the language code represents an Indian language
    
    Args:
        language_code (str): ISO language code (e.g., 'hi', 'ta')
        
    Returns:
        bool: True if it's an Indian language, False otherwise
    """
    return language_code in INDIAN_LANGUAGES

def get_language_name(language_code):
    """
    Get the full name of a language from its code
    
    Args:
        language_code (str): ISO language code
        
    Returns:
        str: Full name of the language or 'Unknown' if not found
    """
    return INDIAN_LANGUAGES.get(language_code, 'Unknown')

def get_all_indian_languages():
    """
    Get all supported Indian languages as a list of dicts
    
    Returns:
        list: List of dictionaries with code and name keys
    """
    return [{'code': code, 'name': name} for code, name in INDIAN_LANGUAGES.items()]

def get_default_language():
    """
    Get the default language (Hindi)
    
    Returns:
        str: Default language code
    """
    return 'hi'