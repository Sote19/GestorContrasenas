import { db, auth } from './firebase.js';
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

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

      // Guardar UID y nombre en sessionStorage (opcional)
      const userName = user.displayName || "Usuario";
      sessionStorage.setItem("userName", userName);
      sessionStorage.setItem("userUid", user.uid);

      // Mostrar nombre del usuario en la interfaz
      const userNameElement = document.getElementById("user-name");
      if (userNameElement) {
        userNameElement.textContent = userName;
      } else {
        console.error("El elemento 'user-name' no fue encontrado en el DOM.");
      }

      // Cargar aplicaciones usando la variable global
      await cargarApps();
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


// ---------------------------------CARGAR APPS--------------------
async function cargarApps() {
  const appList = document.getElementById("appList");
  
  // Verificar si el contenedor de las apps existe
  if (!appList) {
    console.error("No se encontró el elemento 'appList' en el DOM.");
    return;
  }

  if (!authenticatedUser) {
    console.error("No hay un usuario autenticado.");
    return;
  }

  try {
    const appsCollection = collection(db, "USUARIOS", authenticatedUser.uid, "APP");
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
      console.log("ID de la app seleccionada:", app.id); // Depuración
      window.location.href = "app.html";
    });
  } else {
    console.error("El botón para ver detalles no fue encontrado en el template.");
  }

  return template;
}
