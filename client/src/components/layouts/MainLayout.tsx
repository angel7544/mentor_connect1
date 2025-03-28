import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  HomeIcon, 
  UserIcon, 
  UsersIcon, 
  ChatBubbleLeftRightIcon, 
  DocumentTextIcon, 
  CalendarIcon, 
  ChatBubbleLeftIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  AcademicCapIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  DocumentDuplicateIcon,
  CalendarDaysIcon,
  ChatBubbleOvalLeftIcon,
  BoltIcon,
  LifebuoyIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore';
import NotificationBell from '../notification/NotificationBell';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore(state => ({ user: state.user }));
  const { isAuthenticated, logout } = useAuthStore();
  
  // Get notifications from the store
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead 
  } = useNotificationStore();
  
  // Fetch notifications on component mount
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated, fetchNotifications]);

  const navigation = [
    ...(isAuthenticated ? [] : [{ name: 'Home', href: '/', icon: HomeIcon }]), // Include Home only if not authenticated
    { name: 'Dashboard', href: '/dashboard', icon: SparklesIcon, protected: true },

   
    { name: 'Notification', href: '/notification', icon: BellIcon, protected: true },
    { name: 'Progress', href: '/progress', icon: ChartBarIcon, protected: true },
    { name: 'Profile', href: '/profile', icon: UserIcon, protected: true },
    { name: 'Mentorship', href: '/mentorship', icon: AcademicCapIcon, protected: true },
    { name: 'Messages', href: '/messages', icon: ChatBubbleBottomCenterTextIcon, protected: true },
    { name: 'Resources', href: '/resources', icon: BookOpenIcon, protected: true },
    { name: 'Events', href: '/events', icon: CalendarDaysIcon, protected: true },
    { name: 'Forum', href: '/forum', icon: UserGroupIcon, protected: true },
    { name: 'Chatbot', href: '/chatbot', icon: BoltIcon, protected: true },
    { name: 'Help', href: '/ContactUs', icon: LifebuoyIcon, protected: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-40 flex md:hidden ${sidebarOpen ? 'visible' : 'invisible'}`}>
        <div 
          className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setSidebarOpen(false)}
        />
        
        <div className={`relative flex w-full max-w-xs flex-1 flex-col bg-white pt-5 pb-4 transition duration-300 ease-in-out transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex flex-shrink-0 items-center px-4">
            <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">MentorConnect</Link>
          </div>
          
          <div className="mt-8 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-2 px-3">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                        location.pathname === item.href
                          ? 'text-primary-700 transform scale-110'
                          : 'text-gray-400 group-hover:text-gray-500 group-hover:scale-105'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {isAuthenticated && (
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md group"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
            <div className="flex flex-shrink-0 items-center px-4">
              <Link to="/" className="text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors duration-200">MentorConnect</Link>
            </div>
            
            <nav className="mt-8 flex-1 space-y-2 px-3">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      location.pathname === item.href
                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-5 w-5 flex-shrink-0 transition-all duration-200 ${
                        location.pathname === item.href
                          ? 'text-primary-700 transform scale-110'
                          : 'text-gray-400 group-hover:text-gray-500 group-hover:scale-105'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          {isAuthenticated && (
            <div className="border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-200 hover:shadow-md group"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
          
      {/* Main content */}
      <div className="flex flex-1 flex-col md:pl-64">
        <div className="sticky top-0 z-10 bg-white pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        {/* Header with notification bell */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-2 sm:px-6 md:px-8 flex justify-between items-center">
          <h1 className="text-lg font-medium text-gray-900">
            {navigation.find(item => item.href === location.pathname)?.name || 'Dashboard'}
          </h1>
          
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <NotificationBell 
                notifications={notifications} 
                onMarkAsRead={markAsRead} 
              />
              
              {/* User profile dropdown would go here */}
            </div>
          )}
        </div>
        
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;