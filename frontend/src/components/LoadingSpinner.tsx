import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Processing your audiobook..." 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-amber-200 rounded-full"></div>
        <div className="w-16 h-16 border-4 border-amber-800 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
      </div>
      <p className="text-amber-800 font-medium mt-6 text-center">
        {message}
      </p>
      <p className="text-amber-600 text-sm mt-2 text-center">
        This may take a few minutes depending on file size
      </p>
    </div>
  );
};