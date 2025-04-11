import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdSearch, MdClose } from 'react-icons/md';

// Mock GIF data - in a real app you would use a GIF API like Giphy or Tenor
const MOCK_GIFS = [
  { id: 'gif1', url: 'https://media.giphy.com/media/l0HlNaQ6gWfllcjDO/giphy.gif', alt: 'Emergency response' },
  { id: 'gif2', url: 'https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif', alt: 'Communication' },
  { id: 'gif3', url: 'https://media.giphy.com/media/xT9DPIBYf0pAviBLzO/giphy.gif', alt: 'Message received' },
  { id: 'gif4', url: 'https://media.giphy.com/media/nGtOFccLzujug/giphy.gif', alt: 'Alert' },
  { id: 'gif5', url: 'https://media.giphy.com/media/l4FGjORgOyZJCzPMs/giphy.gif', alt: 'Helicopter rescue' },
  { id: 'gif6', url: 'https://media.giphy.com/media/3oKIPt9CnNfdB1dnyw/giphy.gif', alt: 'Assistance' },
  { id: 'gif7', url: 'https://media.giphy.com/media/3o7TKG9KGvq3RQTlV6/giphy.gif', alt: 'Operation' },
  { id: 'gif8', url: 'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif', alt: 'Shocked' },
];

const GIF_CATEGORIES = [
  { id: 'trending', name: 'Trending' },
  { id: 'emergency', name: 'Emergency' },
  { id: 'response', name: 'Response' },
  { id: 'safety', name: 'Safety' },
  { id: 'medical', name: 'Medical' },
];

const GifPicker = ({ onSelectGif, onClose, darkMode = false }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('trending');
  const [gifs, setGifs] = useState(MOCK_GIFS);
  const [loading, setLoading] = useState(false);

  // In a real app, this would fetch from a GIF API based on search or category
  useEffect(() => {
    setLoading(true);
    
    // Simulate API call latency
    const timeout = setTimeout(() => {
      // Just return our mock data for demo purposes
      setGifs(MOCK_GIFS);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timeout);
  }, [category, searchQuery]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // Would trigger a search against the API in a real implementation
  };

  return (
    <motion.div 
      className={`w-80 max-h-96 rounded-xl shadow-lg ${
        darkMode ? 'bg-dark-800 border-dark-700' : 'bg-white border-gray-200'
      } border overflow-hidden`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
    >
      <div className={`p-3 border-b ${darkMode ? 'border-dark-700' : 'border-gray-200'}`}>
        <form className="flex gap-2" onSubmit={handleSearch}>
          <div className="relative flex-1">
            <input
              type="text"
              className={`pl-8 pr-2 py-2 w-full rounded-lg text-sm ${
                darkMode 
                  ? 'bg-dark-700 border-dark-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
              } border focus:outline-none focus:ring-2 focus:ring-primary-400`}
              placeholder="Search GIFs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <MdSearch className={`absolute left-2.5 top-2.5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          </div>
          <button 
            type="button"
            className={`p-1.5 rounded-lg ${darkMode ? 'hover:bg-dark-700' : 'hover:bg-gray-100'}`}
            onClick={onClose}
          >
            <MdClose size={20} className={darkMode ? 'text-gray-300' : 'text-gray-500'} />
          </button>
        </form>
      </div>
      
      {/* Categories */}
      <div className={`flex overflow-x-auto p-2 gap-2 ${darkMode ? 'bg-dark-900/30' : 'bg-gray-50'}`}>
        {GIF_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
              category === cat.id
                ? `${darkMode ? 'bg-primary-900/40 text-primary-400' : 'bg-primary-100 text-primary-700'}`
                : `${darkMode ? 'bg-dark-700 text-gray-300' : 'bg-white text-gray-700'}`
            } border ${darkMode ? 'border-dark-600' : 'border-gray-200'}`}
            onClick={() => setCategory(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>
      
      {/* GIFs grid */}
      <div 
        className={`${darkMode ? 'bg-dark-800' : 'bg-white'} p-2 grid grid-cols-2 gap-2 overflow-y-auto h-60`}
      >
        {loading ? (
          // Loading skeleton
          [...Array(4)].map((_, i) => (
            <div 
              key={i} 
              className={`aspect-video animate-pulse ${darkMode ? 'bg-dark-700' : 'bg-gray-200'} rounded`} 
            />
          ))
        ) : gifs.length > 0 ? (
          // GIFs display
          gifs.map((gif) => (
            <motion.div
              key={gif.id}
              className="relative aspect-video rounded overflow-hidden border border-gray-200 cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectGif(gif.url)}
            >
              <img 
                src={gif.url} 
                alt={gif.alt} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </motion.div>
          ))
        ) : (
          // No results
          <div className="col-span-2 flex flex-col items-center justify-center h-full">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No GIFs found</p>
          </div>
        )}
      </div>
      
      <div className={`px-3 py-2 text-xs ${darkMode ? 'text-gray-400 bg-dark-900/20' : 'text-gray-500 bg-gray-50'} text-center`}>
        Powered by RescueConnect GIFs
      </div>
    </motion.div>
  );
};

export default GifPicker;
