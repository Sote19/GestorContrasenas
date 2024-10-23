// Importar las funciones desde SDKs que se necesitan 
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";
// https://firebase.google.com/docs/web/setup#available-libraries

// Configuración de firebase
const firebaseConfig = {
  apiKey: "AIzaSyCF6y0zxzW5YmVwqZeelTXiqtm5JXhC_Us",
  authDomain: "gtx-database.firebaseapp.com",
  projectId: "gtx-database",
  storageBucket: "gtx-database.appspot.com",
  messagingSenderId: "804205977819",
  appId: "1:804205977819:web:ddcd76134e6b4690a36cfe",
  measurementId: "G-C6H1EMYN6H"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
// Inicializar Firestore
const db = getFirestore(app);
const analytics = getAnalytics(app);

// 5. Función para escribir datos en Firestore
async function addData() {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      name: "Ada Wong",
      age: 30
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

// 6. Función para leer datos de Firestore
async function getData() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${doc.data()}`);
  });
}

// 7. Llamar a las funciones
addData();  // Escribir datos
getData();  // Leer datos
