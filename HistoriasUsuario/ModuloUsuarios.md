1. Como administrador quiero una vista que me permita visualizar, filtrar, registrar y editar usuarios con nombre, correo, rol y estado (activo/inactivo) para controlar quién accede al sistema.

Escenario 1: Registrar usuario

En caso que el administrador acceda al formulario de usuarios cuando ingrese los datos y presione guardar el sistema registra el nuevo usuario

Escenario 2: Editar usuario

En caso que exista un usuario registrado cuando el administrador modifique los datos el sistema actualiza la información del usuario

Escenario 3: Filtrar usuarios
En caso de búsqueda cuando se aplican filtros el sistema muestra resultados

2. Como usuario quiero un formulario para autenticarme mediante usuario y contraseña para acceder de forma segura a la plataforma.

Escenario 1: Inicio de sesión exitoso

En caso que el usuario se encuentre en la pantalla de inicio de sesión cuando ingrese credenciales correctas el sistema permite el acceso al sistema

Escenario 2: Credenciales incorrectas

En caso que el usuario intente iniciar sesión cuando ingrese credenciales incorrectas el sistema muestra un mensaje de error

Escenario 3: Validación de estado de usuario

En caso que el usuario tenga credenciales correctas pero su cuenta esté marcada como "Inactiva" o haya sido bloqueada por intentos fallidos cuando el usuario ingresa su usuario y contraseña correctos el sistema muestra un mensaje indicando "Su usuario está inactivo. Contacte al administrador" y no permite el acceso, aunque las credenciales sean válidas.

3. Como usuario quiero recuperar mi contraseña mediante un formulario donde ingrese mi correo electrónico registrado para que el sistema envíe un enlace con un token de recuperación que permita establecer una nueva contraseña de forma segura.

Escenario 1: Solicitud de recuperación exitosa

En caso que el usuario haya olvidado su contraseña cuando el usuario ingresa su correo electrónico registrado y solicita recuperar contraseña el sistema envía un correo con un enlace único (token) para restablecer la contraseña.

Escenario 2: Validación de correo inexistente

En caso que el usuario ingrese un correo que no está registrado en el sistema cuando el usuario ingresa un correo no registrado y solicita recuperar contraseña el sistema muestra un mensaje indicando que "Si el correo está registrado, recibirás un enlace de recuperación" (por seguridad, no debe confirmar si existe o no).

Escenario 3: Validación de token

En caso que el usuario intente usar un enlace de recuperación después de que haya expirado o que ya haya sido utilizado cuando el usuario hace clic en el enlace recibido por correo el sistema muestra un mensaje de error indicando que el enlace ha expirado o es inválido y ofrece la opción de solicitar uno nuevo.