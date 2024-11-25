import { db, auth } from './firebase.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


// ---------------------VERIFICACIÓN DE USUARIO EN LLAVERO---------------------
window.onload = function() {
    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            // Redirigir si no hay usuario
            window.location.href = 'iniciosesion.html';
        } else {
            // Guardar UID y nombre en sessionStorage
            const userName = user.displayName || "Usuario";
            sessionStorage.setItem("userName", userName);
            sessionStorage.setItem("userUid", user.uid); // Almacenar el UID del usuario
  
            // Mostrar nombre del usuario en la interfaz
            document.getElementById("user-name").textContent = userName;
  
            // Cargar aplicaciones
            await cargarDetallesApp(user.uid);
        }
    });
};


// Cargar los detalles de la app seleccionada
async function cargarDetallesApp(userUid) {
    // Recuperar el ID de la app seleccionada desde sessionStorage
    const appId = sessionStorage.getItem("selectedAppId");

    if (appId) {
        try {
            // Obtener los detalles de la app desde Firestore
            const appRef = doc(db, "users", userUid, "APP", appId); // Ruta de la app en Firestore
            const appSnap = await getDoc(appRef);

            if (appSnap.exists()) {
                const appData = appSnap.data();

                // Llenar los campos con los datos de la app
                document.getElementById("app-name").textContent = appData.appName;
                document.getElementById("user").value = appData.appUser;
                document.getElementById("password").value = appData.appPassword;
                document.getElementById("comment").value = appData.comment || "Sin comentarios";
            } else {
                alert("No se encontraron detalles para esta aplicación.");
            }
        } catch (error) {
            console.error("Error al cargar los detalles de la app: ", error);
        }
    } else {
        alert("No se seleccionó ninguna app.");
    }
}