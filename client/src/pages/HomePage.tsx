import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCancel } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';
//  features 
// Add these imports at the top of the file
import { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';


const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                {/* <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="MentorConnect"
                /> */}
                <span className="ml-2 text-xl font-bold text-primary-600">MentorConnect</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:space-x-8">
              <button onClick={() => scrollToSection('home')} className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">
                Home
              </button>
              <button onClick={() => scrollToSection('about')} className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">
                About
              </button>
              <button onClick={() => scrollToSection('features')} className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">
                Features
              </button>
              <button onClick={() => scrollToSection('fnq')} className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">
                Fnq
              </button>
              <button onClick={() => scrollToSection('team')} className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">
                Team
              </button>

            </div>

            {/* // Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900"
              >
                {IoMdMenu({ size: 24 })}
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn btn-primary text-sm px-4 py-2 rounded-full"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary text-sm px-4 py-2 rounded-full"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-50"
              onClick={() => setIsSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 shadow-xl"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-8">
                  <Link to="/" className="flex items-center">
                    <img className="h-8 w-auto" src="/logo.png" alt="MentorConnect" />
                  </Link>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-md text-gray-500 hover:text-gray-900"
                  >
                    {MdCancel({ size: 24 })}
                  </button>
                </div>
                <div className="flex flex-col space-y-4">
                  <button onClick={() => scrollToSection('home')} className="text-gray-600 hover:text-gray-900 py-2">
                    Home
                  </button>
                  <button onClick={() => scrollToSection('about')} className="text-gray-600 hover:text-gray-900 py-2">
                    About
                  </button>
                  <button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-gray-900 py-2">
                    Features
                  </button>
                  <button onClick={() => scrollToSection('fnq')} className="text-gray-600 hover:text-gray-900 py-2">
                    fnq
                  </button>
                  <button onClick={() => scrollToSection('team')} className="text-gray-600 hover:text-gray-900 py-2">
                    Team
                  </button>
                  {!isAuthenticated && (
                    <>
                      <Link to="/login" className="text-gray-600 hover:text-gray-900 py-2">
                        Sign In
                      </Link>
                      <Link to="/register" className="btn btn-primary text-sm px-4 py-2 rounded-full text-center">
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero section */}
      <div className="pt-12 lg:pt-32 overflow-hidden bg-gradient-to-b from-white to-gray-50" id='home'>
        <div className="mx-auto max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 sm:text-center lg:px-0 lg:text-left lg:flex lg:items-center">
              <div className="lg:py-24">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="inline-flex items-center text-sm font-semibold text-primary-600 space-x-2">
                    <span className="h-4 w-4 bg-primary-600 rounded-full"></span>
                    <span>Launching 2025</span>
                  </span>
                  <h1 className="mt-4 text-4xl font-extrabold text-gray-900 tracking-tight sm:mt-5 sm:text-6xl lg:mt-6 xl:text-6xl">
                    <span className="block bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">Connect with</span>
                    <span className="block">Alumni Mentors</span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Empowering the next generation through meaningful connections. Get personalized guidance 
                    from experienced alumni who've walked your path.
                  </p>
                  <div className="mt-10 sm:mt-12">
                    {!isAuthenticated && (
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                          to="/register"
                          className="btn btn-primary inline-flex items-center px-8 py-4 text-base font-medium rounded-full shadow-lg shadow-primary-500/25 hover:shadow-xl transition-all duration-200"
                        >
                          Start Your Journey
                          <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link
                          to="/mentors"
                          className="btn btn-outline inline-flex items-center px-8 py-4 text-base font-medium rounded-full hover:bg-gray-50 transition-all duration-200"
                        >
                          Browse Mentors
                        </Link>
                      </div>
                    )}
                  </div>
                  <div className="mt-12 flex flex-wrap items-center gap-8">
                    <div>
                      <p className="text-3xl font-bold text-gray-900">500+</p>
                      <p className="text-sm text-gray-500">Active Mentors</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">1000+</p>
                      <p className="text-sm text-gray-500">Success Stories</p>
                    </div>
                    <div>
                      <p className="text-3xl font-bold text-gray-900">50+</p>
                      <p className="text-sm text-gray-500">Universities</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
            
            {/* Updated hero image section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-12 -mb-16 sm:-mb-48 lg:m-0 lg:relative"
            >
              <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-none lg:px-0">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-64 bg-primary-600/20 rounded-full filter blur-3xl"></div>
                  </div>
                  <img
                    className="relative rounded-2xl shadow-2xl"
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                    alt="Students collaborating"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <About/>
      <Features/>
      <Fnq/>
      <Team/>
      <Footer/>
      {/* Features section */}
    </div>
  );
};

const About: React.FC = () => {
  return (
    <div className="bg-white py-24 sm:py-32" id='about'>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Bridging the Gap Between Students and Alumni
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            MentorConnect is revolutionizing the way students connect with experienced alumni, 
            creating meaningful relationships that shape future careers.
          </p>
        </div>

        {/* Stats Section */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Years of Excellence</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">5+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Successful Mentorships</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">1000+</dd>
            </div>
            <div className="mx-auto flex max-w-xs flex-col gap-y-4">
              <dt className="text-base leading-7 text-gray-600">Global Network</dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">50+ Countries</dd>
            </div>
          </dl>
        </div>

        {/* Features Grid */}
        <div className="mx-auto mt-16 max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Personalized Mentorship"
                className="h-48 w-full object-cover rounded-lg mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-900">Personalized Mentorship</h3>
              <p className="mt-4 text-gray-600">
                Get one-on-one guidance from industry experts who understand your journey.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1515169067868-5387ec356754?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
                alt="Networking Opportunities"
                className="h-48 w-full object-cover rounded-lg mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-900">Networking Opportunities</h3>
              <p className="mt-4 text-gray-600">
                Build valuable connections within your industry through our alumni network.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-8 shadow-sm hover:shadow-md transition-shadow">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80"
                alt="Career Growth"
                className="h-48 w-full object-cover rounded-lg mb-6"
              />
              <h3 className="text-xl font-semibold text-gray-900">Career Growth</h3>
              <p className="mt-4 text-gray-600">
                Accelerate your professional development with expert guidance and resources.
              </p>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 mt-16 rounded-2xl">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <figure className="mx-auto max-w-2xl">
              <blockquote className="text-center text-xl font-semibold leading-8 text-white sm:text-2xl sm:leading-9">
                <p>
                  "MentorConnect transformed my career path. The guidance I received from my mentor
                  helped me land my dream job at a top tech company."
                </p>
              </blockquote>
              <figcaption className="mt-8 text-center">
                <div className="mt-4 flex items-center justify-center space-x-3 text-base">
                  <div className="font-semibold text-white">Sarah Chen</div>
                  <svg viewBox="0 0 2 2" width="3" height="3" aria-hidden="true" className="fill-white">
                    <circle cx="1" cy="1" r="1" />
                  </svg>
                  <div className="text-gray-300">Software Engineer at Google</div>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </div>
  );
};



// Replace the existing Features component with this one
const Features: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'carousel'>('grid');
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const features = [
    {
      title: "Mentor-Student Matching",
      description: "Advanced filtering system with AI-powered recommendations for perfect mentor matches.",
      details: [
        "Location and availability-based filtering",
        "AI-powered mentor suggestions",
        "Expertise matching algorithm"
      ]
    },
    {
      title: "Interactive Communication Tools",
      description: "Comprehensive suite of communication tools for effective mentorship.",
      details: [
        "Built-in video conferencing",
        "Resource sharing platform",
        "Collaborative document editing"
      ]
    },
    {
      "title": "Recommendation System",
      "description": "AI-driven recommendation system that personalizes suggestions based on user preferences, location, and expertise.",
      "details": [
        "Location and availability-based filtering",
        "AI-powered mentor suggestions",
        "Expertise matching algorithm"
      ]
    },
    {
      title: "Goal-Setting & Progress Tracking",
      description: "Structured system for setting and tracking mentorship objectives.",
      details: [
        "Customizable goal templates",
        "Progress milestone tracking",
        "Feedback mechanism"
      ]
    },
    {
      title: "Enhanced User Profiles",
      description: "Comprehensive profiles showcasing expertise and achievements.",
      details: [
        "Skill endorsements",
        "Achievement showcase",
        "Review system"
      ]
    },
    {
      "title": "Push Notifications System",
      "description": "Real-time push notification system to keep users informed about updates, messages, and important events.",
      "details": [
        "Instant alerts for updates",
        "Customizable notification preferences",
        "Seamless cross-platform support"
      ]
    },
    {
      title: "Smart Event Scheduling",
      description: "Integrated calendar system for efficient meeting management.",
      details: [
        "Calendar integration",
        "Automated reminders",
        "Availability management"
      ]
    },
    {
      title: "Resource Library",
      description: "Extensive collection of career development resources.",
      details: [
        "Curated content library",
        "User contributions",
        "Personalized recommendations"
      ]
    }
  ];

  const filteredFeatures = features.filter(feature =>
    feature.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isAutoPlay && viewMode === 'carousel') {
      timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % filteredFeatures.length);
      }, 5000);
    }
    return () => clearInterval(timer);
  }, [filteredFeatures.length, isAutoPlay, viewMode]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % filteredFeatures.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + filteredFeatures.length) % filteredFeatures.length);
  };

  return (
    <div className="bg-gray-50 py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-primary-600">Platform Features</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to succeed
          </p>
          
          {/* Search and View Toggle */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              {IoSearchOutline({ 
                className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400",
                size: 20 
              })}
              <input
                type="text"
                placeholder="Search features..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('carousel')}
                className={`p-2 rounded-lg ${viewMode === 'carousel' ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Features Display */}
        <div className="mt-16 flow-root sm:mt-20">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="absolute top-6 right-6 text-primary-600 transform group-hover:rotate-12 transition-transform">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-500">
                        <svg className="h-4 w-4 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <div className="overflow-hidden">
                <motion.div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    width: `${filteredFeatures.length * 100}%`,
                  }}
                >
                  {filteredFeatures.map((feature, index) => (
                    <div key={index} className="w-full px-4">
                      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                        <h3 className="text-2xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                        <p className="text-gray-600 mb-6 text-lg">{feature.description}</p>
                        <ul className="space-y-4">
                          {feature.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center text-base text-gray-500">
                              <svg className="h-5 w-5 text-primary-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Carousel Controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-4">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 right-4">
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Carousel Navigation Dots */}
              <div className="flex justify-center mt-8 space-x-2">
                {filteredFeatures.map((_, index) => (
                  <button
                    key={index}
                    className={`h-2 w-2 rounded-full transition-all duration-300 ${
                      currentSlide === index ? 'bg-primary-600 w-4' : 'bg-gray-300'
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Sneha Kumari",
      role: "Team Lead",
      image: "https://media.licdn.com/dms/image/v2/D5603AQEKFxNGtE0AYg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1727548244056?e=1747872000&v=beta&t=48luPokfDSt4vR-5FykOWru15j2b-8DhjGOPe1z7pfg",
      linkedin: "https://www.linkedin.com/in/sneha-kumari-ss/"
    },
    {
      name: "Ashutosh kumar",
      role: "Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQFzSZQ3JBZ3vQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1728229346985?e=1747872000&v=beta&t=GpYiPxS7VFMAEdUQyJkFRzynYZQk3n2FXrjcngevi_4",
      linkedin: "https://www.linkedin.com/in/ashukr321/"
    },

    {
      name: "Shivam kumar sinha",
      role: "Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQG9heV8RJilig/profile-displayphoto-shrink_400_400/B4DZRFefprG4Ag-/0/1736332410223?e=1747872000&v=beta&t=NdcFXuiG3npcxxbIMAcBuaf7COIeYUa8RUkRbEfVTGg",
      linkedin: "https://www.linkedin.com/in/shivam-kumar-sinha-55aa9b273/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    },
    {
      name: "Angel (Mehul) Singh",
      role: "Developer",
      image: "https://media.licdn.com/dms/image/v2/D4D03AQFinZ5z30I1nQ/profile-displayphoto-shrink_400_400/B4DZTRVNVDGkAk-/0/1738678785903?e=1747872000&v=beta&t=j_Hjqh27QfCvmI_H7m-1sa7bvJgJGNXBOeSN6RSyQJ0",
      linkedin: "https://www.linkedin.com/in/angel3002/"
    },

    
  ];

  return (
    <div className="bg-white py-24 sm:py-32" id="team">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header Section */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Team
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our team is a diverse group of individuals who are passionate about helping students succeed.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="aspect-w-3 aspect-h-4">
                <img
                  src={member.image}
                  alt={member.name}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="mt-1 text-sm text-gray-300">{member.role}</p>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-white hover:text-primary-400 transition-colors duration-200"
                >
                  {FaLinkedin({ size: 24 })}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};


const Fnq: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const faqs = [
    {
      question: "How does the mentor matching process work?",
      answer: "Our AI-powered matching system analyzes your profile, career goals, and preferences to suggest the most compatible mentors. You can filter mentors by industry, expertise, location, and availability to find the perfect match for your needs."
    },
    {
      question: "Is MentorConnect free for students?",
      answer: "Yes! MentorConnect is completely free for students. We believe in making quality mentorship accessible to all students. Alumni mentors volunteer their time to give back to their communities and help shape the next generation of professionals."
    },
    {
      question: "How often can I meet with my mentor?",
      answer: "Meeting frequency is flexible and determined by you and your mentor. Most mentorship pairs meet bi-weekly or monthly, but you can establish a schedule that works best for both of you. Our platform makes it easy to schedule and manage your sessions."
    },
    {
      question: "Can I change my mentor if we're not a good fit?",
      answer: "Absolutely! We understand that chemistry is important in a mentorship relationship. If you feel your current mentor isn't the right match, you can request a new mentor at any time through your dashboard without any penalties."
    },
    {
      question: "What kind of support can I expect from my mentor?",
      answer: "Mentors provide guidance in various areas including career advice, skill development, networking opportunities, resume reviews, interview preparation, and industry insights. The specific support depends on your goals and your mentor's expertise."
    },
    {
      question: "How long does a typical mentorship last?",
      answer: "Mentorships typically last for 3-6 months, but many evolve into long-term professional relationships. You and your mentor can decide on the duration that best suits your development needs and goals."
    }
  ];

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-gray-50 pb-10 py-24  sm:py-32" id="fnq">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div 
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-base font-semibold leading-7 text-primary-600">FAQ</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently Asked Questions
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Find answers to common questions about MentorConnect and how our platform can help you succeed.
          </p>
        </motion.div>
        
        <div className="mx-auto mt-16 max-w-3xl">
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {faqs.map((faq, index) => (
              <motion.div 
                key={index}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.01 }}
              >
                <button
                  className="flex justify-between items-center w-full px-6 py-5 text-left"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="text-lg font-medium text-gray-900">{faq.question}</span>
                  <motion.span
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </motion.span>
                </button>
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: openIndex === index ? "auto" : 0,
                    opacity: openIndex === index ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 text-gray-600">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <Link
              to="/contact"
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-full bg-primary-600 text-white hover:bg-primary-700 transition-colors"
            >
              Contact Support
              <svg className="ml-2 -mr-1 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};


const Footer: React.FC = () => {
  return (
    <div className="bg-gray-900 text-white py-6 text-center">
      <p className="text-lg font-semibold">Mentor Connect</p>
      <p className="text-sm mt-2">© 2025 Mentor Connect. All rights reserved.</p>
    </div>
  );
};




export default HomePage;