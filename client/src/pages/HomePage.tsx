import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  return (
    <div className="relative overflow-hidden">
      {/* Hero section */}
      <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 lg:overflow-hidden">
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
              <div className="lg:py-24">
                <h1 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                  <span className="block">Connect with</span>
                  <span className="block text-primary-600">Alumni Mentors</span>
                </h1>
                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  MentorConnect helps students connect with alumni mentors for career guidance, 
                  professional development, and networking opportunities.
                </p>
                <div className="mt-10 sm:mt-12">
                  {isAuthenticated ? (
                    <Link
                      to="/dashboard"
                      className="btn btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm"
                    >
                      Go to Dashboard
                      <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link
                        to="/register"
                        className="btn btn-primary inline-flex items-center px-6 py-3 text-base font-medium rounded-md shadow-sm"
                      >
                        Get Started
                        <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                      </Link>
                      <Link
                        to="/login"
                        className="btn btn-outline inline-flex items-center px-6 py-3 text-base font-medium rounded-md"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative">
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                <img
                  className="w-full lg:absolute lg:inset-y-0 lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                  alt="Students collaborating"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features section */}
      <div className="py-16 sm:py-24 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Features</h2>
            <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              How MentorConnect Works
            </p>
            <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
              Our platform makes it easy to connect students with alumni mentors.
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Mentorship Matching</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Get matched with alumni mentors based on your career interests, skills, and goals.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Session Scheduling</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Schedule 1-on-1 mentoring sessions based on mentor availability.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                        <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                        </svg>
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Direct Messaging</h3>
                    <p className="mt-5 text-base text-gray-500">
                      Communicate directly with mentors through our secure messaging system.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="text-gray-600 body-font"> 
  <div className="container px-5 py-24 mx-auto">
    <div className="flex flex-col text-center w-full mb-20">
      <h1 className="text-2xl font-medium title-font mb-4 text-gray-900 tracking-widest">OUR TEAM</h1>
      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Whatever cardigan tote bag tumblr hexagon brooklyn asymmetrical gentrify, subway tile poke farm-to-table. Franzen you probably haven't heard of them.</p>
    </div>
    <div className="flex flex-wrap -m-4">
      <div className="p-4 lg:w-1/2">
        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D4D03AQFzSZQ3JBZ3vQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1728229346985?e=1747872000&v=beta&t=GpYiPxS7VFMAEdUQyJkFRzynYZQk3n2FXrjcngevi_4"/>
          <div className="flex-grow sm:pl-8">
            <h2 className="title-font font-medium text-lg text-gray-900">Ashutosh Kumar</h2>
            <h3 className="text-gray-500 mb-3">Project Lead</h3>
            <p className="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span className="inline-flex">
            <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0  00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a 
  href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
  <svg 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="2" 
    className="w-5 h-5" 
    viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
  </svg>
</a>

            </span>
          </div>
        </div>
      </div>
      <div className="p-4 lg:w-1/2">
        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D5603AQEKFxNGtE0AYg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727548244056?e=1747872000&v=beta&t=48luPokfDSt4vR-5FykOWru15j2b-8DhjGOPe1z7pfg"/>
          <div className="flex-grow sm:pl-8">
            <h2 className="title-font font-medium text-lg text-gray-900">Sneha Kumari</h2>
            <h3 className="text-gray-500 mb-3">Project Manager</h3>
            <p className="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span className="inline-flex">
            <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0  00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a 
  href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
  <svg 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="2" 
    className="w-5 h-5" 
    viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
  </svg>
</a>

            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 lg:w-1/2">
        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D4D03AQG9heV8RJilig/profile-displayphoto-shrink_400_400/B4DZRFefprG4Ag-/0/1736332410223?e=1747872000&v=beta&t=NdcFXuiG3npcxxbIMAcBuaf7COIeYUa8RUkRbEfVTGg"/>
          <div className="flex-grow sm:pl-8">
            <h2 className="title-font font-medium text-lg text-gray-900">Shivam Kumar Sinha</h2>
            <h3 className="text-gray-500 mb-3">Web & UI Developer</h3>
            <p className="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span className="inline-flex">
            <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0  00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a 
  href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
  <svg 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="2" 
    className="w-5 h-5" 
    viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
  </svg>
</a>

            </span>
          </div>
        </div>
      </div>
      <div className="p-4 lg:w-1/2">
        <div className="h-full flex sm:flex-row flex-col items-center sm:justify-start justify-center text-center sm:text-left">
          <img alt="team" className="flex-shrink-0 rounded-lg w-48 h-48 object-cover object-center sm:mb-0 mb-4" src="https://media.licdn.com/dms/image/v2/D4D03AQFinZ5z30I1nQ/profile-displayphoto-shrink_400_400/B4DZTRVNVDGkAk-/0/1738678785903?e=1747872000&v=beta&t=j_Hjqh27QfCvmI_H7m-1sa7bvJgJGNXBOeSN6RSyQJ0"/>
          <div className="flex-grow sm:pl-8">
            <h2 className="title-font font-medium text-lg text-gray-900">Angel</h2>
            <h3 className="text-gray-500 mb-3">AI Prompter</h3>
            <p className="mb-4">DIY tote bag drinking vinegar cronut adaptogen squid fanny pack vaporware.</p>
            <span className="inline-flex">
            <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0  00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
                </svg>
              </a>
              <a href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
                <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
                </svg>
              </a>
              <a 
  href="https://example.com" 
  className="ml-2 text-gray-500 hover:text-gray-700" 
  target="_blank" 
  rel="noopener noreferrer">
  <svg 
    fill="none" 
    stroke="currentColor" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    strokeWidth="2" 
    className="w-5 h-5" 
    viewBox="0 0 24 24">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
  </svg>
</a>

            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* CTA section */}
      <div className="bg-primary-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to boost your career?</span>
            <span className="block">Start using MentorConnect today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-primary-200">
            Join our community of students and alumni to share knowledge and build professional connections.
          </p>
          <Link
            to="/register"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 sm:w-auto"
          >
            Sign up for free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage; 