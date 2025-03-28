import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationItem from './NotificationItem';
import { Notification } from '../../types/notification';

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead,
  onClearAll
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>(notifications);
  
  // Apply filters when notifications or filter changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredNotifications(notifications);
    } else {
      setFilteredNotifications(notifications.filter(notification => !notification.isRead));
    }
  }, [notifications, filter]);
  
  const unreadCount = notifications.filter(notification => !notification.isRead).length;
  
  // Group notifications by date (today, yesterday, older)
  const groupedNotifications = filteredNotifications.reduce<Record<string, Notification[]>>((groups, notification) => {
    const date = new Date(notification.timestamp);
    const now = new Date();
    
    let groupKey: string;
    
    // Today
    if (date.toDateString() === now.toDateString()) {
      groupKey = 'Today';
    } 
    // Yesterday
    else {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = 'Earlier';
      }
    }
    
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    
    groups[groupKey].push(notification);
    return groups;
  }, {});
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
        
        <div className="flex items-center space-x-4">
          <div className="flex rounded-md shadow-sm" role="group">
            <button 
              type="button" 
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All
            </button>
            <button 
              type="button" 
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === 'unread' 
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Unread
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-red-500 rounded-full"
                >
                  {unreadCount}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {unreadCount > 0 
            ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
            : 'All caught up!'}
        </p>
        
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button 
              onClick={onMarkAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mark all as read
            </button>
          )}
          {filteredNotifications.length > 0 && (
            <>
              <span className="text-gray-300">|</span>
              <button 
                onClick={onClearAll}
                className="text-xs text-gray-600 hover:text-gray-800 transition-colors"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      </div>
      
      {filteredNotifications.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-10"
        >
          <p className="text-gray-500">No notifications to display</p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([dateGroup, groupNotifications]) => (
            <div key={dateGroup}>
              <h3 className="text-sm font-medium text-gray-500 mb-3">{dateGroup}</h3>
              <AnimatePresence>
                {groupNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    notification={notification} 
                    onMarkAsRead={onMarkAsRead} 
                  />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationList; 