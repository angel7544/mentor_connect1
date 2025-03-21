import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const handleDashboardClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login?returnUrl=/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-6xl font-bold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Page not found</h2>
        <p className="text-gray-600 mb-8">
          Please check the URL in the address bar and try again.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/" 
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go back home
          </Link>
          <button 
            onClick={handleDashboardClick}
            className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 transition-colors"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 