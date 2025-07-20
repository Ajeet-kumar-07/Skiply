import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const StudentAvatar = () => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    navigate('/student/dashboard');
  };

  return (
    <div
      style={wrapper}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        style={avatarCircle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        🧑‍🎓
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            style={tooltip}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
          >
            Wassup, Scholar! 🧠
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Navbar-friendly styles
const wrapper = {
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',
  marginRight: '20px',
  position: 'relative'
};

const avatarCircle = {
  width: '36px',
  height: '36px',
  backgroundColor: '#5C6BC0',
  borderRadius: '50%',
  color: '#fff',
  fontSize: '18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
};

const tooltip = {
  position: 'absolute',
  right: '45px', // pop to the left of the avatar
  backgroundColor: '#fff',
  color: '#5C6BC0',
  padding: '6px 10px',
  borderRadius: '6px',
  fontWeight: 'bold',
  fontSize: '13px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  whiteSpace: 'nowrap'
};

export default StudentAvatar;
