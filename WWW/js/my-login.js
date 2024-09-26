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

// Validación del formulario
$(".my-login-validation").submit(function(event) {
    var form = $(this);
    if (form[0].checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    form.addClass('was-validated');
});