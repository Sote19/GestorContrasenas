window.onload = function() {
    // Intentamos recuperar el usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user) {
      // Si el usuario está autenticado, mostramos su nombre
      const userName = user.displayName || "Usuario"; // Si no tiene nombre, mostramos "Usuario"
      document.getElementById('user-name').textContent = `${userName}`;
  
    } else {
      // Si no hay usuario en localStorage, redirigimos a la página de inicio
      window.location.href = 'iniciosesion.html';
    }
  
    // Manejar el cierre de sesión
    document.getElementById('logout-button').addEventListener('click', () => {
      localStorage.removeItem('user');  // Eliminamos el usuario de localStorage
      window.location.href = 'index.html';  // Redirigimos a login.html
    });
  };