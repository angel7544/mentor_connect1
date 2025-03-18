import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface RoleBasedRenderProps {
  studentView: React.ReactNode;
  alumniView: React.ReactNode;
  adminView?: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A component that renders different content based on the user's role.
 * This simplifies conditional rendering throughout the application.
 */
const RoleBasedRender: React.FC<RoleBasedRenderProps> = ({ 
  studentView, 
  alumniView,
  adminView,
  fallback = null
}) => {
  const { user } = useAuth();
  
  if (!user) return <>{fallback}</>;
  
  if (user.role === 'admin' && adminView) return <>{adminView}</>;
  if (user.role === 'student') return <>{studentView}</>;
  if (user.role === 'alumni') return <>{alumniView}</>;
  
  return <>{fallback}</>;
};

export default RoleBasedRender; 