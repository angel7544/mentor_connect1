import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Aos from 'aos';
import 'aos/dist/aos.css';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ForgotPasswordFormData>();
  
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      setSubmitError(null);
      console.log('Forgot password form submitted with email:', data.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demonstration, we'll just show success UI
      // In a real app, this would call an API endpoint to send a password reset email
      setSubmitSuccess(true);
      toast.success('Reset instructions sent to your email!');
      
    } catch (error: any) {
      console.error('Forgot password submission error:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
      toast.error('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white p-4">
        <div 
          data-aos="fade-up"
          className="w-full max-w-md overflow-hidden rounded-2xl backdrop-blur-sm border border-gray-200 shadow-xl bg-white/80"
        >
          <div className="px-8 pt-8 pb-6 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Check your email</h2>
            <p className="text-gray-600 mb-6">
              We've sent password reset instructions to <span className="font-medium text-gray-900">your email</span>.
              Please check your inbox and follow the link to reset your password.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              If you don't see the email, check your spam folder or make sure you entered the correct email address.
            </p>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => setSubmitSuccess(false)}
                className="btn btn-outline py-2 rounded-lg"
              >
                Try again with a different email
              </button>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                Return to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white p-4">
      <div 
        data-aos="fade-up"
        className="w-full max-w-md overflow-hidden rounded-2xl backdrop-blur-sm border border-gray-200 shadow-xl bg-white/80"
      >
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              MC
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Forgot your password?</h2>
          <p className="text-center text-gray-600 mb-8">
            No worries! Enter your email and we'll send you reset instructions.
          </p>
          
          {submitError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="text-sm font-medium">{submitError}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="pl-10 input bg-gray-50 focus:bg-white transition-colors"
                  placeholder="you@example.com"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full btn btn-primary py-2.5 px-4 text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </div>
                ) : (
                  'Send Reset Instructions'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage; 