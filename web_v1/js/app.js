import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";

// Función para inicializar eventos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  inicializarLogoutButton();
  inicializarTogglePassword();
  verificarSessionData();
  cargarDatosApp();
});

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
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
        userNameElement.textContent = userName;
      } else {
        console.error("El elemento 'user-name' no fue encontrado en el DOM.");
      }

      // Cargar aplicaciones
      await cargarApps(user.uid);
    }
  });
};


// ---------------------------------CERRAR SESIÓN--------------------
document.getElementById('logout-button')?.addEventListener('click', async () => {
  try {
    await signOut(auth); // Redirigir al usuario al índice después de cerrar sesión
    window.location.href = 'index.html';
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
  }
});

// Función para inicializar el toggle de visibilidad de contraseña
function inicializarTogglePassword() {
  const togglePassword = document.querySelector("#togglePassword");
  if (togglePassword) {
    togglePassword.addEventListener("click", function () {
      const passwordInput = document.querySelector("#password");
      if (passwordInput) {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.textContent = type === "password" ? "👁️" : "🙈";
      } else {
        console.error("El campo de contraseña no existe en el DOM.");
      }
    });
  } else {
    console.warn("El botón para alternar visibilidad de contraseña no está disponible.");
  }
}

// Verificar si hay información necesaria en sessionStorage
function verificarSessionData() {
  const selectedAppId = sessionStorage.getItem("selectedAppId");
  const userId = sessionStorage.getItem("userUid");

  if (!selectedAppId || !userId) {
    alert("No se pudo cargar la información de la aplicación. Por favor, selecciona una app desde el llavero.");
    window.location.href = "llavero.html"; // Redirige si falta información
  }
}

// Función para cargar los datos de la aplicación desde Firestore
async function cargarDatosApp() {
  const selectedAppId = sessionStorage.getItem("selectedAppId");
  const userId = sessionStorage.getItem("userUid");

  if (!selectedAppId || !userId) {
    console.error("Faltan datos en sessionStorage para cargar la aplicación.");
    return;
  }

  try {
    // Referencia correcta a la subcolección APP
    const appDocRef = doc(db, "USUARIOS", userId, "APP", selectedAppId);
    const appSnapshot = await getDoc(appDocRef);

    if (!appSnapshot.exists()) {
      alert("La aplicación seleccionada no existe o fue eliminada.");
      window.location.href = "llavero.html";
      return;
    }

    const appData = appSnapshot.data();
    console.log("Datos de la app:", appData); // Depuración
    actualizarDOM(appData);
  } catch (error) {
    console.error("Error al cargar la información de la aplicación:", error);
    alert("Ocurrió un error al cargar la información. Inténtalo de nuevo.");
  }
}

// Función para actualizar el DOM con los datos de la app
function actualizarDOM(appData) {
  const appNameElement = document.getElementById("app-name");
  const userElement = document.getElementById("user");
  const passwordElement = document.getElementById("password");
  const commentElement = document.getElementById("comment");

  if (appNameElement) {
    appNameElement.textContent = appData.appName || "Sin nombre";
  } else {
    console.error("Elemento 'app-name' no encontrado en el DOM.");
  }

  if (userElement) {
    userElement.value = appData.appUser || "Sin usuario";
  } else {
    console.error("Elemento 'user' no encontrado en el DOM.");
  }

  if (passwordElement) {
    // Descifrar la contraseña antes de mostrarla
    try {
      const userMasterKey = sessionStorage.getItem("userMasterKey");
      if (!userMasterKey) throw new Error("Clave maestra no disponible.");

      const decryptedPassword = AES.decrypt(appData.appContra, userMasterKey).toString(Utf8);
      passwordElement.value = decryptedPassword || "Sin contraseña";
    } catch (error) {
      console.error("Error al descifrar la contraseña:", error);
      passwordElement.value = "Error al descifrar";
    }
  } else {
    console.error("Elemento 'password' no encontrado en el DOM.");
  }

  if (commentElement) {
    commentElement.value = appData.comment || "Sin comentarios";
  } else {
    console.error("Elemento 'comment' no encontrado en el DOM.");
  }
}
