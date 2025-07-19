# AlgoGrit DSA 👩🏻‍💻

A  web application for mastering Data Structures and Algorithms (DSA) with smart tools, code execution, notes, and problem tracking. Built with Next.js, Firebase, and a beautiful custom UI.

## Features

* **DSA Problems Dashboard**: Easily track your progress with an intuitive dashboard featuring filters, search functionality, and real-time progress updates.
* **Personal Notes**: Organize your thoughts and solutions with a dedicated notes section. It supports custom topics, search, and full **CRUD (Create, Read, Update, Delete)** operations for efficient management.
* **AI Chatbot Assistant**: Get instant, intelligent assistance with your DSA queries from our integrated AI chatbot (login required).
* **User Authentication**: Securely access your personalized learning environment with **Firebase Auth** for straightforward signup and login.
* **Code Editor with Execution**: Test your code directly within the application. You can easily download your code and prepare it for submission to popular platforms like CSES and Codeforces.
* **Responsive UI**: Enjoy a consistent and optimized experience across all your devices, thanks to a fully responsive design and mobile-friendly navigation.

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
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---
