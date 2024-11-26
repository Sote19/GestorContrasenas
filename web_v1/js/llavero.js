import { db, auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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


// ---------------------------------CARGAR APPS--------------------
async function cargarApps(uid) {
  const appList = document.getElementById("appList");
  
  // Verificar si el contenedor de las apps existe
  if (!appList) {
    console.error("No se encontró el elemento 'appList' en el DOM.");
    return;
  }

  try {
    const appsCollection = collection(db, "USUARIOS", uid, "APP");
    const querySnapshot = await getDocs(appsCollection);

    appList.innerHTML = ""; // Limpiar contenido previo

    if (querySnapshot.empty) {
      appList.innerHTML = `<p class="text-center text-muted">No tienes aplicaciones guardadas.</p>`;
      return;
    }

    querySnapshot.forEach((doc) => {
      const app = doc.data();
      app.id = doc.id; // Añadir manualmente el ID del documento al objeto app
      const appElement = crearAppElement(app);
      appList.appendChild(appElement);
    });
  } catch (error) {
    console.error("Error al cargar las aplicaciones:", error);
    alert("Ocurrió un error al cargar tus aplicaciones. Inténtalo más tarde.");
  }
}


// ---------------------------------CREAR ELEMENTO APP--------------------
function crearAppElement(app) {
  const template = document.getElementById("appTemplate")?.content.cloneNode(true);

  if (!template) {
    console.error("El template 'appTemplate' no fue encontrado en el DOM.");
    return;
  }

  const appTitle = template.querySelector(".app-title");
  const appUser = template.querySelector(".app-user");
  const appComment = template.querySelector(".app-comment");

  if (appTitle) appTitle.textContent = app.appName;
  if (appUser) appUser.textContent = `Usuario: ${app.appUser}`;
  if (appComment) appComment.textContent = app.comment || "Sin comentarios";

  const detailsButton = template.querySelector("button");
  if (detailsButton) {
    detailsButton.addEventListener("click", () => {
      // Guardamos el ID de la app seleccionada
      sessionStorage.setItem("selectedAppId", app.id);
      sessionStorage.setItem("userUid", sessionStorage.getItem("userUid")); // Confirmar que el UID del usuario también se guarda
      console.log("ID de la app seleccionada:", app.id); // Depuración
      window.location.href = "app.html";
    });
  } else {
    console.error("El botón para ver detalles no fue encontrado en el template.");
  }

  return template;
}


//--------------nuevapp.html
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

      // Obtener el usuario autenticado
      const currentUser = auth.currentUser;
      if (!currentUser) {
          alert("No se pudo identificar al usuario. Por favor, inicia sesión de nuevo.");
          return;
      }

      try {
          // Referencia a la subcolección APP del usuario actual
          const userAppCollection = collection(db, "USUARIOS", currentUser.uid, "APP");

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
document.getElementById('generate').addEventListener('click', generatePassword);

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