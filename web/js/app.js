// Función para cargar las apps desde localStorage
function loadApps() {
    const apps = JSON.parse(localStorage.getItem("apps")) || [];
    const appList = document.getElementById("appList");

    appList.innerHTML = ""; // Limpiar la lista antes de cargar

    apps.forEach((app, index) => {
        const appButton = document.createElement("div");
        appButton.className = "col-md-6";
        appButton.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <button class="btn btn-outline-secondary w-100 py-3 app-btn shadow-sm app">
                    <i class="bi bi-box"></i> ${app.appName} (Usuario: ${app.user})
                </button>
                <button class="btn btn-danger btn-sm ms-2" onclick="removeApp(${index})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        appList.appendChild(appButton);
    });
}

// Función para añadir una nueva app
function addApp(appName, user) {
    const apps = JSON.parse(localStorage.getItem("apps")) || [];
    apps.push({ appName, user });
    localStorage.setItem("apps", JSON.stringify(apps));
    loadApps(); // Recargar apps
}

// Función para eliminar una app
function removeApp(index) {
    const apps = JSON.parse(localStorage.getItem("apps")) || [];
    apps.splice(index, 1);
    localStorage.setItem("apps", JSON.stringify(apps));
    loadApps(); // Recargar apps
}

// Función para abrir un modal de añadir nueva app
function openAddAppModal() {
    const appName = prompt("Ingrese el nombre de la aplicación:");
    const user = prompt("Ingrese el nombre de usuario:");

    if (appName && user) {
        addApp(appName, user);
    } else {
        alert("Ambos campos son requeridos.");
    }
}

// Al cargar la página, cargar las apps
document.addEventListener("DOMContentLoaded", loadApps);

// Agregar evento al botón "Añadir APP"
document.getElementById("addAppBtn").addEventListener("click", openAddAppModal);
