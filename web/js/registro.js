import { db, auth } from './firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";

// Manejador para mostrar/ocultar la contraseña
document.getElementById('toggle-password').addEventListener('click', function () {
    var passwordInput = document.getElementById('password');
    var icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text'; // Muestra la contraseña
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash'); // Cambia a ojo cerrado
    } else {
        passwordInput.type = 'password'; // Oculta la contraseña
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye'); // Cambia a ojo abierto
    }
});


// formulario de registro
const registro = document.getElementById("registroForm");
registro.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Obtener los datos del formulario
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validación simple
    if (nombre && email && password) {
        registrarUsuario(email, password, nombre); // Llamar la función para registrar al usuario
    } else {
        alert("Por favor, completa todos los campos.");
    }

    // Función para registrar al usuario
    async function registrarUsuario(email, password, nombre) {
        try {
            // Crear un nuevo usuario con el correo electrónico y la contraseña
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Configurar el displayName del usuario en Firebase Authentication
            await updateProfile(user, { displayName: nombre });

            // Guardar el nombre y correo del usuario en Firestore
            await setDoc(doc(db, "USUARIOS", user.uid), {
                nombre: nombre,
                email: email
            });

            // Alerta de éxito
            alert("¡Registro exitoso!");

            // Redirigir a la página de bienvenida
            window.location.href = "iniciosesion.html"; // Cambia esto si tienes otra página de bienvenida
        } catch (error) {
            // Manejo de errores
            console.error("Error al registrar el usuario:", error);
            alert("Error al registrar el usuario: " + error.message);
        }
    }
});
