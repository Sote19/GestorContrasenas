$(document).ready(function() {
    $("input[type='password'][data-eye]").each(function(i) {
        var $this = $(this);

        // Crear un contenedor para el campo de contraseña
        var container = $("<div/>", {
            class: 'password-container', // Usamos una clase para mantener el estilo limpio
            style: 'position:relative;'
        });

        // Mover el input al nuevo contenedor
        $this.wrap(container).css({
            paddingRight: '40px' // Espacio para el ícono
        });

        // Añadir ícono de ojo
        var eyeIcon = $("<span/>", {
            class: 'eye-icon', // Usamos una clase para personalización
            style: 'cursor: pointer; position: absolute; right: 10px; top: 50%; transform: translateY(-50%);'
        }).html('<i class="fas fa-eye"></i>'); // Ícono inicial

        // Añadir el ícono después del input
        $this.after(eyeIcon);

        // Manejar el evento click en el ícono
        eyeIcon.on("click", function() {
            if ($this.attr("type") === "password") {
                $this.attr("type", "text"); // Mostrar la contraseña
                $(this).html('<i class="fas fa-eye-slash"></i>'); // Cambiar ícono a ojo cerrado
            } else {
                $this.attr("type", "password"); // Ocultar la contraseña
                $(this).html('<i class="fas fa-eye"></i>'); // Cambiar ícono a ojo abierto
            }
        });
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
});
