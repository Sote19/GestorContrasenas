// Redirigir al hacer clic en "Guardar"
document.getElementById("saveBtn").addEventListener("click", function() {
    // Aquí puedes agregar lógica para guardar datos antes de redirigir
    window.location.href = "inicio1.html";  // Redirigir a inicio1.html
});

// Función para mostrar u ocultar la contraseña
function togglePasswordVisibility() {
    const passwordField = document.getElementById("passwordField");
    const passwordToggle = document.getElementById("passwordToggle");

    if (passwordField.type === "password") {
        passwordField.type = "text";
        passwordToggle.innerHTML = '<i class="bi bi-eye-slash"></i>';  // Cambia el icono a "ojo cerrado"
    } else {
        passwordField.type = "password";
        passwordToggle.innerHTML = '<i class="bi bi-eye"></i>';  // Cambia el icono a "ojo abierto"
    }
}

// Asignar el evento al botón de mostrar/ocultar contraseña
document.getElementById("passwordToggle").addEventListener("click", togglePasswordVisibility);

