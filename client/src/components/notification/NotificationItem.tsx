import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  InformationCircleIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon 
} from '@heroicons/react/24/outline';
import { Notification } from '../../types/notification';

// Format date to a more readable format
const formatDate = (dateString: string | Date): string => {
  const date = new Date(dateString);
  const now = new Date();
  
  // Today
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Within the last week
  const daysAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (daysAgo < 7) {
    return `${daysAgo} days ago`;
  }
  
  // Older
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onMarkAsRead }) => {
  const getIcon = () => {
    switch(notification.type) {
      case 'info':
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-amber-500" />;
      case 'error':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };
  
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={handleClick}
      className={`relative p-4 mb-3 rounded-lg shadow-sm border ${
        notification.isRead 
          ? 'bg-white border-gray-200' 
          : 'bg-blue-50 border-blue-200'
      } cursor-pointer hover:shadow-md transition-shadow duration-200`}
    >
      <Link to={notification.link || '#'} className="block">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {notification.sender?.avatar ? (
              <img 
                src={notification.sender.avatar} 
                alt={notification.sender.name} 
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="flex-shrink-0">
                {getIcon()}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between">
              <p className={`text-sm font-medium ${notification.isRead ? 'text-gray-800' : 'text-blue-900'}`}>
                {notification.title}
              </p>
              <span className="text-xs text-gray-500">
                {formatDate(notification.timestamp)}
              </span>
            </div>
            
            <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-600' : 'text-blue-800'}`}>
              {notification.message}
            </p>
            
            {notification.sender && (
              <p className="text-xs mt-2 text-gray-500">
                From: {notification.sender.name}
              </p>
            )}
          </div>
        </div>

        {!notification.isRead && (
          <motion.div 
            className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-600"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.3,
              type: "spring",
              stiffness: 500
            }}
          />
        )}
      </Link>
    </motion.div>
  );
};

export default NotificationItem; 