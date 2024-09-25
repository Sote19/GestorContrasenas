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
¡RECORDAR! Los líderes informan del tiempo, no quiere decir que trabajen más en esas áreas que otro compañero.</p>

<h2>Tecnologías a utilizar (lenguajes, framework, sistemas, software...)</h2>
<ul>
  <li>Front-end: HTML, CSS, JavaScript con ayuda de Bootstrap.
    <br>Colores que usaremos en el front-end: #234C17 y #B5FFA6
  </li>
  <li>Back-end: Python e intentaremos PHP.</li>
  <li>Base de Datos: Intentaremos aprender y usar MongoDB, pero la 2a opción será el conocido MySQL.</li>
  <li>Cifrado: según vayamos avanzando con el proyecto elegiremos una de las 3 opciones: AES-256, bcrypt/Argon2, PBKDF2.</li>
  <li>Seguridad: TLS/SSL.</li>
  <li>Software: Visual Studio, MySQL Workbench, MongoDB, MySQL, GitHub, Bootstrap, Node.JS, Cloudflare. (esta lista puede aumentarse conforme vayamos avanzando con el proyecto y adquiriendo nuevos conocimientos).</li>
</ul>

<h2>Arquitectura del sistema</h2> 
<p>Usaremos la arquitectura cliente-servidor de tres capas, la haremos en capas para así poder trabajar cada capa por separado y hacerlo de manera más sencilla y efectiva, para poder cumplir con los plazos de entrega.
<ul>Las tres capas se dividirán:
  <li>Cliente: Esta parte interactuará con el usuario, es decir, la mayoría del front-end estará en esta capa.</li>
  <li>Servidor: Manejará la parte lógica y la base de datos y se encargará del procesado de solicitudes. También se gestionará el cifrado y las contraseñas</li>
  <li>BBDD: Aquí se almacenarán los datos persistentes, como las contraseñas cifradas y las cuentas de usuario.</li>
</ul>
</p>
