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
  ChartBarIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import useAuthStore from '../../store/authStore';

// Define the type for navigation items
interface NavigationItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement> & { title?: string; titleId?: string; }>;
  protected?: boolean;
}

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore(state => ({ user: state.user }));
  const { isAuthenticated, logout } = useAuthStore();
  const userRole = user?.role || '';
  
  // Base navigation items for all users
  const baseNavigation: NavigationItem[] = [
    ...(isAuthenticated ? [] : [{ name: 'Home', href: '/', icon: HomeIcon }]), // Include Home only if not authenticated
  ];
  
  // Role-specific navigation items
  const studentNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon, protected: true },
    { name: 'Profile', href: '/student/profile', icon: UserIcon, protected: true },
    { name: 'Mentorship', href: '/student/mentorship', icon: UsersIcon, protected: true },
    { name: 'Messages', href: '/student/messages', icon: ChatBubbleLeftRightIcon, protected: true },
    { name: 'Resources', href: '/student/resources', icon: DocumentTextIcon, protected: true },
    { name: 'Events', href: '/student/events', icon: CalendarIcon, protected: true },
    { name: 'Forum', href: '/student/forum', icon: ChatBubbleLeftIcon, protected: true },
  ];
  
  const alumniNavigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/alumni/dashboard', icon: HomeIcon, protected: true },
    { name: 'Profile', href: '/alumni/profile', icon: UserIcon, protected: true },
    { name: 'Mentorship', href: '/alumni/mentorship', icon: UsersIcon, protected: true },
    { name: 'Messages', href: '/alumni/messages', icon: ChatBubbleLeftRightIcon, protected: true },
    { name: 'Resources', href: '/alumni/resources', icon: DocumentTextIcon, protected: true },
    { name: 'Events', href: '/alumni/events', icon: CalendarIcon, protected: true },
    { name: 'Forum', href: '/alumni/forum', icon: ChatBubbleLeftIcon, protected: true },
    { name: 'Analytics', href: '/alumni/analytics', icon: ChartBarIcon, protected: true },
  ];
  
  // Common items for all authenticated users
  const commonNavigation: NavigationItem[] = [
    { name: 'Chatbot', href: '/chatbot', icon: ChatBubbleLeftIcon, protected: true },
    { name: 'Help', href: '/contact', icon: QuestionMarkCircleIcon, protected: true },
  ];
  
  // Select navigation items based on user role
  const roleBasedNavigation = isAuthenticated ? (
    userRole === 'alumni' ? alumniNavigation :
    userRole === 'admin' ? [] : // Admin navigation would go here
    studentNavigation
  ) : [];
  
  // Combine all navigation items
  const navigation: NavigationItem[] = [
    ...baseNavigation,
    ...roleBasedNavigation,
    ...commonNavigation
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  // Redirect legacy routes to role-specific routes
  useEffect(() => {
    if (isAuthenticated && location.pathname) {
      const legacyRoutes = ['/dashboard', '/profile', '/mentorship', '/messages', '/resources', '/events', '/forum'];
      if (legacyRoutes.includes(location.pathname)) {
        const newPath = `/${userRole}${location.pathname}`;
        navigate(newPath, { replace: true });
      }
    }
  }, [location.pathname, isAuthenticated, userRole, navigate]);

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
            <Link to="/" className="text-xl font-bold text-primary-600">MentorConnect</Link>
          </div>
          
          <div className="mt-5 h-0 flex-1 overflow-y-auto">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                      location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-4 h-6 w-6 flex-shrink-0 ${
                        location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                          ? 'text-primary-700'
                          : 'text-gray-400 group-hover:text-gray-500'
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
                className="w-full text-left px-2 py-2 text-base font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                Logout
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
              <Link to="/" className="text-xl font-bold text-primary-600">MentorConnect</Link>
            </div>
            
            <nav className="mt-5 flex-1 space-y-1 px-2">
              {navigation.map((item) => {
                if (item.protected && !isAuthenticated) return null;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        location.pathname === item.href || location.pathname.startsWith(item.href + '/')
                          ? 'text-primary-700'
                          : 'text-gray-400 group-hover:text-gray-500'
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
                className="w-full text-left px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md"
              >
                Logout
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