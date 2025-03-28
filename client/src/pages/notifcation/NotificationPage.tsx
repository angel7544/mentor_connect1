import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import NotificationList from '../../components/notification/NotificationList';
import useNotificationStore from '../../store/notificationStore';

const NotificationPage: React.FC = () => {
  const { 
    notifications, 
    loading, 
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Page transition animation
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1 
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="max-w-4xl mx-auto"
    >
      <div className="py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Notifications</h1>
          <p className="text-gray-600 mt-1">
            Stay updated with your mentorship activities and alerts
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{
                rotate: 360
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
          </div>
        ) : (
          <NotificationList
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onClearAll={clearAll}
          />
        )}
      </div>
    </motion.div>
  );
};

export default NotificationPage;
