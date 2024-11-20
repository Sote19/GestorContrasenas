import { auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

window.onload = function() {
  // Monitoreamos el estado de autenticación del usuario
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Si el usuario está autenticado, mostramos su nombre
      document.getElementById("user-name").textContent = user.displayName || "Usuario"; // Obtiene displayName de Firebase

    } else {
      // Si no hay usuario autenticado, redirigimos a la página de inicio de sesión
      window.location.href = 'iniciosesion.html';
    }
  });

  // Botón de cerrar sesión
  document.getElementById('logout-button').addEventListener('click', async () => {
    try {
      // Cerrar sesión de Firebase
      await signOut(auth);

      // Redirigir al usuario al índice después de cerrar sesión
      window.location.href = 'index.html';
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
    }
  });
};
