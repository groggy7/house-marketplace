# StayBook - House Marketplace

StayBook is a modern web application for listing and finding properties for sale or rent. Built with React and Firebase, it provides a seamless experience for users to browse, list, and manage properties.

![image](https://github.com/user-attachments/assets/1766cc4c-745d-437f-9e1b-85cf36181dbc)

![image](https://github.com/user-attachments/assets/7931ca46-50e9-4700-9134-fea4bbc71ecc)

![image](https://github.com/user-attachments/assets/32092443-5c02-4bc7-ba42-387bcce939ce)

![image](https://github.com/user-attachments/assets/b22a8e49-92b3-494c-8b30-ada854334a5c)


## Features

- **User Authentication**

  - Email/Password login
  - Google OAuth integration
  - Secure user registration
  - Profile management

- **Property Management**
  - Browse available properties
  - Search functionality
  - Save favorite listings
  - Manage bookings
  - Inbox for communications

## Tech Stack

- **Frontend**

  - React 19
  - React Router DOM v7
  - Tailwind CSS for styling
  - React Hot Toast for notifications
  - React Icons
  - Daisy UI

- **Backend/Services**
  - Firebase Authentication
  - Firebase Firestore
  - Firebase Storage (for images)

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository

```bash
git clone https://github.com/groggy7/house-marketplace.git
cd house-marketplace
```

2. Install dependencies

```bash
npm install
```

3. Create a Firebase project and configure your environment variables
   - Create a `.env` file in the root directory
   - Add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server

```bash
npm run dev
```

## Project Structure

```
src/
├── assets/           # Static assets (images, icons, etc.)
├── components/       # Reusable UI components
│   ├── icons/       # SVG icons components
│   ├── Layout.jsx   # Main layout wrapper
│   ├── Header.jsx   # App header component
│   ├── Navbar.jsx   # Navigation bar component
│   ├── LoginForm.jsx # Login form component
│   └── RegisterForm.jsx # Registration form component
├── context/         # React context providers
│   └── AuthContext.jsx # Authentication context
├── pages/           # Route components/pages
│   ├── Home.jsx     # Home page
│   ├── Profile.jsx  # User profile page
│   ├── SignIn.jsx   # Login page
│   └── SignUp.jsx   # Registration page
├── firebase.config.js # Firebase configuration
├── main.jsx        # Application entry point
└── App.jsx         # Main application component
```
