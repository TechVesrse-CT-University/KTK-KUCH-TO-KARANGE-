import os
import logging
from logging.handlers import RotatingFileHandler
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Google API Key
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY", "")

# Application settings
DEBUG = os.environ.get("DEBUG", "True").lower() == "true"
PORT = int(os.environ.get("PORT", 5000))
HOST = os.environ.get("HOST", "0.0.0.0")

# File paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
LOG_FILE = os.path.join(BASE_DIR, "logs", "app.log")

# Configure logging
def setup_logging():
    """Configure application logging"""
    # Create logs directory if it doesn't exist
    log_dir = os.path.dirname(LOG_FILE)
    if log_dir and not os.path.exists(log_dir):
        os.makedirs(log_dir)
        
    # Configure root logger
    logger = logging.getLogger()
    
    # Set log level
    log_level = os.environ.get("LOG_LEVEL", "INFO").upper()
    numeric_level = getattr(logging, log_level, logging.INFO)
    logger.setLevel(numeric_level)
    
    # Create console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(numeric_level)
    
    # Create file handler
    file_handler = RotatingFileHandler(
        LOG_FILE, 
        maxBytes=10*1024*1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(numeric_level)
    
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Add formatter to handlers
    console_handler.setFormatter(formatter)
    file_handler.setFormatter(formatter)
    
    # Add handlers to logger
    logger.addHandler(console_handler)
    logger.addHandler(file_handler)
    
    return logger

# Initialize logging
logger = setup_logging()