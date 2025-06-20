# AlgoGrit DSA

A modern web application for mastering Data Structures and Algorithms (DSA) with smart tools, code execution, notes, and problem tracking. Built with Next.js, Firebase, and a beautiful custom UI.

## Features

- 🚀 DSA Problems dashboard with filters, search, and progress tracking
- 📝 Personal Notes with tags, search, and CRUD operations
- 🤖 AI bot to help you with your queries
- 🔒 User authentication (signup/login) with Firebase Auth
- ☁️ Data persistence using Firestore
- 💻 Code editor with code execution so that you can just test your code, download it and upload it for platforms like cses, codeforces etc.

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/shwet46/algogrit-dsa.git
cd algogrit-dsa
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
- Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
- Enable Authentication (Email/Password)
- Create a Firestore database
- Set your Firestore rules (see below)
- Copy your Firebase config to `.env.local`:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Firestore Security Rules Example
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      match /{subcollection=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
    match /notes/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
---