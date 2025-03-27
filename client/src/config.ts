// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Environment
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';

// App Configuration
export const APP_NAME = 'Mentor Connect';
export const APP_DESCRIPTION = 'Connect with mentors and grow your career';

// Date Format
export const DATE_FORMAT = 'MMM DD, YYYY';
export const TIME_FORMAT = 'HH:mm';
export const DATETIME_FORMAT = 'MMM DD, YYYY HH:mm';

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 50;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Authentication
export const TOKEN_KEY = 'mentor_connect_token';
export const USER_KEY = 'mentor_connect_user';

// Event Types
export const EVENT_TYPES = ['workshop', 'seminar', 'networking', 'other'] as const;
export type EventType = typeof EVENT_TYPES[number];

// Event Status
export const EVENT_STATUS = ['upcoming', 'ongoing', 'completed', 'cancelled'] as const;
export type EventStatus = typeof EVENT_STATUS[number]; 