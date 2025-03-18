import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

/**
 * A debugging component to show the current authentication state
 */
const AuthDebug: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  
  return (
    <div className="border border-gray-300 rounded p-4 mb-4 bg-gray-50">
      <h3 className="text-sm font-semibold mb-2">Auth Debugging</h3>
      <p className="text-xs mb-1">Loading: {loading ? 'true' : 'false'}</p>
      <p className="text-xs mb-1">Is Authenticated: {isAuthenticated ? 'true' : 'false'}</p>
      <p className="text-xs mb-1">User: {user ? 'exists' : 'null'}</p>
      {user && (
        <div className="mt-2">
          <p className="text-xs">User ID: {user._id}</p>
          <p className="text-xs">Name: {user.firstName} {user.lastName}</p>
          <p className="text-xs">Email: {user.email}</p>
          <p className="text-xs">Role: {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default AuthDebug; 