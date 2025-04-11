import { motion, AnimatePresence } from 'framer-motion';
import { 
  MdMenu, 
  MdSearch, 
  MdModeNight, 
  MdLightMode,
  MdVideoCall,
  MdCall,
  MdMoreVert,
  MdFullscreen,
  MdViewComfy,
  MdRefresh
} from 'react-icons/md';
import './ChatHeader.css';

const ChatHeader = ({ 
  title, 
  onToggleSidebar, 
  isSidebarCollapsed, 
  connectionStatus,
  connectionError,
  viewMode,
  onChangeViewMode,
  theme,
  onChangeTheme,
  onReconnect
}) => {
  const viewModeIcons = {
    default: <MdViewComfy />,
    focus: <MdFullscreen />,
    compact: <MdViewComfy />
  };
  
  return (
    <header className="chat-header">
      <div className="header-left">
        <motion.button 
          className="toggle-sidebar-btn"
          onClick={onToggleSidebar}
          whileTap={{ scale: 0.9 }}
        >
          <MdMenu size={24} />
        </motion.button>
        
        <div className="channel-info">
          <h2># {title}</h2>
          <div className={`connection-status ${connectionStatus ? 'online' : connectionError ? 'error' : 'offline'}`}>
            <span className={`status-indicator ${connectionError ? 'error' : ''}`}></span>
            <span className="status-text">
              {connectionStatus ? 'Connected' : 
               connectionError ? 'Connection error' : 
               'Connecting...'}
            </span>
            
            {!connectionStatus && (
              <motion.button
                className="reconnect-btn"
                onClick={onReconnect}
                whileTap={{ scale: 0.9 }}
                title="Try reconnecting"
              >
                <MdRefresh size={14} />
              </motion.button>
            )}
          </div>
        </div>
      </div>
      
      <div className="header-center">
        <div className="search-container">
          <MdSearch className="search-icon" />
          <input type="text" placeholder="Search in conversation..." />
          <div className="search-shortcuts">⌘K</div>
        </div>
      </div>
      
      <div className="header-right">
        <motion.button
          className="header-action-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Start video call"
        >
          <MdVideoCall size={22} />
        </motion.button>
        
        <motion.button
          className="header-action-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Start audio call"
        >
          <MdCall size={20} />
        </motion.button>
        
        <motion.button
          className="header-action-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onChangeViewMode}
          title="Change view mode"
        >
          {viewModeIcons[viewMode]}
        </motion.button>
        
        <motion.button
          className="header-action-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onChangeTheme}
          title="Toggle light/dark mode"
        >
          {theme === 'light' ? <MdModeNight size={20} /> : <MdLightMode size={20} />}
        </motion.button>
        
        <motion.button
          className="header-action-btn"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="More options"
        >
          <MdMoreVert size={20} />
        </motion.button>
      </div>
    </header>
  );
};

export default ChatHeader;
