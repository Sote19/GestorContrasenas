import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";

// Variable global para almacenar el usuario autenticado
let authenticatedUser = null;

// ---------------------VERIFICACIÓN DE USUARIO---------------------
window.onload = function () {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      // Redirigir si no hay usuario
      window.location.href = "iniciosesion.html";
    } else {
      // Guardar el usuario autenticado en la variable global
      authenticatedUser = user;

      // Mostrar nombre del usuario en la interfaz
      const userName = user.displayName || "Usuario";
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
        userNameElement.textContent = userName;
      } else {
        console.error("El elemento 'user-name' no fue encontrado en el DOM.");
      }

      // Verificar datos de sesión, cargar la clave maestra y cargar la aplicación
      verificarSessionData();
      try {
        await cargarClaveMaestra(authenticatedUser.uid);
        cargarDatosApp();
      } catch (error) {
        console.error("Error al cargar la clave maestra:", error);
        alert("Error al cargar la clave maestra. Intenta de nuevo.");
        window.location.href = "llavero.html";
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
    sessionStorage.removeItem("userMasterKey"); // Limpiar la clave maestra
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
  }
});


// ---------------------FUNCIONES DE CLAVE MAESTRA---------------------
async function cargarClaveMaestra(uid) {
  // Recuperar el documento del usuario desde Firestore
  const userDocRef = doc(db, "USUARIOS", uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("Usuario no encontrado en la base de datos.");
  }

  const userData = userDoc.data();
  const masterKeyHash = userData.masterKey;
  const salt = hexToBuffer(userData.salt);

  // Solicitar la clave maestra al usuario
  const masterKeyInput = prompt("Introduce tu llave maestra para continuar:");

  if (!masterKeyInput) {
    throw new Error("La llave maestra es requerida.");
  }

  // Derivar y validar la clave maestra
  const { hash } = await hashPassword(masterKeyInput, salt);

  if (hash !== masterKeyHash) {
    throw new Error("La llave maestra no coincide.");
  }

  // Guardar la clave maestra descifrada temporalmente en sessionStorage
  sessionStorage.setItem("userMasterKey", masterKeyInput);
}

// Convertir un hexadecimal a un ArrayBuffer
function hexToBuffer(hex) {
  return Uint8Array.from(
    hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
  );
}

// Función para derivar un hash de clave maestra
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();

  // Importar clave
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  // Derivar clave con PBKDF2
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt"]
  );

  // Exportar la clave derivada como raw
  const hashBuffer = await crypto.subtle.exportKey("raw", key);

  return {
    hash: bufferToHex(hashBuffer),
    salt: bufferToHex(salt)
  };
}

// Convierte un ArrayBuffer a hexadecimal
function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");
}

// ---------------------VERIFICAR SESIÓN Y CARGAR DATOS---------------------
function verificarSessionData() {
  const selectedAppId = sessionStorage.getItem("selectedAppId");

  if (!selectedAppId) {
    alert("No se pudo cargar la información de la aplicación. Por favor, selecciona una app desde el llavero.");
    window.location.href = "llavero.html"; // Redirige si falta información
  }
}



// Función para cargar los datos de la aplicación desde Firestore
async function cargarDatosApp() {
  const selectedAppId = sessionStorage.getItem("selectedAppId");

  if (!authenticatedUser) {
    console.error("Usuario no autenticado.");
    return;
  }

  if (!selectedAppId) {
    console.error("Faltan datos en sessionStorage para cargar la aplicación.");
    return;
  }

  try {
    // Referencia correcta a la subcolección APP
    const appDocRef = doc(db, "USUARIOS", authenticatedUser.uid, "APP", selectedAppId);
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

// Inicializar el toggle de visibilidad de contraseña
document.addEventListener("DOMContentLoaded", () => {
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
});

