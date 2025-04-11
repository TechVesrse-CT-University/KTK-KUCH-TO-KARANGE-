import { motion } from 'framer-motion';
import { MdLogout } from 'react-icons/md';
import './SidebarNav.css';

const SidebarNav = ({ navItems, onLogout, collapsed }) => {
  return (
    <div className="sidebar-nav">
      <div className="nav-logo">
        <motion.div 
          className="logo-icon"
          animate={{ rotate: collapsed ? 0 : [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          RC
        </motion.div>
      </div>
      
      <div className="nav-items">
        {navItems.map((item, index) => (
          <motion.div 
            key={index}
            className={`nav-item ${item.active ? 'active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {item.icon}
            {!collapsed && <span className="nav-text">{item.text}</span>}
          </motion.div>
        ))}
      </div>
      
      <div className="nav-footer">
        <motion.div 
          className="logout-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onLogout}
        >
          <MdLogout size={24} />
          {!collapsed && <span className="nav-text">Logout</span>}
        </motion.div>
      </div>
    </div>
  );
};

export default SidebarNav;
