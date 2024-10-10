document.addEventListener("DOMContentLoaded", () => {
    const togglePassword = document.querySelector("#togglePassword");
    const passwordInput = document.querySelector("#password");

    togglePassword.addEventListener("click", function () {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        this.textContent = type === "password" ? "👁️" : "🙈";
    });

    const saveBtn = document.getElementById("saveBtn");
    const urlApp = document.getElementById("urlApp");
    const user = document.getElementById("user");
    const comment = document.getElementById("comment");

    saveBtn.addEventListener("click", (event) => {
        event.preventDefault(); // Evita el envío del formulario

        const appName = urlApp.value.trim();
        const userValue = user.value.trim();
        const passwordValue = passwordInput.value.trim();
        const commentValue = comment.value.trim();

        // Validar que los campos no estén vacíos
        if (!appName || !userValue || !passwordValue) {
            alert("Por favor, completa todos los campos.");
            return; // No hacer nada si los campos están vacíos
        }

        // Almacenar la nueva app en el localStorage
        let apps = JSON.parse(localStorage.getItem("apps")) || [];
        apps.push({ appName, user: userValue, password: passwordValue, comment: commentValue });
        localStorage.setItem("apps", JSON.stringify(apps));

        // Redirigir a la página de gestor de contraseñas
        window.location.href = "inicio1.html"; // Redirige a la página
    });
});
