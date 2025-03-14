# MentorConnect: Student-Alumni Mentorship Platform

A modern web platform connecting students with alumni mentors for career guidance and professional development.

## Features

- User Authentication & Profiles
- Personalized Dashboard
- Mentorship Matching System
- Real-time Chat & Video Calls
- Session Scheduling
- Discussion Forums
- Resource Library
- Feedback & Review System
- Event Management
- Admin Panel

## Tech Stack

- **Frontend**: React with TypeScript
- **Backend**: Node.js with Express and TypeScript
- **Database**: MongoDB
- **Authentication**: JWT with OAuth
- **UI Framework**: Tailwind CSS

## Project Structure

```
mentorconnect/
├── client/                 # Frontend React application
├── server/                 # Backend Node.js application
└── docs/                   # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both client and server directories
   - Update the variables with your configuration

4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm run dev
   ```

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 