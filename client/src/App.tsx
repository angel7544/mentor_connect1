import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import useAuthStore from './store/authStore';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ProfilePage from './pages/profile/ProfilePage';
import MentorshipPage from './pages/mentorship/MentorshipPage';
import MessagesPage from './pages/messages/MessagesPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import EventsPage from './pages/events/EventsPage';
import ForumPage from './pages/forum/ForumPage';
import NotFoundPage from './pages/NotFoundPage';
import Chatbot from './pages/chatbot/chatbot';
import ContactUs from './pages/ContactUs/ContactUs';
import ContactPublic from './pages/ContactPublic';
import ProgressPage from './pages/progress/ProgressPage';
import NotificationPage from './pages/notifcation/NotificationPage';
// import google tags manager 
import useGTM from './hooks/useGTM';
// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  // initialize the gtm and pass gtm *google tag manager id 
  useGTM('GTM-KTQHK59S')
 
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route >
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPublic />} />
        </Route>
        
        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notification" 
            element={
              <ProtectedRoute>
                <NotificationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/mentorship" 
            element={
              <ProtectedRoute>
                <MentorshipPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/progress" 
            element={
              <ProtectedRoute>
                <ProgressPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/resources" 
            element={
              <ProtectedRoute>
                <ResourcesPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/events" 
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/forum" 
            element={
              <ProtectedRoute>
                <ForumPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/chatbot" 
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ContactUs" 
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App; 