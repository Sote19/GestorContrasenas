window.onload = function() {
    // Intentamos recuperar el usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user) {
      // Si el usuario está autenticado, mostramos su nombre
      document.getElementById("user-name").textContent = user.nombre || "Usuario";
  
    } else {
      // Si no hay usuario en localStorage, redirigimos a la página de inicio
      window.location.href = 'iniciosesion.html';
    }
  
    // Manejar el cierre de sesión
    document.getElementById('logout-button').addEventListener('click', () => {
      localStorage.removeItem('nombre');  // Eliminamos el usuario de localStorage
      window.location.href = 'index.html';  // Redirigimos a login.html
    });
  };