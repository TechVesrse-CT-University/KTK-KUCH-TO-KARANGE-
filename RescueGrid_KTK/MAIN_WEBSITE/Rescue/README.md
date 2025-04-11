# RescueX - Emergency Response Platform

![RescueX Logo](public/logo.png)

## Overview

RescueX is a modern emergency response coordination platform designed to connect rescuers with those in need during crisis situations. The platform leverages real-time data, geolocation services, and secure communication channels to facilitate rapid response and resource allocation during emergencies.

## Features

- **Real-time Emergency Tracking**: Monitor emergency situations as they develop
- **Resource Coordination**: Efficiently allocate rescue personnel and equipment
- **Secure Communication**: End-to-end encrypted messaging between responders
- **Interactive Maps**: Visual representation of affected areas and rescue teams
- **User Authentication**: Secure login for rescuers and administrators
- **Mobile Responsive**: Fully functional on both desktop and mobile devices

## Technology Stack

- **Frontend**: React with Vite, TypeScript
- **State Management**: Redux / Context API
- **UI Framework**: Material UI / Tailwind CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Hosting**: Firebase Hosting
- **APIs**: Custom Node.js backend

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Firebase account
- Git

## Installation & Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-organization/rescue.git
cd rescue
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
```

3. **Environment Configuration**

Create a `.env` file in the project root with the following variables:

```
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id

# API Configuration
VITE_API_URL=http://localhost:5000/api

# Optional: Map API Keys (if using premium map services)
# VITE_MAPBOX_API_KEY=your_mapbox_key
```

4. **Start the development server**

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173/`

## Project Structure

```
rescue/
├── public/             # Static assets
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts for state management
│   ├── hooks/          # Custom React hooks
│   ├── pages/          # Application pages
│   ├── services/       # API and service integrations
│   ├── utils/          # Utility functions
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── .env                # Environment variables
├── index.html          # HTML entry point
├── package.json        # Project dependencies and scripts
└── vite.config.js      # Vite configuration
```

## Usage

### User Roles

- **Administrators**: Manage system settings, user accounts, and view analytics
- **Dispatch Operators**: Create and assign emergency incidents
- **Field Responders**: Accept assignments and update incident status
- **Analysts**: View data and generate reports

### Core Workflows

1. **Emergency Registration**
   - Incident details are logged into the system
   - Classification by urgency and type

2. **Resource Allocation**
   - Available responders are identified
   - Resources are assigned based on proximity and capabilities

3. **Response Coordination**
   - Real-time communication between team members
   - Status updates and progress tracking

4. **Incident Resolution**
   - Documentation of actions taken
   - After-action review and reporting

## API Documentation

The RescueX platform uses a RESTful API for backend communication. Detailed API documentation is available at `/api/docs` when running the development server.

### Key Endpoints

- `GET /incidents` - List all active incidents
- `POST /incidents` - Create a new incident
- `GET /resources` - List available resources
- `POST /dispatch` - Assign resources to an incident

## Deployment

### Development Environment

```bash
npm run build
npm run preview
```

### Production Deployment

1. Configure Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

2. Deploy to Firebase
```bash
npm run build
firebase deploy
```

## Contributing

We welcome contributions to RescueX! Please see our [Contributing Guide](CONTRIBUTING.md) for more information.

## Security

If you discover any security issues, please email security@rescuex.org instead of using the issue tracker.

## License

RescueX is licensed under the [MIT License](LICENSE).

## Support

For support and questions, contact our team at support@rescuex.org or open an issue in the GitHub repository.

---

© 2023 RescueX Team | Made with ❤️ for emergency responders worldwide
