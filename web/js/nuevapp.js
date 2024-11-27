import { db, auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Variable global para almacenar el usuario autenticado
let authenticatedUser = null;

// ---------------------VERIFICACIÓN DE USUARIO EN LLAVERO---------------------
window.onload = function() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // Redirigir si no hay usuario
      window.location.href = 'iniciosesion.html';
    } else {
      // Guardar el usuario autenticado en la variable global
      authenticatedUser = user;

      // Guardar UID y nombre en sessionStorage (opcional, si se necesita)
      const userName = user.displayName || "Usuario";
      sessionStorage.setItem("userName", userName);
      sessionStorage.setItem("userUid", user.uid); // Almacenar el UID del usuario

      // Mostrar nombre del usuario en la interfaz
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
        userNameElement.textContent = userName;
      } else {
        console.error("El elemento 'user-name' no fue encontrado en el DOM.");
      }
    }
  });
};

// ---------------------------------CERRAR SESIÓN--------------------
document.getElementById('logout-button')?.addEventListener('click', async () => {
  try {
    await signOut(auth); // Redirigir al usuario al índice después de cerrar sesión
    window.location.href = 'index.html';
    authenticatedUser = null;
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
  }
});

// ---------------------------------------------FORMULARIO AÑADIR APP------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  const togglePassword = document.querySelector("#togglePassword");
  const passwordInput = document.querySelector("#password");

  // Toggle visibility for the password field
  togglePassword.addEventListener("click", function () {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      this.textContent = type === "password" ? "👁️" : "🙈";
  });

  const saveBtn = document.getElementById("saveBtn");
  const urlApp = document.getElementById("urlApp");
  const user = document.getElementById("user");
  const comment = document.getElementById("comment");

  saveBtn.addEventListener("click", async (event) => {
      event.preventDefault(); // Evita el envío del formulario

      const appName = urlApp.value.trim();
      const userValue = user.value.trim();
      const passwordValue = passwordInput.value.trim();
      const commentValue = comment.value.trim();

      // Validar que los campos no estén vacíos
      if (!appName || !userValue || !passwordValue) {
          alert("Por favor, completa todos los campos.");
          return;
      }

      // Validar si el usuario está autenticado
      if (!authenticatedUser) {
          alert("No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.");
          return;
      }

      try {
          // Referencia a la subcolección APP del usuario autenticado
          const userAppCollection = collection(db, "USUARIOS", authenticatedUser.uid, "APP");

          // Agregar un nuevo documento a la subcolección
          await addDoc(userAppCollection, {
              appName,
              appUser: userValue,
              appContra: passwordValue,
              comment: commentValue,
              createdAt: new Date() // Marca de tiempo
          });

          alert("¡Aplicación guardada con éxito!");

          // Redirigir a la página de gestor de contraseñas
          window.location.href = "llavero.html";
      } catch (error) {
          console.error("Error al guardar la aplicación:", error);
          alert("No se pudo guardar la aplicación. Inténtalo de nuevo.");
      }
  });
});

// ---------------------------------GENERAR CONTRASEÑA--------------------
document.getElementById('generate')?.addEventListener('click', generatePassword);

function generatePassword() {
  const length = 16; // Longitud de la contraseña
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?¿~';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  
  document.getElementById('password').value = password;
}


