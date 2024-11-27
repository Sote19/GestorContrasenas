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
  const masterKeyInput = await requestMasterKey();

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

// -------------------ELIMINAR APP-------------------
import { deleteDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Obtener el botón de eliminar
const deleteAppButton = document.getElementById("deleteAppButton");

if (deleteAppButton) {
    deleteAppButton.addEventListener("click", async () => {
        const selectedAppId = sessionStorage.getItem("selectedAppId");
        const userId = sessionStorage.getItem("userUid");

        if (!selectedAppId || !userId) {
            alert("No se pudo identificar la aplicación a eliminar. Inténtalo de nuevo.");
            return;
        }

        const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta aplicación?");
        if (!confirmDelete) {
            return; // Cancela si el usuario no confirma
        }

        try {
            // Referencia al documento específico
            const appDocRef = doc(db, "USUARIOS", userId, "APP", selectedAppId);

            // Eliminar el documento
            await deleteDoc(appDocRef);

            alert("¡La aplicación fue eliminada con éxito!");

            // Redirigir al usuario a la lista de aplicaciones
            window.location.href = "llavero.html";
        } catch (error) {
            console.error("Error al eliminar la aplicación:", error);
            alert("Ocurrió un error al intentar eliminar la aplicación. Inténtalo de nuevo.");
        }
    });
} else {
    console.warn("El botón 'Eliminar APP' no está disponible en el DOM.");
}

// Mostrar el modal para solicitar la clave maestra
function requestMasterKey() {
  return new Promise((resolve) => {
      const modal = document.getElementById("masterKeyModal");
      const input = document.getElementById("masterKeyInput");
      const button = document.getElementById("submitMasterKey");

      // Mostrar el modal
      modal.style.display = "flex";

      // Manejar el evento de clic en el botón
      button.addEventListener("click", () => {
          const masterKey = input.value;
          if (!masterKey) {
              alert("Por favor, introduce tu llave maestra.");
              return;
          }
          // Ocultar el modal y devolver la clave
          modal.style.display = "none";
          resolve(masterKey);
      });
  });
}

// Usar la función para obtener la clave maestra
(async () => {
  try {
      const masterKey = await requestMasterKey();
      console.log("Clave maestra ingresada:", masterKey); // Aquí puedes usar la clave según necesites
  } catch (error) {
      console.error("Error al solicitar la clave maestra:", error);
  }
})();

// Elementos del DOM
const passwordInput = document.getElementById("password");
const copyPasswordButton = document.getElementById("copyPassword");
const togglePasswordVisibilityButton = document.getElementById("togglePasswordVisibility");

// Función: Alternar visibilidad de la contraseña
togglePasswordVisibilityButton.addEventListener("click", () => {
    if (passwordInput) {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);

        // Alternar el ícono
        const icon = togglePasswordVisibilityButton.querySelector("i");
        if (icon) {
            icon.classList.toggle("bi-eye");
            icon.classList.toggle("bi-eye-slash");
        }
    } else {
        console.error("El campo de contraseña no existe en el DOM.");
    }
});

// Función: Copiar contraseña al portapapeles con temporizador
copyPasswordButton.addEventListener("click", async () => {
  if (passwordInput.value) {
      try {
          // Copiar la contraseña al portapapeles
          await navigator.clipboard.writeText(passwordInput.value);
          alert("¡Contraseña copiada al portapapeles!");
      } catch (err) {
          console.error("Error al copiar la contraseña: ", err);
          alert("No se pudo copiar la contraseña. Intenta de nuevo.");
      }
  } else {
      alert("No hay ninguna contraseña para copiar.");
  }
});

const copyUserButton = document.getElementById("copyUser");
const userInput = document.getElementById("user");

copyUserButton.addEventListener("click", async () => {
  if (userInput.value) {
      try {
          // Copiar el nombre de usuario al portapapeles
          await navigator.clipboard.writeText(userInput.value);
          alert("¡Nombre de usuario copiado al portapapeles!");
      } catch (err) {
          console.error("Error al copiar el nombre de usuario: ", err);
          alert("No se pudo copiar el nombre de usuario. Intenta de nuevo.");
      }
  } else {
      alert("No hay ningún nombre de usuario para copiar.");
  }
});


// -------------------EDITAR-------------------
// Función para habilitar la edición de los campos y cambiar su color
function habilitarEdicion() {
  const campos = ["user", "password", "comment"];
  
  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.readOnly = false;
      // Aplicar color claro con transparencia
      campo.style.backgroundColor = "rgba(255, 253, 200)"; // Amarillo suave claro
    }
  });
}

// Asignar el evento al botón "Editar"
document.getElementById("editAppButton")?.addEventListener("click", habilitarEdicion);
