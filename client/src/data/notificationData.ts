import { Notification } from '../types/notification';

// Helper function to generate dates relative to now
const getRelativeDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString();
};

export const dummyNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Mentorship Request',
    message: 'Raj Sharma has requested you as a mentor. Review their profile and respond to their request.',
    type: 'info',
    timestamp: getRelativeDate(0), // Today
    isRead: false,
    link: '/mentorship/requests',
    sender: {
      id: 'user1',
      name: 'Raj Sharma',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    }
  },
  {
    id: '2',
    title: 'Session Reminder',
    message: 'Your mentoring session with Priya Patel is scheduled for tomorrow at 2:00 PM.',
    type: 'warning',
    timestamp: getRelativeDate(1), // Yesterday
    isRead: true,
    link: '/calendar',
    sender: {
      id: 'user2',
      name: 'Priya Patel',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    }
  },
  {
    id: '3',
    title: 'New Resource Available',
    message: 'A new resource "Introduction to Machine Learning" has been added to your learning path.',
    type: 'success',
    timestamp: getRelativeDate(2),
    isRead: false,
    link: '/resources/ml-intro',
  },
  {
    id: '4',
    title: 'Profile Update Required',
    message: 'Please complete your profile information to help us match you with the right mentors.',
    type: 'error',
    timestamp: getRelativeDate(3),
    isRead: false,
    link: '/profile/edit',
  },
  {
    id: '5',
    title: 'Feedback Received',
    message: 'Arjun Singh has left feedback on your recent mentoring session.',
    type: 'info',
    timestamp: getRelativeDate(4),
    isRead: true,
    link: '/feedback',
    sender: {
      id: 'user3',
      name: 'Arjun Singh',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  },
  {
    id: '6',
    title: 'New Forum Post',
    message: 'There\'s a new discussion in the "Career Transition" forum you follow.',
    type: 'info',
    timestamp: getRelativeDate(5),
    isRead: true,
    link: '/forum/career-transition',
  },
  {
    id: '7',
    title: 'Certificate Available',
    message: 'Your certificate for completing "Leadership Skills" course is now available.',
    type: 'success',
    timestamp: getRelativeDate(6),
    isRead: false,
    link: '/certificates',
  },
  {
    id: '8',
    title: 'Account Verification',
    message: 'Please verify your email address to access all features of MentorConnect.',
    type: 'warning',
    timestamp: getRelativeDate(7),
    isRead: false,
    link: '/settings/verify-email',
  },
  {
    id: '9',
    title: 'Meeting Invitation',
    message: 'Neha Gupta has invited you to join a group mentoring session on Data Science.',
    type: 'info',
    timestamp: getRelativeDate(2),
    isRead: false,
    link: '/meetings/invitation',
    sender: {
      id: 'user4',
      name: 'Neha Gupta',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    }
  },
  {
    id: '10',
    title: 'Project Feedback Request',
    message: 'Vikram Malhotra is requesting feedback on their portfolio project.',
    type: 'warning',
    timestamp: getRelativeDate(1),
    isRead: false,
    link: '/feedback/requests',
    sender: {
      id: 'user5',
      name: 'Vikram Malhotra',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    }
  }
]; 