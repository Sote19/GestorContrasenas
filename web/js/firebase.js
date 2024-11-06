// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_0yehy8ZaXcl3UY22PmlNpB7wIV4HpAs",
  authDomain: "gestorgtx.firebaseapp.com",
  projectId: "gestorgtx",
  storageBucket: "gestorgtx.firebasestorage.app",
  messagingSenderId: "155430917151",
  appId: "1:155430917151:web:ecf5d9c6f086963654312a",
  measurementId: "G-W04SS3Y4RP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
