import { useSocket } from '../contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MdPerson, MdPersonOutline, MdSupervisedUserCircle } from 'react-icons/md';
import './UserList.css';

const UserList = () => {
  const { users } = useSocket();
  
  return (
    <motion.div 
      className="user-list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="user-list-header">
        <MdSupervisedUserCircle size={22} />
        <h3>Online Users ({users.length})</h3>
      </div>
      
      {users.length === 0 ? (
        <motion.div 
          className="empty-list"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <MdPersonOutline size={32} />
          <p>No users online</p>
        </motion.div>
      ) : (
        <motion.ul className="users-container">
          <AnimatePresence>
            {users.map(user => (
              <motion.li 
                key={user.id} 
                className="user-item"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                whileHover={{ 
                  backgroundColor: 'rgba(16, 185, 129, 0.05)', 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <div className="user-avatar">
                  {user.username ? user.username[0].toUpperCase() : '?'}
                </div>
                <div className="user-info">
                  <span className="user-name">{user.username}</span>
                  <span className="online-indicator"></span>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </motion.div>
  );
};

export default UserList;
