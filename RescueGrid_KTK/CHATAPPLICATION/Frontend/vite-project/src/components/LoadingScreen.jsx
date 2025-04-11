import { motion } from 'framer-motion';
import { MdOutlineWavingHand } from 'react-icons/md';

const LoadingScreen = ({ message = "Loading..." }) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-tr from-primary-500/10 to-primary-500/20 dark:bg-gradient-to-tr dark:from-dark-900 dark:to-dark-800">
      <div className="text-center">
        <motion.div
          className="text-5xl text-primary-500 dark:text-primary-400 mb-6 mx-auto"
          animate={{ 
            y: [0, -15, 0],
            rotateZ: [0, -10, 10, -10, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <MdOutlineWavingHand />
        </motion.div>
        <h1 className="text-2xl font-bold text-dark-800 dark:text-white mb-3">RescueConnect</h1>
        <div className="relative h-2 w-64 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mx-auto">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;
