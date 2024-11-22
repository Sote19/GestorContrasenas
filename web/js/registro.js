import { db, auth } from './firebase.js';
import { createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-auth.js";
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-firestore.js";


// --------------------FUNCION OJOS REGISTRO--------------------------------
function togglePasswordVisibility(toggleId, inputId) {
    document.getElementById(toggleId).addEventListener('click', function () {
        var passwordInput = document.getElementById(inputId);
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
}

togglePasswordVisibility('toggle-password', 'password');
togglePasswordVisibility('toggle-confirmPassword', 'confirmPassword');
togglePasswordVisibility('toggle-masterKey', 'masterKey');
togglePasswordVisibility('toggle-confirmMasterKey', 'confirmMasterKey');


// --------------------FORMULARIO REGISTRO--------------------------------
const registro = document.getElementById("registroForm");
registro.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Obtener los elementos de los campos del formulario
    const nombreInput = document.getElementById("nombre");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const masterKeyInput = document.getElementById("masterKey");
    const confirmMasterKeyInput = document.getElementById("confirmMasterKey");

    // Limpiar las clases de validación anteriores
    [nombreInput, emailInput, passwordInput, confirmPasswordInput, masterKeyInput, confirmMasterKeyInput].forEach(input => {
        input.classList.remove("is-invalid");
    });

    // Validaciones
    let isValid = true;

    // Validar nombre
    if (!nombreInput.value.trim()) {
        nombreInput.classList.add("is-invalid");
        isValid = false;
    }

    // Validar email
    if (!emailInput.value.includes("@")) {
        emailInput.classList.add("is-invalid");
        isValid = false;
    }

    // Validar contraseña y confirmación
    if (passwordInput.value.length < 16) {
        passwordInput.classList.add("is-invalid");
        isValid = false;
    }
    if (passwordInput.value !== confirmPasswordInput.value) {
        confirmPasswordInput.classList.add("is-invalid");
        isValid = false;
    }

    // Validar llave maestra y confirmación
    if (masterKeyInput.value.length < 18) {
        masterKeyInput.classList.add("is-invalid");
        isValid = false;
    }
    if (masterKeyInput.value !== confirmMasterKeyInput.value) {
        confirmMasterKeyInput.classList.add("is-invalid");
        isValid = false;
    }

    // Si pasa todas las validaciones, registrar el usuario
    if (isValid) {
        registrarUsuario(
            emailInput.value,
            passwordInput.value,
            nombreInput.value,
            masterKeyInput.value
        );
    }
});


// --------------------FUNCIÓN PARA REGISTRAR USUARIO--------------------------------
async function registrarUsuario(email, password, nombre, masterKey) {
    try {
        // Crear un nuevo usuario con el correo electrónico y la contraseña
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Configurar el displayName del usuario en Firebase Authentication
        await updateProfile(user, { displayName: nombre });

        const { hash: masterKeyHash, salt } = await hashPassword(masterKey);
        // Guardar el nombre, correo y llave maestra cifrada del usuario en Firestore
        await setDoc(doc(db, "USUARIOS", user.uid), {
            nombre: nombre,
            email: email,
            masterKey: masterKeyHash, // Llave cifrada
            salt: salt 
        });

        // Alerta de éxito
        alert("¡Registro exitoso!");

        // Redirigir a la página de inicio de sesión
        window.location.href = "iniciosesion.html";
    } catch (error) {
        // Manejo de errores
        console.error("Error al registrar el usuario");
        alert("Error al registrar el usuario");
    }
}

// --------------------FUNCIÓN PARA CIFRAR LA LLAVE MAESTRA--------------------------------
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(16)); // Genera un salt aleatorio

    // Importa la clave de la contraseña
    const passwordKey = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    // Deriva la clave usando PBKDF2
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

    // Exporta la clave derivada en formato raw
    const hashBuffer = await crypto.subtle.exportKey("raw", key);

    return {
        hash: bufferToHex(hashBuffer),
        salt: bufferToHex(salt)
    };
}

// Convierte un ArrayBuffer a una cadena hexadecimal
function bufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}
