// firebase.tsx
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBZxJe1oWTCbxuC5G1JNfyrVvYqUu4FQYw",
    authDomain: "team-creator-1a5b3.firebaseapp.com",
    projectId: "team-creator-1a5b3",
    storageBucket: "team-creator-1a5b3.appspot.com",
    messagingSenderId: "36289655285",
    appId: "1:36289655285:web:1670bde41d889dad2370bc",
    measurementId: "G-RZ9MF4WVVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
