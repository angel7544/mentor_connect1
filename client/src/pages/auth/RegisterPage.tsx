import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Aos from 'aos';
import 'aos/dist/aos.css';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'STUDENT' | 'ALUMNI';
  graduationYear?: string; // Required for alumni
  company?: string; // Required for alumni
  jobTitle?: string; // Required for alumni
}

const RegisterPage: React.FC = () => {
  useEffect(()=>{
    Aos.init();
  })

  const navigate = useNavigate();
  const { register: registerUser, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
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
  
  const password = watch('password');
  const selectedRole = watch('role');
  
  const onSubmit = async (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    // Validate alumni-specific fields
    if (data.role === 'ALUMNI') {
      if (!data.graduationYear) {
        toast.error('Graduation year is required for alumni');
        return;
      }
      if (!data.company) {
        toast.error('Company is required for alumni');
        return;
      }
      if (!data.jobTitle) {
        toast.error('Job title is required for alumni');
        return;
      }
    }

    try {
      setSubmitError(null);
      console.log('Form submitted with data:', data);
      
      // Verify the role format
      console.log(`Role selected: "${data.role}" (type: ${typeof data.role})`);
      
      const { confirmPassword, ...userData } = data;
      
      // Check that we're connected to the auth store properly
      console.log('Auth store available:', !!registerUser);
      
      // Call the register function from the auth store
      console.log('Calling registerUser with:', JSON.stringify(userData, null, 2));
      const result = await registerUser(userData);
      console.log('Registration result:', result);
      
      if (result && result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        const errorMsg = result?.error || 'Registration failed. Please try again.';
        console.error('Registration failed:', errorMsg);
        setSubmitError(errorMsg);
      }
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      if (error.response) {
        // Server responded with non-2xx status
        console.error('Server error response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Handle specific status codes
        if (error.response.status === 404) {
          setSubmitError('Registration endpoint not found. Please contact support.');
        } else if (error.response.status === 409) {
          setSubmitError('An account with this email already exists.');
        } else if (error.response.status === 400) {
          // Handle validation errors
          const errorData = error.response.data;
          if (errorData.message) {
            setSubmitError(errorData.message);
          } else {
            setSubmitError('Invalid registration data. Please check your inputs.');
          }
        } else {
          // Generic server error
          setSubmitError(`Server error: ${error.response.status} ${error.response.statusText}`);
        }
      } else if (error.request) {
        // Request made but no response received
        console.error('No server response:', error.request);
        setSubmitError('The server did not respond. Please check your internet connection.');
      } else {
        // Error in request setup
        setSubmitError(`Error: ${error.message || 'Unknown error'}`);
      }
      
      // Always notify the user
      toast.error(submitError || 'Registration failed');
    }

    // Track registration event with React-GA4
    
  };
  
  // Show different fields based on selected role
  const renderRoleSpecificFields = () => {
    if (selectedRole === 'ALUMNI') {
      return (
        <div data-aos="fade-zoom-in" className="space-y-4">
          <div>
            <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
              Graduation Year
            </label>
            <div className="mt-1">
              <input
                id="graduationYear"
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                className="input"
                placeholder="e.g. 2020"
                {...register('graduationYear', { 
                  required: 'Graduation year is required for alumni',
                  min: {
                    value: 1950,
                    message: 'Graduation year must be after 1950'
                  },
                  max: {
                    value: new Date().getFullYear(),
                    message: 'Graduation year cannot be in the future'
                  }
                })}
              />
              {errors.graduationYear && (
                <p className="mt-1 text-sm text-red-600">{errors.graduationYear.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="company" className="block text-sm font-medium text-gray-700">
              Current Company
            </label>
            <div className="mt-1">
              <input
                id="company"
                type="text"
                className="input"
                placeholder="e.g. Google"
                {...register('company', { 
                  required: 'Company is required for alumni',
                  minLength: {
                    value: 2,
                    message: 'Company name must be at least 2 characters'
                  }
                })}
              />
              {errors.company && (
                <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
              Job Title
            </label>
            <div className="mt-1">
              <input
                id="jobTitle"
                type="text"
                className="input"
                placeholder="e.g. Software Engineer"
                {...register('jobTitle', { 
                  required: 'Job title is required for alumni',
                  minLength: {
                    value: 2,
                    message: 'Job title must be at least 2 characters'
                  }
                })}
              />
              {errors.jobTitle && (
                <p className="mt-1 text-sm text-red-600">{errors.jobTitle.message}</p>
              )}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div data-aos="fade-zoom-in" >
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create your account</h2>
      
      {submitError && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {submitError}
        </div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} >
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="mt-1">
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                className="input"
                {...register('firstName', { 
                  required: 'First name is required',
                })}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="mt-1">
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                className="input"
                {...register('lastName', { 
                  required: 'Last name is required',
                })}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div className="mt-1">
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="input"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="mt-1 relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className="input pr-10"
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
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <div className="mt-1">
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="input"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            I am a
          </label>
          <div className="mt-2 space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
            <div className="flex items-center">
              <input
                id="student"
                type="radio"
                value="STUDENT"
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                {...register('role')}
              />
              <label htmlFor="student" className="ml-3 block text-sm font-medium text-gray-700">
                Student
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="alumni"
                type="radio"
                value="ALUMNI"
                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300"
                {...register('role')}
              />
              <label htmlFor="alumni" className="ml-3 block text-sm font-medium text-gray-700">
                Alumni
              </label>
            </div>
          </div>
        </div>
        
        {/* Render role-specific fields */}
        {renderRoleSpecificFields()}

        <div>
          <button
            type="submit"
            className="w-full btn btn-primary py-2 px-4"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
      
      <div className="mt-6 texst-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage; 