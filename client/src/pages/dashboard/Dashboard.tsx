import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import StudentDashboard from './StudentDashboard';
import AlumniDashboard from './AlumniDashboard';
import AdminDashboard from './AdminDashboard';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // If authenticated, we can proceed
    setLoading(false);
  }, [isAuthenticated, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Render the appropriate dashboard based on user role
  if (user?.role === 'admin') {
    return <AdminDashboard />;
  } else if (user?.role === 'alumni') {
    return <AlumniDashboard />;
  } else {
    // Default to student dashboard
    return <StudentDashboard />;
  }
};

export default Dashboard; 