$("input[type='password'][data-eye]").each(function(i) {
    var $this = $(this);

    // Crear un contenedor para el campo de contraseña
    var container = $("<div/>", {
        style: 'position:relative;'
    }).insertAfter($this);

    // Mover el input al nuevo contenedor
    $this.appendTo(container).css({
        paddingRight: '60px' // Espacio para el ícono
    });

    // Añadir ícono de ojo
    var eyeIcon = $("<span/>", {
        style: 'cursor: pointer; position: absolute; right: 10px; top: 50%; transform: translateY(-50%);'
    }).html('<i class="fas fa-eye" id="eye-icon-' + i + '"></i>').appendTo(container);

    // Manejar el evento click en el ícono
    eyeIcon.on("click", function() {
        if ($this.hasClass("show")) {
            $this.attr('type', 'password').removeClass("show");
            $(this).find('i').removeClass("fa-eye-slash").addClass("fa-eye"); // Cambia a ojo abierto
        } else {
            $this.attr('type', 'text').addClass("show");
            $(this).find('i').removeClass("fa-eye").addClass("fa-eye-slash"); // Cambia a ojo cerrado
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
