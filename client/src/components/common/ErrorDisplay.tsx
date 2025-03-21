import React from 'react';

interface ErrorDisplayProps {
  message: string;
  retry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retry }) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded relative" role="alert">
        <div className="flex items-center">
          <svg className="h-6 w-6 text-red-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <strong className="font-bold mr-2">Error!</strong>
          <span className="block sm:inline">{message}</span>
        </div>
        
        {retry && (
          <div className="mt-4 flex justify-end">
            <button 
              onClick={retry}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay; 