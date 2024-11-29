import { doc, getDoc, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";
import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";


// Variable global para almacenar el usuario autenticado
let authenticatedUser = null;

// ---------------------VERIFICACIÓN DE USUARIO---------------------
window.onload = function () {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "iniciosesion.html";
    } else {
      authenticatedUser = user;

      const userName = user.displayName || "Usuario";
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
        userNameElement.textContent = userName;
      } else {
        console.error("El elemento 'user-name' no fue encontrado en el DOM.");
      }

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

// ---------------------CERRAR SESIÓN---------------------
document.getElementById("logout-button")?.addEventListener("click", async () => {
  try {
    await signOut(auth);
    window.location.href = "index.html";
    authenticatedUser = null;
    sessionStorage.removeItem("userMasterKey");
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    alert("No se pudo cerrar sesión. Inténtalo de nuevo.");
  }
});


// ---------------------FUNCIONES DE CLAVE MAESTRA---------------------
async function cargarClaveMaestra(uid) {
  const userDocRef = doc(db, "USUARIOS", uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    throw new Error("Usuario no encontrado en la base de datos.");
  }

  const userData = userDoc.data();
  const masterKeyInput = await requestMasterKey(); // Solicitar la llave maestra al usuario

  if (!masterKeyInput) {
    throw new Error("La llave maestra es requerida.");
  }

  const encryptionKey = await getEncryptionKey(masterKeyInput);
  sessionStorage.setItem("userMasterKey", masterKeyInput); // Guardar temporalmente la llave
  return encryptionKey;
}

// -------------------VERIFICAR Y CARGAR DATOS-------------------
function verificarSessionData() {
  const selectedAppId = sessionStorage.getItem("selectedAppId");
  if (!selectedAppId) {
    alert("No se pudo cargar la información de la aplicación. Por favor, selecciona una app desde el llavero.");
    window.location.href = "llavero.html";
  }
}

async function cargarDatosApp() {
  const selectedAppId = sessionStorage.getItem("selectedAppId");

  if (!authenticatedUser || !selectedAppId) {
    console.error("Faltan datos del usuario o ID de la app.");
    return;
  }

  try {
    const appDocRef = doc(db, "USUARIOS", authenticatedUser.uid, "APP", selectedAppId);
    const appSnapshot = await getDoc(appDocRef);

    if (!appSnapshot.exists()) {
      alert("La aplicación seleccionada no existe o fue eliminada.");
      window.location.href = "llavero.html";
      return;
    }

    const appData = appSnapshot.data();

    if (!appData.appContra || !appData.iv) {
      throw new Error("Faltan campos necesarios para el descifrado (appContra o iv).");
    }

    const masterKey = sessionStorage.getItem("userMasterKey");
    if (!masterKey) {
      throw new Error("No se encontró la llave maestra en la sesión.");
    }

    const encryptionKey = await getEncryptionKey(masterKey);
    const decryptedPassword = await decryptPassword(appData.appContra, appData.iv, encryptionKey);

    appData.appContra = decryptedPassword;
    actualizarDOM(appData);
  } catch (error) {
    console.error("Error al cargar o descifrar los datos de la aplicación:", error);
    alert("Ocurrió un error al cargar los datos. Revisa la consola para más detalles.");
  }
}

function actualizarDOM(appData) {
  const campos = {
    "app-name": appData.appName || "Sin nombre",
    "app-URL": appData.appUrl || "",
    "user": appData.appUser || "Sin usuario",
    "password": appData.appContra || "Sin contraseña",
    "comment": appData.comment || ""
  };

  for (const [id, value] of Object.entries(campos)) {
    const elemento = document.getElementById(id);
    if (elemento) {
      elemento.value = value;
    } else {
      console.warn(`Elemento con ID ${id} no encontrado en el DOM.`);
    }
  }
}


// --------------------DESCIFRAR CONTRASEÑA-------------------
async function decryptPassword(encryptedPassword, ivHex, encryptionKey) {
  const iv = hexToBuffer(ivHex); // Convertir IV de Hex a Uint8Array
  const encryptedBuffer = hexToBuffer(encryptedPassword); // Convertir contraseña de Hex a Uint8Array

  const decryptedContent = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: iv,  // Vector de inicialización
    },
    encryptionKey,  // Usar la misma clave derivada para descifrar
    encryptedBuffer
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedContent);  // Retornar la contraseña descifrada
}


// --------------------UTILIDAD PARA CONVERTIR HEX A BUFFER-------------------
// Función para convertir Hex a Uint8Array
function hexToBuffer(hex) {
  if (!hex || typeof hex !== "string") {
    console.error("Hex inválido:", hex);
    throw new Error("Formato Hex no válido.");
  }
  return Uint8Array.from(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}


// --------------------FUNCIÓN PARA OBTENER CLAVE DE DESCIFRADO-------------------
async function getEncryptionKey(masterKey) {
  // Convertir la llave maestra a bytes
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(masterKey);

  // Derivar una clave AES-GCM de 256 bits
  const derivedKey = await crypto.subtle.importKey(
    "raw",
    keyMaterial,
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode("fixed-salt"), // Puedes usar un valor más complejo y constante
      iterations: 100000,
      hash: "SHA-256"
    },
    derivedKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}


// -------------------PEDIR LLAVE MAESTRA-------------------
function requestMasterKey() {
  return new Promise((resolve) => {
    const modal = document.getElementById("masterKeyModal");
    const input = document.getElementById("masterKeyInput");
    const button = document.getElementById("submitMasterKey");

    modal.style.display = "flex";

    button.addEventListener("click", () => {
      const masterKey = input.value;
      if (!masterKey) {
        alert("Por favor, introduce tu llave maestra.");
        return;
      }
      modal.style.display = "none";
      resolve(masterKey);
    });
  });
}


// -----------------------MOSTRAR CONTRASEÑA-----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const togglePasswordButton = document.querySelector("#togglePasswordVisibility");
  const passwordInput = document.querySelector("#password");

  // Evento para alternar entre mostrar y ocultar la contraseña
  togglePasswordButton?.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password"; // Alternar entre 'password' y 'text'
    passwordInput.setAttribute("type", type);  // Cambiar tipo de input

    // Cambiar ícono dependiendo de la visibilidad de la contraseña
    const icon = togglePasswordButton.querySelector("i");
    icon.classList.toggle("bi-eye");  // Cambiar el icono de ojo cerrado
    icon.classList.toggle("bi-eye-slash");  // Cambiar el icono de ojo abierto
  });
});


// --------------------------ELIMINAR APP-----------------------------------
async function eliminarAplicacion(appId) {
  try {
    // Obtener el documento de la aplicación usando el ID de la aplicación
    const appDocRef = doc(db, "USUARIOS", authenticatedUser.uid, "APP", appId);

    // Eliminar el documento de la base de datos
    await deleteDoc(appDocRef);
    
    alert("Aplicación eliminada con éxito.");
    window.location.href = "llavero.html";  // Redirigir al llavero después de la eliminación
  } catch (error) {
    console.error("Error al eliminar la aplicación:", error);
    alert("No se pudo eliminar la aplicación. Inténtalo de nuevo.");
  }
}

// Añadir evento al botón de eliminar
document.getElementById("deleteAppButton")?.addEventListener("click", async () => {
  const selectedAppId = sessionStorage.getItem("selectedAppId");
  
  if (!selectedAppId) {
    alert("No se ha seleccionado ninguna aplicación.");
    return;
  }

  const confirmDelete = confirm("¿Estás seguro de que deseas eliminar esta aplicación?");
  if (confirmDelete) {
    await eliminarAplicacion(selectedAppId);  // Llamar a la función para eliminar
  }
});


// -------------------EDITAR-------------------
// Función para habilitar la edición de los campos
document.getElementById("editAppButton")?.addEventListener("click", habilitarEdicion);

function habilitarEdicion() {
  // Lista de campos a habilitar para edición
  const campos = ["app-name", "app-URL", "user", "password", "comment"];

  campos.forEach(id => {
    const campo = document.getElementById(id);
    if (campo) {
      campo.readOnly = false; // Hacer que el campo sea editable
      // Cambiar el fondo de los campos a un color suave para indicar que son editables
      campo.style.backgroundColor = "rgba(255, 253, 200)"; // Amarillo suave
    }
  });

  // Cambiar el texto del botón a "Guardar cambios"
  const editButton = document.getElementById("editAppButton");
  if (editButton) {
    editButton.textContent = "Guardar cambios";
    editButton.removeEventListener("click", habilitarEdicion);  // Eliminar el evento anterior
    editButton.addEventListener("click", guardarCambios);  // Asignar el nuevo evento para guardar
  }
}

// -------------------GUARDAR CAMBIOS-------------------
async function guardarCambios() {
  const selectedAppId = sessionStorage.getItem("selectedAppId");

  if (!selectedAppId) {
    alert("No se ha seleccionado ninguna aplicación.");
    return;
  }

  // Obtener los valores de los campos editados
  const appName = document.getElementById("app-name").value.trim();
  const appUrl = document.getElementById("app-URL").value.trim();
  const appUser = document.getElementById("user").value.trim();
  const appPassword = document.getElementById("password").value.trim();
  const appComment = document.getElementById("comment").value.trim();

  // Validar que los campos obligatorios no estén vacíos
  if (!appName || !appUser || !appPassword) {
    alert("Por favor, completa los campos obligatorios: Nombre APP, Usuario y Contraseña.");
    return;
  }

  try {
    const masterKey = sessionStorage.getItem("userMasterKey");
    if (!masterKey) {
      throw new Error("No se encontró la llave maestra en la sesión.");
    }

    const encryptionKey = await getEncryptionKey(masterKey); // Obtener la clave de encriptación
    const { encrypted, iv } = await encryptPassword(appPassword, encryptionKey); // Encriptar la nueva contraseña

    const updatedAppData = {
      appName,
      appUrl: appUrl || null, // Permitir que URL esté vacía si no se actualiza
      appUser,
      appContra: encrypted,
      iv: bufferToHex(iv),
      comment: appComment || null, // Permitir que los comentarios estén vacíos si no se actualizan
    };

    // Actualizar el documento en Firestore
    const appDocRef = doc(db, "USUARIOS", authenticatedUser.uid, "APP", selectedAppId);
    await updateDoc(appDocRef, updatedAppData);

    alert("¡Aplicación actualizada con éxito!");
    window.location.href = "llavero.html"; // Redirigir al llavero después de la actualización

  } catch (error) {
    console.error("Error al actualizar los datos de la aplicación:", error);
    alert("No se pudo guardar los cambios. Intenta de nuevo.");
  }
}

// -------------------CIFRAR CONTRASEÑA-------------------
async function encryptPassword(password, encryptionKey) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const iv = crypto.getRandomValues(new Uint8Array(12)); // Generar un IV único
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv, // Vector de inicialización
    },
    encryptionKey,
    passwordBuffer
  );

  return {
    encrypted: bufferToHex(encryptedBuffer),
    iv: iv,
  };
}

// -------------------UTILIDAD PARA CONVERTIR BUFFER A HEX-------------------
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}


// ------------------------FUNCION PORTAPAPELES----------------------------
document.addEventListener("DOMContentLoaded", () => {
  // Función genérica para copiar contenido al portapapeles
  function copiarAlPortapapeles(inputId) {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.error(`Elemento con ID ${inputId} no encontrado.`);
      return;
    }

    // Seleccionar el texto del input y copiarlo al portapapeles
    inputElement.select();
    inputElement.setSelectionRange(0, 99999); // Para dispositivos móviles

    try {
      document.execCommand("copy");
      alert(`¡Copiado al portapapeles!`);
    } catch (error) {
      console.error("Error al copiar al portapapeles:", error);
      alert("No se pudo copiar al portapapeles.");
    }
  }

  // Eventos para los botones de copia
  document.getElementById("copyUrl")?.addEventListener("click", () => copiarAlPortapapeles("app-URL"));
  document.getElementById("copyUser")?.addEventListener("click", () => copiarAlPortapapeles("user"));
  document.getElementById("copyPassword")?.addEventListener("click", () => copiarAlPortapapeles("password"));
});