import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useAuthStore from '../../store/authStore';

/**
 * Main Dashboard page component with role-based views for students and alumni
 * Includes a fallback implementation that works even when API calls fail
 */
const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Simulate API call to fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
      } catch (err) {
        console.error("Error in DashboardPage:", err);
        setError("Couldn't load dashboard. Using fallback display.");
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner size="large" text="Loading dashboard..." />;
  }

  // Fallback dashboard content when APIs fail
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          {user?.role === 'alumni' ? 'Alumni' : 'Student'} Dashboard
        </h1>
        {error && (
          <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded">
            {error}
          </div>
        )}
      </div>
      
      {/* Quick navigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <NavigationCard 
          title="Profile" 
          description="View and update your profile information"
          path={`/${user?.role}/profile`}
        />
        <NavigationCard 
          title="Mentorship" 
          description={user?.role === 'alumni' ? "Manage your mentees" : "Find mentors and manage requests"}
          path={`/${user?.role}/mentorship`}
        />
        <NavigationCard 
          title="Resources" 
          description="Access learning resources and materials"
          path={`/${user?.role}/resources`}
        />
        <NavigationCard 
          title="Messages" 
          description="Check your messages and conversations"
          path={`/${user?.role}/messages`}
        />
        <NavigationCard 
          title="Events" 
          description="View upcoming events and workshops"
          path={`/${user?.role}/events`}
        />
        <NavigationCard 
          title="Forum" 
          description="Join discussions with peers and mentors"
          path={`/${user?.role}/forum`}
        />
        {user?.role === 'alumni' && (
          <NavigationCard 
            title="Analytics" 
            description="View impact and mentorship statistics"
            path="/alumni/analytics"
          />
        )}
      </div>
      
      {/* Debugging information - only in development */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-8 p-4 border border-gray-300 rounded">
          <h2 className="text-lg font-semibold">Debug Info:</h2>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify({ user, isAuthenticated }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Simple navigation card component
const NavigationCard: React.FC<{
  title: string;
  description: string;
  path: string;
}> = ({ title, description, path }) => {
  return (
    <Link 
      to={path}
      className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
    >
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Link>
  );
};

export default DashboardPage; 