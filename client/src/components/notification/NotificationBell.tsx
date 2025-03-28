import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { Notification } from '../../types/notification';

interface NotificationBellProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications, onMarkAsRead }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  const recentNotifications = notifications.slice(0, 5); // Show only 5 most recent
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Bell animation variants
  const bellVariants = {
    initial: { rotate: 0 },
    ring: { 
      rotate: [0, 15, -15, 10, -10, 5, -5, 0],
      transition: { duration: 0.5 }
    }
  };
  
  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transformOrigin: 'top right' 
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { 
        duration: 0.2,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95, 
      y: -10,
      transition: { 
        duration: 0.1,
        ease: "easeIn"
      }
    }
  };
  
  const handleToggle = () => {
    setIsOpen(!isOpen);
  };
  
  const handleNotificationClick = (id: string) => {
    onMarkAsRead(id);
    setIsOpen(false);
  };
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors duration-200 focus:outline-none"
        aria-label="Notifications"
      >
        <motion.div
          variants={bellVariants}
          initial="initial"
          animate={unreadCount > 0 ? "ring" : "initial"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <BellIcon className="h-6 w-6" />
          
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full"
            >
              {unreadCount}
            </motion.span>
          )}
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200"
          >
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                <Link 
                  to="/notification" 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => setIsOpen(false)}
                >
                  View all
                </Link>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {recentNotifications.length === 0 ? (
                <div className="px-4 py-6 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              ) : (
                recentNotifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`px-4 py-3 border-b border-gray-100 last:border-b-0 ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <Link to={notification.link || '#'} className="block">
                      <div className="flex items-start">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {notification.title}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 truncate">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell; 