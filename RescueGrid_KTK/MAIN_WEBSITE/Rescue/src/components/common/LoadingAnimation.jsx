import React, { useEffect, useState, useRef } from 'react';
import Lottie from 'lottie-react';
import emergencyAnimation from '../../assets/animations/emergency-animation.json';
import ambulanceImage from '../../assets/images/Ambulance.png';

const LoadingAnimation = ({ onLoadingComplete }) => {
  const [typedText, setTypedText] = useState('');
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const audioRef = useRef(null);
  const fullText = 'RescueGrid';
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // Play siren sound when component mounts
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Lower volume
      audioRef.current.play().catch(error => {
        // Autoplay might be blocked by browser policies
        console.warn('Audio autoplay was prevented:', error);
      });
    }
    
    // Cleanup: stop audio when component unmounts
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  
  // Text typing effect
  useEffect(() => {
    if (typedText.length < fullText.length) {
      const timer = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1));
      }, 150);
      
      return () => clearTimeout(timer);
    } else {
      // Show subtitle after the name is fully typed
      setTimeout(() => setShowSubtitle(true), 300);
    }
  }, [typedText]);
  
  // Call onLoadingComplete when done
  useEffect(() => {
    if (loadingProgress >= 100 && typedText === fullText && showSubtitle) {
      const timer = setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [loadingProgress, typedText, showSubtitle, onLoadingComplete]);

  // Handle image load event
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 to-black z-50">
      {/* Audio element for siren sound */}
      <audio ref={audioRef} loop>
        <source src="/sounds/emergency-siren.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      
      {/* Ambulance image with animation */}
      <div className="w-72 h-72 mb-4 relative">
        <img 
          src={ambulanceImage} 
          alt="Emergency Ambulance" 
          onLoad={handleImageLoad}
          className={`w-full h-full object-cover rounded-lg shadow-2xl transform transition-all duration-500 ${
            imageLoaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          onError={(e) => {
            console.error("Image failed to load:", e);
            e.target.style.display = 'none';
          }}
        />

        {/* Red and blue emergency lights effect overlay */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <div className="absolute inset-0 bg-red-500 opacity-30 animate-pulse-fast mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-blue-500 opacity-20 animate-pulse-slow mix-blend-overlay"></div>
        </div>
        
        {/* Show Lottie as fallback if image doesn't load */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-900 rounded-lg">
            <Lottie
              animationData={emergencyAnimation}
              loop={true}
              autoplay={true}
            />
          </div>
        )}
      </div>
      
      {/* Animated title with typing effect */}
      <h1 className="text-5xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-pulse">
        <span className="inline-block animate-text-flicker">{typedText}</span>
        <span className="inline-block w-1 h-10 ml-1 bg-red-500 animate-cursor-blink"></span>
      </h1>
      
      {/* Subtitle with fade-in effect */}
      <div className={`transform transition-opacity duration-1000 ${showSubtitle ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-gray-300 text-xl mb-8 font-medium">Emergency Response System</p>
      </div>
      
      {/* Stylish loading bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div 
          className="h-full bg-gradient-to-r from-red-500 via-orange-500 to-red-500 rounded-full transition-all duration-300 animate-pulse-fast"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      
      {/* Loading percentage */}
      <p className="text-gray-400 text-sm font-mono">
        {loadingProgress}% LOADED
      </p>
      
      {/* Emergency vehicle animation */}
      <div className="absolute bottom-0 left-0 right-0 overflow-x-hidden h-16">
        <div className="emergency-vehicle">
          <div className="lights">
            <div className="red-light"></div>
            <div className="blue-light"></div>
          </div>
          <div className="vehicle-body"></div>
          <div className="wheels">
            <div className="wheel"></div>
            <div className="wheel"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;