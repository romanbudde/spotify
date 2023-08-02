Trackify.

Una aplicación inspirada en las plataformas Spotify y Soundcloud.

Pasos para poder levantar el proyecto localmente.

1. Clonar el proyecto.
2. Tener docker instalado.
3. Abrir una consola bash a nivel raíz del proyecto.
4. Correr el comando docker-compose build
5. Luego, docker-compose up
6. En el archivo client/.env.prod verificar que REACT_APP_SERVER tenga el valor 'http://localhost:5000/'
7. En el archivo db.js están definidas las credenciales para conectar a la base de datos.

En localhost:3000 estará ubicado el frontend (puerto cambiable desde el archivo docker-compose.yml).
En localhost:5000 se encontrará el servidor.
En localhost:8080 se podrá ingresar al panel de base de datos.

