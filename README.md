# Card Navigation App

A minimal React application with Firebase backend for managing and displaying navigation cards.

## Features

- **Home Page**: Display cards in a responsive grid with click-to-navigate functionality
- **Admin Panel**: Protected admin area for CRUD operations with drag-and-drop reordering
- **Firebase Integration**: Authentication and Firestore for data persistence
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Firestore Database** (start in production mode)
3. Enable **Email/Password Authentication**
4. Copy your Firebase config from Project Settings
5. Update `.env.local` with your Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 3. Set up Firestore Security Rules

In Firebase Console > Firestore Database > Rules, add:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cards/{cardId} {
      allow read: if true;  // Public read
      allow write: if request.auth != null;  // Authenticated users only
    }
  }
}
```

### 4. Create Admin User

1. Download your service account key:

   - Firebase Console > Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Save as `serviceAccountKey.json` in project root

2. Update admin credentials in `scripts/createAdmin.js`:

```javascript
const ADMIN_EMAIL = "your-admin@example.com";
const ADMIN_PASSWORD = "YourSecurePassword123!";
```

3. Run the script:

```bash
node scripts/createAdmin.js
```

4. **Important**: Add `serviceAccountKey.json` to `.gitignore` (already configured)

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:5173`

## Usage

- **Home Page** (`/`): View all cards, click to navigate to links
- **Admin Login** (`/login`): Sign in with your admin credentials
- **Admin Panel** (`/admin`): Add, edit, delete, and reorder cards with drag-and-drop

## Tech Stack

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Firebase (Auth + Firestore)
- **Routing**: React Router
- **Drag & Drop**: @dnd-kit

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   └── ProtectedRoute.jsx
├── lib/
│   ├── firebase.js      # Firebase initialization
│   └── utils.js         # shadcn utilities
├── pages/
│   ├── Home.jsx         # Public card grid
│   ├── Login.jsx        # Admin login
│   └── Admin.jsx        # Admin panel with CRUD
├── services/
│   └── cardService.js   # Firestore operations
└── App.jsx              # Router setup
```

## Notes

- Cards use numeric ordering with automatic recalculation on drag-drop
- Text truncation: title uses `truncate`, description uses `line-clamp-2`
- Links open in new tabs with `noopener,noreferrer` security
- Single admin user model (no multi-admin support)
# hikmet-penceresi
