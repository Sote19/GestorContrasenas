// register.js

import { registerUser } from './firebase.js'; // Asegúrate de que la ruta sea correcta

// Configura el manejador del formulario
export function setupFormHandler(formId) {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Previene el comportamiento predeterminado
            const name = document.getElementById('name').value; // Obtiene el valor del nombre
            const email = document.getElementById('email').value; // Obtiene el valor del correo
            const password = document.getElementById('password').value; // Obtiene el valor de la contraseña
            
            // Llama a la función para registrar el usuario
            await registerUser(name, email, password);
            form.reset(); // Reinicia el formulario
        });
    }
}
