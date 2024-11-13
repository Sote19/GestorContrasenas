// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-analytics.js";
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

// Inicializar Firebase y servicios
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { firebaseConfig, db, auth, analytics };
