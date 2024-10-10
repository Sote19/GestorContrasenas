<h2>ASIX2_Gestor de Contraseñas</h2>

<h1>ASIX2_GTX<br>
Trabajo realizado por Gerard Soteras, Tim Kalugin y Xavi Conde </h1>
<hr>

<h2>Explicación de la idea del proyecto</h2>
<p>En este proyecto nos vamos a centrar en crear una aplicación web que funcione como un gestor de contraseñas. La idea es que esta web permita crear un usuario y que pueda añadir sus aplicaciones, webs, usuarios y contraseñas de forma fácil e intuitiva, pero siempre con seguridad. Nos vamos a enfocar principalmente en el back-end, pero también intentaremos que el front-end esté bien diseñado para que sea accesible para cualquier usuario.
Nuestro gestor podrá almacenar todas las contraseñas de forma cifrada, y estarán gestionadas por una contraseña maestra (masterkey).</p>
<p>La seguridad que vamos a implementar como desarrolladores incluye: contraseñas cifradas, una base de datos segura, y una masterkey con un cifrado más robusto.
Para los usuarios, la seguridad se basará en dos cosas: su contraseña de usuario y la masterkey.
Así, los usuarios podrán gestionar todas sus cuentas y contraseñas de manera centralizada, segura y sencilla.</p>

<h2>Objetivo que se persigue</h2>
<p>Nuestro objetivo es crear una aplicación web que gestione usuarios y contraseñas de manera cifrada. Además, tendremos una BBDD segura protegida por una única contraseña maestra que será enlazada a la app. Queremos facilitar la vida a los usuarios para que gasten el tiempo mínimo en buscar, añadir o manejar sus datos personales de autenticación.</p>

<h2>Organización y roles del equipo</h2>
<p>Al ser un grupo que en el primer año del grado ya trabajamos juntos en varios proyectos, la organización ha sido muy fácil.
Hemos decidido que todos haremos de todo, pero cada uno tendrá un rol de “líder” en cada apartado en el que hemos distribuido el proyecto, este líder será el encargado únicamente, de marcar el tempo y de comunicar al resto del grupo cómo vamos en relación con los objetivos y fechas acordados al inicio.
Al final de cada clase se pondrá en común el trabajo de cada integrante, con el objetivo de que todas las personas en todo momento sepan que se ha hecho ese día y si algún día hay una baja, que se pueda seguir trabajando con normalidad.</p>

<p>En el aspecto de las tareas, todos haremos todas las tareas, sin excepción.
<ul>
  <li>Xavi - Front-end y VMs</li>
  <li>Gerard - Back-end cifrado y presentaciones(PP, Genially…), escritos(GitHub)</li>
  <li>Tim - Back-end BBDD y gestores de tareas</li>
</ul>

> [!IMPORTANT]
> Los líderes informan del tiempo, no quiere decir que trabajen más en esas áreas que otro compañero.</p>

<h2>Tecnologías a utilizar (lenguajes, framework, sistemas, software...)</h2>
<p>
<ul>
  <li>Front-end: HTML, CSS con ayuda de Bootstrap.<br>
    Colores que usaremos en el front-end: #234C17 y #B5FFA6</li>
  <li>Back-end: Python, Java Script e intentaremos PHP.</li>
  <li>Base de Datos: Google Firebase.</li>
  <li>Cifrado: según vayamos avanzando con el proyecto elegiremos una de las 3 opciones: AES-256, bcrypt/Argon2, PBKDF2.</li>
  <li>Seguridad: TLS/SSL.</li>
  <li>Software: Visual Studio, Google Firebase, GitHub, Bootstrap, Node.JS, Cloudflare.</li>
</ul>

> [!NOTE]
> Esta lista puede aumentarse conforme vayamos avanzando con el proyecto y adquiriendo nuevos conocimientos.</p>

<h2>Arquitectura del sistema</h2> 
<p>Usaremos la arquitectura cliente-servidor de tres capas, la haremos en capas para así poder trabajar cada capa por separado y hacerlo de manera más sencilla y efectiva, para poder cumplir con los plazos de entrega.
<ul>Las tres capas se dividirán:
  <li>Cliente: Esta parte interactuará con el usuario, es decir, la mayoría del front-end estará en esta capa.</li>
  <li>Servidor: Manejará la parte lógica y la base de datos y se encargará del procesado de solicitudes. También se gestionará el cifrado y las contraseñas</li>
  <li>BBDD: Aquí se almacenarán los datos persistentes, como las contraseñas cifradas y las cuentas de usuario.</li>
</ul>
</p>

<h1>Estilo web</h1>
<h2>MockUp</h2>
<p>
Como se muestra en el mockup, nuestra web será sencilla. Cuando entremos a la web por primera vez, nos encontraremos con un panel sencillo que nos dará dos opciones, "Iniciar sesión" y "Registrarse".  
Cada opción nos mandará a la página correspondiente, cuyo diseño será parecido al ya visto, con la diferencia que los títulos referenciarán dónde nos encontramos.  
En la página de registrarse nos saldrá un pequeño "cuestionario" que nos solicitará correo electrónico, contraseña para entrar y nombre de usuario. Además, habrá un botón que permitirá ir a la página de iniciar sesión si ya tienes una cuenta registrada.  
En la página de iniciar sesión nos mostrará los espacios correspondientes para introducir el usuario y la contraseña previamente registrada en la web. También estará disponible la opción de "¿Has olvidado tu contraseña?", "¿No tienes cuenta? Regístrate ya", la casilla para activar si quieres recordar el dispositivo y un ojo que mostrará la contraseña, ya que cuando se escribe no se muestra.  

Una vez dentro, nos mostrará una ventana que pedirá registrar la llave maestra. Una vez configurada, el diseño de la web será simple. Se mostrarán las aplicaciones que hemos guardado en el gestor, con un botón que agregará una aplicación en la parte superior.  

A la hora de registrar una aplicación, se pedirá la URL del sitio web de la aplicación, el usuario y si se quiere generar una contraseña o poner una personal. También habrá un espacio para poner comentarios. Una vez configurado, se usará un botón con "Guardar" para finalizar la acción de agregar una aplicación.  

Una vez tengamos algunas aplicaciones registradas, seleccionando alguna de ellas accederemos a una ventana donde se mostrará la información previamente introducida para la aplicación correspondiente y dos botones: "Editar" y "Eliminar", además de una cruz en la parte superior por si queremos salir de la ventana, regresando a la vista general de la web.
</p>

<div align="center">
  <img src="assets_bf/MockUp.png" alt="MockUp" with="800">
</div>


<h2>Árbol Web</h2>

<div align="center">
  <img src="assets_bf/arbolweb.png" alt="ArbolWeb" with="800">
</div>

<h2>Colores </h2>
<p>Hemos optado por una paleta de colores en tonos verdes, que van desde un verde oscuro (#234C17) a un verde más claro (#B5FFA6). Estos colores están pensados para transmitir una sensación de seguridad, estabilidad y confianza, características fundamentales en un gestor de contraseñas. El verde también está asociado con zonas seguras y aprobadas, lo que refuerza la idea de que los usuarios estarán en un entorno protegido para almacenar su información sensible. Además, los colores blanco (#ffffff) y negro (#000000) se usan como base para asegurar legibilidad y simplicidad, sin distraer la atención de la funcionalidad principal de la plataforma.</p>

<div align="center">
  <img src="assets_bf/colores_principales.png" alt="Colores" with="800">
</div>

<h2>Logotipo</h2>
<p>El logotipo elegido es un escudo verde con una cerradura en el centro, lo que simboliza la protección de las contraseñas, que actúan como llaves para acceder a las diferentes cuentas de los usuarios. El escudo representa seguridad, confiabilidad y defensa, lo que refuerza el objetivo del gestor de contraseñas: proporcionar un entorno seguro para almacenar y gestionar de manera centralizada los datos de autenticación. El detalle del circuito en el fondo del escudo agrega un toque tecnológico, conectando el concepto de ciberseguridad con el propósito del proyecto.</p>

<div align="center">
  <img src="assets_bf/logo.svg" alt="Logo" with="100">
</div>

<h2>PROXMOX</h2>
<p>Para la creación de nuestro proyecto, vamos a usar Proxmox. Utilizaremos uno de los ordenadores disponibles en el aula para montar nuestro equipo PROXMOX, con el que trabajaremos para crear todos los servicios que necesitamos.</p>

<h3>Entorno ProxMox</h3>
<p>Dentro de Proxmox, configuraremos una red NAT para que todas las máquinas virtuales que creemos tengan conexión entre ellas.<br>
Como elementos principales, tendremos dos Ubuntu Servers. Uno de ellos hará de router virtual, proporcionando DHCP y actuando como servidor DNS. El otro será un equipo cliente. Una vez tengamos estas dos máquinas configuradas correctamente, procederemos a crear e integrar una máquina que funcionará como base de datos y otra que alojará nuestra página web.</p>

<p>Para crear la red NAT con la que se comunicarán las máquinas dentro de Proxmox, añadiremos un "Linux Bridge" y lo configuraremos para crear la red "interna", a la que llamaremos vmbr1. Por defecto, la red externa (en nuestro caso la del aula) se llama vmbr0.<br>
El proceso que seguimos fue el siguiente: primero, instalamos y configuramos la máquina router. Al añadir la máquina, le asignamos la nueva interfaz de red que creamos anteriormente en el apartado de hardware. Una vez configurado el router, duplicamos la máquina para crear el equipo cliente, y modificamos el netplan para que tenga su propia dirección IP dentro de la red interna.</p>

<p>Configuración del adaptador puente<img src="assets_bf/adaptador_puente_prox.png" alt="adaptador puente" with="100"></p>
<p>Configuración del hardware del cliente<img src="assets_bf/interfaz_red_router.png" alt="interfaz red router" with="100"></p>

<h3>Diagrama de Red</h3>
<div align="center">
  <img src="assets_bf/diagrama_red.png" alt="diagrama_red" with="100">

  |               | Proxmox              | VM Ubuntu Router       | VM Ubuntu Cliente     |
  |---------------|----------------------|------------------------|-----------------------|
  | **IP (estática)** | 100.77.20.113/24 | IP: 100.77.20.77/24    | IP: 10.20.30.5/24     |
  | **IP Gateway**    | 100.77.20.1      | 100.77.20.1            | 10.20.30.1            |
  | **Red**           | NAT              | vmbr0                  | vmbr1                 |
  |---------------|----------------------|------------------------|-----------------------|
  | **IP (estática)** | ---------------- | IP: 10.20.30.1/24      | ----------------      |
  | **IP Gateway**    | ---------------- | 100.77.20.1            | ----------------      |
  | **Red**           | ---------------- | vmbr1                  | ----------------      |
</div>

<h3>Configuración de red para el "ROUTER"</h3>
<p>Configuramos netplan para router con ens18(red exterior) ens19(red interna)</p>

<img src="assets_bf/netplan_router.png" alt="netplan de router" with="100">

<h3>Configuración de red para el "CLIENTE"</h3>
<p>Configuramos netplan para el cliente solo con ens19 con IP para dentro de la red</p>

<img src="assets_bf/netplan_cliente.png" alt="netplan de cliente" with="100">

<h3></h3>
