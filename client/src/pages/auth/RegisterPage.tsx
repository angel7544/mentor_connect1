import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Aos from 'aos';
import 'aos/dist/aos.css';

// Add global styles for input fields if not defined in CSS
// If you have a global CSS file, these should be moved there
const inputStyles = `
  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
  }
`;

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'STUDENT' | 'ALUMNI';
  graduationYear?: number;
}

const RegisterPage: React.FC = () => {
  useEffect(() => {
    Aos.init();
  }, []);

  const navigate = useNavigate();
  const { registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'STUDENT'
    }
  });
  
  const selectedRole = watch('role');
  
  const onSubmit = async (data: RegisterFormData) => {
    try {
      // Clear any previous errors
      setSubmitError(null);
      
      // Validate required fields manually to ensure they're properly checked
      if (!data.firstName || !data.lastName || !data.email || !data.password || !data.confirmPassword) {
        setSubmitError('All required fields must be filled in');
        return;
      }
      
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        setSubmitError('Passwords do not match');
        return;
      }
      
      // Ensure graduation year is provided for alumni
      if (data.role === 'ALUMNI' && !data.graduationYear) {
        setSubmitError('Graduation year is required for alumni');
        return;
      }
      
      // Prepare registration data
      const registrationData = {
        ...data,
        name: `${data.firstName} ${data.lastName}`
      };
      
      delete registrationData.confirmPassword;
      
      console.log('Registration form submitted with data:', registrationData);
      
      // Call the registration function
      const result = await registerUser(registrationData);
      
      if (result && result.success) {
        toast.success('Registration successful!');
        navigate('/login');
      } else {
        setSubmitError(result?.error || 'Registration failed. Please try again.');
      }
    } catch (error: any) {
      console.error('Registration submission error:', error);
      setSubmitError(error.message || 'An unexpected error occurred');
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-50 to-white p-4">
      <div 
        data-aos="fade-up"
        className="w-full max-w-xl overflow-hidden rounded-2xl backdrop-blur-sm border border-gray-200 shadow-xl bg-white/80 my-8"
      >
        <div className="px-8 pt-8 pb-6">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
              MC
            </div>
          </div>
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">Create an account</h2>
          <p className="text-center text-gray-600 mb-8">Join our mentoring platform today</p>
          
          {submitError && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="text-sm font-medium">{submitError}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  autoComplete="given-name"
                  className={`input bg-gray-50 focus:bg-white transition-colors ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="John"
                  {...register('firstName', { required: 'First name is required' })}
                  aria-invalid={errors.firstName ? "true" : "false"}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
                )}
              </div>
              
              <div className="flex-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  autoComplete="family-name"
                  className="input bg-gray-50 focus:bg-white transition-colors"
                  placeholder="Doe"
                  {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
                )}
              </div>
            </div>

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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="pl-10 pr-10 input bg-gray-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-800"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="pl-10 pr-10 input bg-gray-50 focus:bg-white transition-colors"
                  placeholder="••••••••"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (val: string) => {
                      if (watch('password') !== val) {
                        return "Passwords do not match";
                      }
                    }
                  })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-800"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I am registering as
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${selectedRole === 'STUDENT' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="hidden"
                      value="STUDENT"
                      {...register('role', { required: true })}
                    />
                    <div className={`flex-shrink-0 w-5 h-5 mr-2 rounded-full border ${selectedRole === 'STUDENT' ? 'border-indigo-500' : 'border-gray-300'}`}>
                      {selectedRole === 'STUDENT' && (
                        <div className="w-3 h-3 m-1 rounded-full bg-indigo-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Student</p>
                      <p className="text-xs text-gray-500">Current students looking for mentorship</p>
                    </div>
                  </label>
                </div>
                
                <div className={`relative rounded-lg border p-4 cursor-pointer transition-all duration-200 ${selectedRole === 'ALUMNI' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}`}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      className="hidden"
                      value="ALUMNI"
                      {...register('role', { required: true })}
                    />
                    <div className={`flex-shrink-0 w-5 h-5 mr-2 rounded-full border ${selectedRole === 'ALUMNI' ? 'border-indigo-500' : 'border-gray-300'}`}>
                      {selectedRole === 'ALUMNI' && (
                        <div className="w-3 h-3 m-1 rounded-full bg-indigo-500"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Alumni</p>
                      <p className="text-xs text-gray-500">Graduates who want to mentor students</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            {selectedRole === 'ALUMNI' && (
              <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100">
                <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700 mb-1">
                  Graduation Year
                </label>
                <input
                  id="graduationYear"
                  type="number"
                  className="input bg-white"
                  placeholder="e.g. 2020"
                  {...register('graduationYear', { 
                    required: selectedRole === 'ALUMNI' ? 'Graduation year is required for alumni' : false,
                    min: {
                      value: 1950,
                      message: 'Please enter a valid year'
                    },
                    max: {
                      value: new Date().getFullYear(),
                      message: `Year cannot be greater than ${new Date().getFullYear()}`
                    }
                  })}
                />
                {errors.graduationYear && (
                  <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
                )}
              </div>
            )}

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
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </button>
            </div>
          </form>
        </div>
        
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in instead
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 