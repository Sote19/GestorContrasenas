import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Inicializa Firebase (asegúrate de tener configurado tu firebaseConfig en un archivo separado)
import { db, auth } from "./firebase.js"; // Ajusta esta ruta según tu estructura de proyecto

// Selección del formulario
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const email = emailInput.value.trim();

    if (!email) {
        alert("Por favor, introduce un correo electrónico.");
        return;
    }

    try {
        // Verificar si el correo existe en Firestore
        const usersCollection = collection(db, "USUARIOS");
        const q = query(usersCollection, where("email", "==", email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            // Si no encuentra el correo en Firestore
            emailInput.value = "";
            alert("Hemos enviado un correo con las instrucciones para restablecer tu contraseña, si no te ha llegado ningún mensaje, revisa que hayas escrito bien tu correo.");
            return;
        }

        // Enviar el correo de restablecimiento utilizando Firebase Authentication
        await sendPasswordResetEmail(auth, email);
        alert("Hemos enviado un correo con las instrucciones para restablecer tu contraseña.");
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);

        if (error.code === "auth/user-not-found") {
            // Si el correo no está registrado en Authentication
            emailInput.value = "";
            alert("El correo electrónico no está registrado en el sistema.");
        } else {
            alert("Ocurrió un error. Por favor, inténtalo nuevamente.");
        }
    }
});
