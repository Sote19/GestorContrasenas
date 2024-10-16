// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-analytics.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js"; // Import Firestore

// Your web app's Firebase configuration
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

// Initialize Firestore
const db = getFirestore(app); // Asegúrate de pasar `app` aquí

// Función para registrar un nuevo usuario
export async function registerUser(name, email, password) {
    try {
        // Agregar documento a la colección 'USUARIOS'
        const docRef = await addDoc(collection(db, "USUARIOS"), {
            nombre: name,
            correo: email,
            contraseña: password, // Considera cifrar la contraseña
            fecha_registro: new Date()
        });
        console.log("Documento añadido con ID: ", docRef.id);
    } catch (e) {
        console.error("Error añadiendo documento: ", e);
    }
}
