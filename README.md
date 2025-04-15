# StayBook - House Marketplace

StayBook is a modern web application for listing and finding properties for sale or rent. Built with React in frontend Go in backend, it provides a seamless experience for users to browse, list, and manage properties.

![image](https://github.com/user-attachments/assets/1766cc4c-745d-437f-9e1b-85cf36181dbc)

![image](https://github.com/user-attachments/assets/7931ca46-50e9-4700-9134-fea4bbc71ecc)

![image](https://github.com/user-attachments/assets/32092443-5c02-4bc7-ba42-387bcce939ce)

![image](https://github.com/user-attachments/assets/b22a8e49-92b3-494c-8b30-ada854334a5c)

## Features

- **User Authentication**

  - JWT-based authentication
  - Secure user registration
  - Profile management
  - Session management with HTTP-only cookies

- **Property Management**

  - Browse available properties
  - Search functionality
  - Save favorite listings
  - Manage bookings
  - Real-time chat with property owners

- **Real-time Messaging**
  - WebSocket-based instant messaging
  - Chat rooms for property inquiries
  - Real-time notifications
  - Message history

## Tech Stack

- **Frontend**

  - React 19
  - React Router DOM v7
  - Tailwind CSS for styling
  - React Hot Toast for notifications
  - React Icons
  - Daisy UI
  - WebSocket client for real-time messaging

- **Backend**
  - Go (Golang) server
  - PostgreSQL database
  - WebSocket server for real-time communication
  - JWT authentication
  - RESTful API endpoints
  - [Backend Repository](https://github.com/groggy7/house-marketplace-server)

## Getting Started

### Prerequisites

- Node.js (latest LTS version)
- npm or yarn

### Frontend Installation

1. Clone the repository

```bash
git clone https://github.com/groggy7/house-marketplace.git
cd house-marketplace
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables
   - Create a `.env` file in the root directory:

```env
VITE_BACKEND_SERVER_HEROKU=backend_url
VITE_WS_SERVER_HEROKU=websocket_server_url
```

4. Start the development server

```bash
npm run dev
```

### Backend Setup

For backend setup and configuration, please follow the instructions in the [backend repository](https://github.com/groggy7/house-marketplace-server).

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
│   ├── AuthContext.jsx    # Authentication context
│   └── WebSocketContext.jsx # WebSocket context for real-time messaging
├── pages/           # Route components/pages
│   ├── Search.jsx    # Search/Home page
│   ├── Profile.jsx   # User profile page
│   ├── Login.jsx     # Login page
│   ├── Register.jsx  # Registration page
│   ├── Inbox.jsx     # Messaging inbox
│   └── ListingDetail.jsx # Property details page
├── main.jsx        # Application entry point
└── App.jsx         # Main application component
```
