// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCF6y0zxzW5YmVwqZeelTXiqtm5JXhC_Us",
  authDomain: "gtx-database.firebaseapp.com",
  projectId: "gtx-database",
  storageBucket: "gtx-database.appspot.com",
  messagingSenderId: "804205977819",
  appId: "1:804205977819:web:ddcd76134e6b4690a36cfe",
  measurementId: "G-C6H1EMYN6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);