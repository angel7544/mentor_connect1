import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';

interface AppProvidersProps {
  children: ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
};

export * from './AuthContext'; 