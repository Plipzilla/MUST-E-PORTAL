# MUST E-Portal - React + Firebase

A modern admission portal for Malawi University of Science and Technology built with React and Firebase.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive design with smooth animations
- **User Authentication**: Secure login/signup with Firebase Auth
- **Application Management**: Multi-step application form with progress tracking
- **Dashboard**: Real-time application status tracking
- **Document Upload**: Secure file storage with Firebase Storage
- **Real-time Updates**: Live status updates with Firestore
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: CSS3 with modern design system
- **Backend**: Firebase (Firestore, Authentication, Storage)
- **Routing**: React Router v6
- **Icons**: Font Awesome 6
- **Deployment**: Firebase Hosting

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

## 🔧 Installation & Setup

### 1. Clone and Install Dependencies

```bash
cd must-e-portal
npm install
```

### 2. Firebase Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Name your project (e.g., "must-e-portal")
   - Follow the setup wizard

2. **Enable Services**:
   - **Authentication**: Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - **Firestore**: Go to Firestore Database > Create database
   - Start in test mode (we'll add security rules later)
   - **Storage**: Go to Storage > Get started
   - Start in test mode

3. **Get Configuration**:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Register your app
   - Copy the config object

4. **Update Firebase Config**:
   - Open `src/firebase/config.ts`
   - Replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── Header/         # Navigation header
├── pages/              # Page components
│   └── Home/           # Home page
├── firebase/           # Firebase configuration
│   └── config.ts       # Firebase setup
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
└── styles/             # Global styles
```

## 🔐 Authentication Flow

1. **Sign Up**: Users create accounts with email/password
2. **Login**: Secure authentication with Firebase Auth
3. **Protected Routes**: Dashboard and application pages require authentication
4. **Session Management**: Automatic login state persistence

## 📝 Application Process

1. **Account Creation**: User registers with email/password
2. **Program Selection**: Choose from Postgraduate, ODL, or Weekend programs
3. **Personal Information**: Fill in personal and contact details
4. **Educational Background**: Provide academic qualifications
5. **Document Upload**: Submit required documents
6. **Review & Submit**: Final review and submission
7. **Status Tracking**: Monitor application progress in dashboard

## 🎨 Design System

- **Primary Color**: #003366 (Navy Blue)
- **Secondary Color**: #4CAF50 (Green)
- **Accent Color**: #FF9800 (Orange)
- **Typography**: Segoe UI, Tahoma, Geneva, Verdana, sans-serif
- **Shadows**: Subtle elevation with CSS box-shadow
- **Transitions**: Smooth 0.3s ease transitions

## 🚀 Deployment

### Firebase Hosting

1. **Install Firebase CLI**:
```bash
npm install -g firebase-tools
```

2. **Login to Firebase**:
```bash
firebase login
```

3. **Initialize Firebase Hosting**:
```bash
firebase init hosting
```

4. **Build and Deploy**:
```bash
npm run build
firebase deploy
```

## 🔧 Development Commands

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App (not recommended)
```

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🔒 Security Considerations

- Firebase Security Rules for Firestore and Storage
- Input validation and sanitization
- Protected routes with authentication
- Secure file upload with type validation
- Environment variables for sensitive data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the Firebase documentation

## 🗺️ Roadmap

- [ ] Admin dashboard for application management
- [ ] Email notifications
- [ ] Payment integration
- [ ] Advanced analytics
- [ ] Multi-language support
- [ ] Progressive Web App (PWA) features

## 🔧 Firebase Admin SDK

### Example: Set admin claim for a user
```js
admin.auth().setCustomUserClaims(uid, { admin: true });
```
