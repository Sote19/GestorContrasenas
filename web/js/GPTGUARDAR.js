document.getElementById("addAppBtn").addEventListener("click", function() {
    // Solicitar al usuario el nombre de la nueva app
    let appName = prompt("Ingrese el nombre de la nueva aplicación:");

    // Verificar que el usuario haya ingresado un nombre válido
    if (appName && appName.trim() !== "") {
        // Crear un nuevo div (columna) para la app
        let appList = document.getElementById("appList");
        let newApp = document.createElement("div");
        newApp.className = "col-md-6";  // Para que ocupe 6 columnas de ancho en pantallas medianas

        // Crear un botón con el nombre de la app
        newApp.innerHTML = `
            <button class="btn btn-outline-secondary w-100 py-3 app-btn shadow-sm">
                <i class="bi bi-box"></i> ${appName}
            </button>
        `;

        // Agregar la nueva app a la lista
        appList.appendChild(newApp);
    } else {
        alert("Debe ingresar un nombre válido para la aplicación.");
    }
});
