import React from 'react';
import { Outlet, Link, Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

const AuthLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/">
          <h2 className="text-center text-3xl font-extrabold text-primary-600">MentorConnect</h2>
        </Link>
        <p className="mt-2 text-center text-sm text-gray-600">
          Student-Alumni Mentorship Platform
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 