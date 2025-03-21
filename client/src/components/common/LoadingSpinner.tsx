import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
}

/**
 * A reusable loading spinner component
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...' 
}) => {
  // Size values in pixels
  const sizeMap = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16'
  };
  
  const spinnerSize = sizeMap[size];
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <div className={`${spinnerSize} animate-spin rounded-full border-4 border-t-transparent border-blue-600`} />
      {text && <p className="mt-4 text-gray-600 text-lg">{text}</p>}
    </div>
  );
};

export default LoadingSpinner; 