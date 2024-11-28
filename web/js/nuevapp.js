import { db, auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Variable global para almacenar el usuario autenticado
let authenticatedUser = null;

// ---------------------VERIFICACIÓN DE USUARIO EN LLAVERO---------------------
window.onload = function() {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = 'iniciosesion.html';
    } else {
      authenticatedUser = user;
      const userName = user.displayName || "Usuario";
      sessionStorage.setItem("userName", userName);
      sessionStorage.setItem("userUid", user.uid);

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
    await signOut(auth);
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

  togglePassword?.addEventListener("click", function () {
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.textContent = type === "password" ? "👁️" : "🙈";
  });

  const saveBtn = document.getElementById("saveBtn");

  saveBtn?.addEventListener("click", async (event) => {
    event.preventDefault();

    const appName = document.getElementById("nombreApp")?.value.trim();
    const urlValue = document.getElementById("urlApp")?.value.trim();
    const userValue = document.getElementById("user")?.value.trim();
    const passwordValue = passwordInput?.value.trim();
    const commentValue = document.getElementById("comment")?.value.trim();

    if (!appName || !userValue || !passwordValue) {
      alert("Por favor, completa los campos obligatorios: Nombre de la aplicación, Usuario y Contraseña.");
      return;
    }

    if (!authenticatedUser) {
      alert("No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.");
      return;
    }

    try {
      const encryptionKey = await getEncryptionKey();
      const { encrypted, iv } = await encryptPassword(passwordValue, encryptionKey);

      const appData = {
        appName,
        appUrl: urlValue || null,
        appUser: userValue,
        appContra: encrypted,
        iv: bufferToHex(iv),
        comment: commentValue || null,
      };

      await addDoc(collection(db, "USUARIOS", authenticatedUser.uid, "APP"), appData);
      alert("¡Aplicación guardada con éxito!");
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
  const length = 16;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?¿~';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }

  document.getElementById('password').value = password;
}

// --------------------FUNCIÓN PARA CIFRAR LA CONTRASEÑA--------------------------------
async function encryptPassword(password, encryptionKey) {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));  // Vector de inicialización de 12 bytes
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    encryptionKey,  // Usar la clave derivada para cifrar
    encoder.encode(password)
  );
  return { encrypted: bufferToHex(encryptedContent), iv };
}


// --------------------UTILIDAD PARA CONVERTIR BUFFER A HEX--------------------------------
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// --------------------FUNCIÓN PARA OBTENER CLAVE DE CIFRADO--------------------------------
async function getEncryptionKey() {
  const masterKey = sessionStorage.getItem("userMasterKey");
  if (!masterKey) {
    throw new Error("No se encontró la llave maestra.");
  }

  // Convertir la llave maestra a bytes
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(masterKey);

  // Derivar la clave usando PBKDF2
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
      salt: new TextEncoder().encode("fixed-salt"),  // Usar un salt constante
      iterations: 100000,
      hash: "SHA-256"
    },
    derivedKey,
    { name: "AES-GCM", length: 256 },  // Derivar una clave AES de 256 bits
    false, 
    ["encrypt", "decrypt"]
  );
}
