import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCancel } from "react-icons/md";
import { FaLinkedin } from "react-icons/fa";
import { IoMdMenu } from "react-icons/io";
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import useAuthStore from '../store/authStore';


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
              <button onClick={() => scrollToSection('team')} className="text-gray-500 hover:text-gray-900 px-1 pt-1 text-sm font-medium">
                Team
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-900"
              >
                <IoMdMenu size={24} />
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
                    <MdCancel className="h-6 w-6" />
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

      {/* Rest of your existing code... */}
      <About/>
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
                src="/mentorship.jpg"
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
                src="/networking.jpg"
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
                src="/career-growth.jpg"
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



const Team: React.FC = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      linkedin: "https://linkedin.com/in/sarah-johnson"
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
      linkedin: "https://linkedin.com/in/michael-chen"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      linkedin: "https://linkedin.com/in/emily-rodriguez"
    },
    {
      name: "David Kim",
      role: "Lead Developer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
      linkedin: "https://linkedin.com/in/david-kim"
    }
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
                  <FaLinkedin size={24} />
                </a>
              </div>
            </motion.div>
          ))}
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