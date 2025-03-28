import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import PieChartComponets from './charts/PieChartComponets';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axios from 'axios';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  headline?: string;
  skills?: string[];
  interests?: string[];
  education?: Array<{
    institution: string;
    degree: string;  // e.g., "Bachelor of Science"
    fieldOfStudy: string;  // e.g., "Data Science"
    startYear: number;
    endYear?: number;
    gpa?: string;
    academicStanding?: string;
  }>;
  experience?: Array<{
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }>;
  role: 'student' | 'alumni' | 'admin';
}

interface ProfileResponse {
  profile: UserProfile;
}

// Sample data - replace with actual API data in production
const progressData = [
  { subject: 'Technical Skills', score: 85, target: 90, lastMonth: 78 },
  { subject: 'Communication', score: 75, target: 80, lastMonth: 72 },
  { subject: 'Problem Solving', score: 90, target: 85, lastMonth: 88 },
  { subject: 'Leadership', score: 70, target: 75, lastMonth: 65 },
  { subject: 'Industry Knowledge', score: 95, target: 90, lastMonth: 90 },
];

const mentorshipData = [
  { name: 'Completed Sessions', value: 85 },
  { name: 'Upcoming Sessions', value: 10 },
  { name: 'Cancelled Sessions', value: 5 },
];

const skillsData = [
  { subject: 'Technical Skills', A: 80, fullMark: 100 },
  { subject: 'Communication', A: 75, fullMark: 100 },
  { subject: 'Problem Solving', A: 90, fullMark: 100 },
  { subject: 'Leadership', A: 85, fullMark: 100 },
  { subject: 'Industry Knowledge', A: 70, fullMark: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const ProgressPage = () => {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get<ProfileResponse>('/api/profile/me');
        if (!response.data || !response.data.profile) {
          throw new Error('Invalid profile data received');
        }
        const profile = response.data.profile;
        
        // Remove default placeholder text
        if (profile.headline === 'Add a headline to describe yourself') {
          profile.headline = '';
        }
        if (profile.bio === 'Welcome to your profile! Add your bio here.') {
          profile.bio = '';
        }

        // Set default education data if not present
        if (!profile.education || profile.education.length === 0) {
          profile.education = [{
            institution: 'Amity University',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science with IT',
            startYear: 2020,
            endYear: 2024,
            gpa: '3.8',
            academicStanding: 'Good Standing'
          }];
        }
        
        setUserProfile(profile);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error('Failed to load user profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Feedback submitted successfully!');
      setFeedback('');
      setRating(0);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generatePDF = async () => {
    if (!reportRef.current || !userProfile) {
      toast.error('User profile data not available');
      return;
    }

    try {
      toast.loading('Generating PDF...');
      
      const canvas = await html2canvas(reportRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;

      // Add title
      pdf.setFontSize(20);
      pdf.text('Mentorship Progress Report', pdfWidth / 2, 20, { align: 'center' });
      
      // Add user info with null checks
      pdf.setFontSize(12);
      const name = userProfile.firstName && userProfile.lastName 
        ? `${userProfile.firstName} ${userProfile.lastName}`
        : 'Name not available';
      const email = userProfile.email || 'Email not available';
      
      pdf.text(`Name: ${name}`, 20, 40);
      pdf.text(`Email: ${email}`, 20, 48);

      // Add education info with null checks
      if (userProfile.education && userProfile.education[0]) {
        const education = userProfile.education[0];
        const institution = education.institution || 'Institution not available';
        const degree = education.degree || 'Degree not available';
        const fieldOfStudy = education.fieldOfStudy || 'Field of study not available';
        
        pdf.text(`Institution: ${institution}`, 20, 56);
        pdf.text(`Program: ${degree}`, 20, 64);
        pdf.text(`Major: ${fieldOfStudy}`, 20, 72);
      }

      // Add the screenshot
      pdf.addImage(imgData, 'PNG', imgX, imgY + 50, imgWidth * ratio, imgHeight * ratio);
      
      // Generate filename with fallback
      const fileName = userProfile.firstName && userProfile.lastName
        ? `mentorship_progress_${userProfile.firstName}_${userProfile.lastName}.pdf`
        : 'mentorship_progress_report.pdf';
      
      // Save the PDF
      pdf.save(fileName);
      toast.dismiss();
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.dismiss();
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-primary-600 text-white py-12 px-4 sm:px-6 lg:px-8 mb-8 relative"
        >
          <div className="text-center">
            <h1 className="text-4xl font-extrabold sm:text-5xl">
              Mentorship Progress
            </h1>
            <p className="mt-4 text-xl text-primary-100 max-w-2xl mx-auto">
              Track your mentorship journey, skill development, and learning progress
            </p>
          </div>
        </motion.div>

        <div ref={reportRef}>
          {/* User Profile Section */}
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8 mb-8"
            >
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <div className="relative flex-shrink-0">
                  <img
                    src={userProfile?.avatarUrl || '/default-avatar.png'}
                    alt={`${userProfile?.firstName} ${userProfile?.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary-100 shadow-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900">
                        {userProfile?.firstName} {userProfile?.lastName}
                      </h2>
                      <p className="text-gray-600 mt-1">{userProfile?.email}</p>
                    </div>
                    {userProfile?.role && userProfile.role !== 'admin' && (
                      <span className={`px-4 py-2 text-sm font-medium rounded-full ${
                        userProfile.role === 'student' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {userProfile.role === 'student' ? 'Student' : 'Alumni'}
                      </span>
                    )}
                  </div>
                  
                  {userProfile?.headline && (
                    <p className="mt-4 text-xl text-gray-700 italic border-l-4 border-primary-500 pl-4">
                      {userProfile.headline}
                    </p>
                  )}
                  
                  {userProfile?.bio && (
                    <p className="mt-4 text-gray-600 leading-relaxed">
                      {userProfile.bio}
                    </p>
                  )}
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userProfile?.education && userProfile.education[0] && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Academic Details</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Current Institution</p>
                            <p className="text-sm text-gray-900">{userProfile.education[0].institution}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Degree Program</p>
                            <p className="text-sm text-gray-900">{userProfile.education[0].degree}</p>
                          </div>
                          <div className="border-t border-gray-200 pt-2">
                            <p className="text-sm font-medium text-gray-500">Major</p>
                            <p className="text-sm text-gray-900">{userProfile.education[0].fieldOfStudy}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Academic Standing</p>
                            <p className="text-sm text-gray-900">{userProfile.education[0].academicStanding || 'Good Standing'}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">Achievements & Skills</h3>
                      <div className="space-y-4">
                        {userProfile?.education && userProfile.education[0]?.gpa && (
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">GPA Achievement</p>
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold">{userProfile.education[0].gpa}</span>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-gray-900 font-medium">Current GPA</p>
                                <p className="text-xs text-gray-500">Out of 10.0 scale</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {userProfile?.skills && userProfile.skills.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Key Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {userProfile.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {userProfile?.interests && userProfile.interests.length > 0 && (
                          <div>
                            <p className="text-sm font-medium text-gray-500 mb-2">Areas of Interest</p>
                            <div className="flex flex-wrap gap-2">
                              {userProfile.interests.map((interest, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                                >
                                  {interest}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {userProfile?.experience && userProfile.experience[0] && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Current Position</h3>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-gray-900">
                          {userProfile.experience[0].title}
                        </p>
                        <p className="text-sm text-gray-600">
                          {userProfile.experience[0].company}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Generate PDF Button */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={generatePDF}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
                >
                  <svg 
                    className="mr-2 h-5 w-5" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                    />
                  </svg>
                  Generate Progress Report
                </button>
              </div>
            </motion.div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100 hover:border-primary-100 transition-all"
            >
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-primary-50 rounded-lg p-3">
                    <svg className="h-7 w-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Sessions</p>
                    <div className="mt-3 flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900">85</p>
                      <p className="ml-2 text-sm font-medium text-gray-500">sessions</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">Last 30 days</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100 hover:border-green-100 transition-all"
            >
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-green-50 rounded-lg p-3">
                    <svg className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Completion Rate</p>
                    <div className="mt-3 flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900">85%</p>
                      <p className="ml-2 text-sm font-medium text-green-600">+5%</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">vs. last month</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100 hover:border-blue-100 transition-all"
            >
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-blue-50 rounded-lg p-3">
                    <svg className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Skill Growth</p>
                    <div className="mt-3 flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900">+7%</p>
                      <p className="ml-2 text-sm font-medium text-blue-600">improvement</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">Overall progress</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white overflow-hidden shadow-lg rounded-lg border border-gray-100 hover:border-yellow-100 transition-all"
            >
              <div className="px-6 py-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-yellow-50 rounded-lg p-3">
                    <svg className="h-7 w-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hours Invested</p>
                    <div className="mt-3 flex items-baseline">
                      <p className="text-2xl font-bold text-gray-900">42</p>
                      <p className="ml-2 text-sm font-medium text-gray-500">hours</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">This month</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
            {/* Skill Development Chart */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skill Development</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={progressData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="subject" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="score" fill="#8884d8" name="Current Level" />
                  <Bar dataKey="target" fill="#82ca9d" name="Target Level" />
                  <Bar dataKey="lastMonth" fill="#ffc658" name="Last Month" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Progress Over Time */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Learning Progress</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { month: 'Jan', score: 65 },
                    { month: 'Feb', score: 68 },
                    { month: 'Mar', score: 72 },
                    { month: 'Apr', score: 75 },
                    { month: 'May', score: 78 },
                    { month: 'Jun', score: 83 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Mentorship Sessions Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Mentorship Sessions</h2>
              <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mentorshipData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {mentorshipData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Skills Radar Chart */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <h2 className="text-lg font-medium text-gray-900 mb-4">Skills Assessment</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillsData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Skills" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Feedback Section */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Provide Feedback</h2>
            <form onSubmit={handleFeedbackSubmit}>
              <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                  Rate your mentorship experience
                </label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <svg 
                        className={`h-8 w-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                  Your feedback
                </label>
                <textarea
                  id="feedback"
                  name="feedback"
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Share your thoughts on your mentorship experience..."
                />
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting || !rating}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                    (isSubmitting || !rating) ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </div>
            </form>
          </div>

          {/* Additional Analytics */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Analytics</h2>
            <PieChartComponets />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
