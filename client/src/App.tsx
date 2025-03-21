import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import NotFound from './pages/NotFound';
import Chatbot from './pages/chatbot/chatbot';
import ContactUs from './pages/ContactUs/ContactUs';
import DashboardPage from './pages/dashboard/DashboardPage';

// Student Pages
import StudentDashboard from './pages/dashboard/StudentDashboard';
import StudentProfile from './pages/profile/StudentProfile';
import StudentMentorship from './pages/mentorship/StudentMentorship';
import StudentResources from './pages/resources/StudentResources';
import StudentEvents from './pages/events/StudentEvents';
import StudentForum from './pages/forum/StudentForum';
import StudentMessages from './pages/messages/StudentMessages';

// Alumni Pages
import AlumniDashboard from './pages/dashboard/AlumniDashboard';
import AlumniProfile from './pages/profile/AlumniProfile';
import AlumniMentorship from './pages/mentorship/AlumniMentorship';
import AlumniResources from './pages/resources/AlumniResources';
import AlumniEvents from './pages/events/AlumniEvents';
import AlumniForum from './pages/forum/AlumniForum';
import AlumniMessages from './pages/messages/AlumniMessages';
import AnalyticsPage from './pages/analytics/AnalyticsPage';

// Temporary placeholder component until TypeScript issue is resolved
const ResourceActivity: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Resource Analytics</h1>
      <p>Resource analytics are temporarily unavailable.</p>
      <button 
        onClick={() => window.history.back()}
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded"
      >
        Go Back
      </button>
    </div>
  );
};

// Protected route component with role-based access
const RoleProtectedRoute = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode, 
  allowedRoles: string[] 
}) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// General protected route without role checking
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Dashboard redirect based on user role
const DashboardRedirect = () => {
  const { user, isAuthenticated } = useAuthStore();
  
  // Add debug logging
  console.log("Dashboard redirect - Auth state:", { isAuthenticated, userRole: user?.role });
  
  if (!isAuthenticated) {
    return <Navigate to="/login?returnUrl=/dashboard" replace />;
  }
  
  // Use the fallback DashboardPage if we're seeing errors
  // This provides a way to navigate to other parts of the app
  // even if the specific dashboard components are failing
  const useFallback = new URLSearchParams(window.location.search).get('fallback') === 'true';
  
  if (useFallback) {
    return <DashboardPage />;
  }
  
  // Use direct return with specific routes
  if (user?.role === 'alumni') return <AlumniDashboard />;
  if (user?.role === 'student') return <StudentDashboard />;
  if (user?.role === 'admin') return <div>Admin Dashboard</div>;
  
  // Fallback for unknown roles
  return <StudentDashboard />;
};

function App() {
  const { user, isAuthenticated } = useAuthStore();
  
  // Debug authentication state on every render
  console.log('App render - Auth state:', { 
    isAuthenticated, 
    user: user ? { id: user._id, role: user.role } : null,
    currentPath: window.location.pathname
  });
  
  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>
        
        {/* Dashboard redirect */}
        <Route path="/dashboard" element={<DashboardRedirect />} />
        
        {/* Student routes */}
        <Route element={<MainLayout />}>
          <Route path="/student">
            <Route 
              path="dashboard" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentDashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentProfile />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="mentorship" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentMentorship />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="messages" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentMessages />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="resources" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentResources />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="events" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentEvents />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="forum" 
              element={
                <RoleProtectedRoute allowedRoles={['student']}>
                  <StudentForum />
                </RoleProtectedRoute>
              } 
            />
          </Route>
        </Route>
        
        {/* Alumni routes */}
        <Route element={<MainLayout />}>
          <Route path="/alumni">
            <Route 
              path="dashboard" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AlumniDashboard />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="profile" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AlumniProfile />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="mentorship" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AlumniMentorship />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="messages" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AlumniMessages />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="resources" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AlumniResources />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="resource-activity" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <ResourceActivity />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="events" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AlumniEvents />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="forum" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AlumniForum />
                </RoleProtectedRoute>
              } 
            />
            <Route 
              path="analytics" 
              element={
                <RoleProtectedRoute allowedRoles={['alumni']}>
                  <AnalyticsPage />
                </RoleProtectedRoute>
              } 
            />
          </Route>
        </Route>
        
        {/* Common protected routes */}
        <Route element={<MainLayout />}>
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/contact" 
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Legacy routes redirects for backward compatibility */}
        <Route path="/profile" element={<DashboardRedirect />} />
        <Route path="/mentorship" element={<DashboardRedirect />} />
        <Route path="/messages" element={<DashboardRedirect />} />
        <Route path="/resources" element={<DashboardRedirect />} />
        <Route path="/events" element={<DashboardRedirect />} />
        <Route path="/forum" element={<DashboardRedirect />} />
        <Route path="/analytics" element={<Navigate to="/alumni/analytics" replace />} />
        
        {/* Resources and related routes */}
        <Route path="/resources">
          <Route 
            path="activity/:resourceId" 
            element={
              <ProtectedRoute>
                <ResourceActivity />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Catch all route for 404 - must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App; 