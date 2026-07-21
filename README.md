Iron Play · Proyecto Final
Descripción
Iron Play es una tienda deportiva con un dashboard de administración que muestra indicadores clave de negocio (KPI) obtenidos a partir de archivos JSON que simulan el inventario, los productos y las ventas. El proyecto fue desarrollado como parte de un ejercicio integral de desarrollo web, aplicando buenas prácticas de programación, diseño responsivo y arquitectura modular.

Funcionalidades principales
Página principal (index.html): catálogo de productos con filtrado por categoría, diseñada con un estilo moderno (glassmorphism y gradientes).

Login (login.html): autenticación mediante un usuario ficticio almacenado en localStorage.

Dashboard (admin.html): panel de administración con:

KPIs (total de productos, ventas realizadas, ingresos totales, productos con stock bajo).

Gráficos de barras horizontales (ingresos por categoría y ventas de los últimos 7 días).

Tablas de productos con stock bajo y últimas ventas.

Email Marketing: botón en el dashboard que abre un modal para enviar un correo (simulado) y genera un archivo HTML con la plantilla del email en la carpeta data-commerce/emails/.

Participantes
Carlos Said – Desarrollo de la página principal (index.html), la estructura y estilos globales, el componente de filtrado de productos y la integración con los datos de productos.

Hamilton Quiroga – Creación y estructuración de los archivos JSON (productos.json, ventas.json, inventario.json), asegurando la coherencia de los datos y su correcta relación entre sí.

Exneider Nava - Supervisor del proyecto.

Asistencia de IA – Durante todo el proceso se utilizaron prompts estratégicos para generar y refinar el código, resolver problemas de lógica, optimizar el rendimiento y mantener la consistencia visual. La IA actuó como apoyo en la generación de componentes, la lógica de procesamiento de datos y la implementación del backend para email marketing.

Tecnologías utilizadas
Frontend: HTML5, CSS3 (vanilla, con variables y diseño móvil primero), JavaScript (ES6+).

Backend (email marketing): Python 3 con Flask y Flask-CORS.

Almacenamiento local: localStorage para la autenticación.

Datos: archivos JSON estáticos.

Requisitos previos
Navegador web moderno (Chrome, Edge, Firefox, etc.).

Servidor web para servir los archivos estáticos (por ejemplo, Apache, Live Server de VS Code, o cualquier servidor HTTP).

Python 3.6 o superior instalado (para el backend de email marketing).

Instalación y ejecución
1. Clonar o descargar el proyecto
Coloca todos los archivos del proyecto en la carpeta raíz de tu servidor web (por ejemplo, C:\Apache24\htdocs\ si usas Apache, o la carpeta que uses para tu servidor local).

2. Configurar el frontend
Asegúrate de que la estructura de carpetas sea la siguiente:

```bash
text
/
├── index.html
├── login.html
├── admin.html
├── css/
│   ├── styles.css
│   ├── login.css
│   └── admin.css
├── js/
│   ├── app.js
│   ├── login.js
│   ├── admin.js
│   └── components.js
├── data/
│   ├── productos.json
│   ├── ventas.json
│   └── inventario.json
├── emails/         (se crea automáticamente al enviar el primer email)
│  
└── server.py              (backend para email marketing)
```
Abre tu navegador y accede a http://localhost/ (o la URL donde esté servido el proyecto). La página principal (index.html) se cargará.

3. Ejecutar el backend (email marketing)
El backend es necesario para que la funcionalidad de "Email Marketing" pueda generar los archivos HTML en la carpeta data-commerce/emails/.

Instalar dependencias
Desde la terminal, navega hasta la carpeta raíz del proyecto y ejecuta:

bash
pip install flask flask-cors
Iniciar el servidor
bash
python server.py
Verás un mensaje similar a:

text
🚀 Servidor de marketing iniciado en http://localhost:5000
📁 Los correos se guardarán en data-commerce/emails/
Deja el servidor corriendo mientras uses el dashboard.

4. Acceder al dashboard
Desde la página principal, haz clic en el botón "Admin" (esquina superior derecha).

Serás redirigido a login.html.

Usa las credenciales predeterminadas:

Usuario: admin

Contraseña: 1234
(Puedes crear el usuario predeterminado haciendo clic en "Crear usuario predeterminado" si no existe).

Una vez autenticado, accederás al dashboard (admin.html), donde verás todos los KPIs y gráficos.

5. Uso de la función de Email Marketing
En el dashboard, haz clic en el botón "📧 Marketing" (junto a "Cerrar sesión").

Se abrirá un modal con un formulario:

Nombre del destinatario: se usará para nombrar el archivo generado.

Correo(s) electrónico(s): puedes ingresar uno o varios (separados por comas).

Al hacer clic en "Enviar correo", el frontend enviará una petición al backend (Flask) en http://localhost:5000/send-email.

El backend generará un archivo HTML en data-commerce/emails/ con la plantilla del correo y el nombre correo-para-Nombre.html (donde "Nombre" es el valor ingresado).

En el modal aparecerá un mensaje de éxito y se mostrará la ruta del archivo creado.

Estructura del proyecto y decisiones técnicas
Componentes web: IronHeader e IronFooter se implementaron como Web Components para reutilizar el encabezado y pie de página en toda la aplicación.

Manejo de datos: Se cargan tres archivos JSON de forma asíncrona y se procesan para generar las métricas del dashboard.

Diseño responsivo: Se utilizó un enfoque mobile-first con grid y flexbox para adaptarse a todos los tamaños de pantalla.

Seguridad: La autenticación es básica y se mantiene en localStorage. En un entorno real, se recomienda usar un backend con sesiones o JWT.

Posibles mejoras futuras
Migrar la autenticación a un sistema real con base de datos.

Conectar los datos del inventario y ventas a una base de datos en lugar de archivos JSON estáticos.

Implementar envío real de correos electrónicos utilizando SMTP o servicios como SendGrid.

Agregar más gráficos interactivos (por ejemplo, con Chart.js o D3.js).

Licencia
Este proyecto fue desarrollado con fines educativos. Queda prohibida su reproducción con fines comerciales sin autorización expresa de los autores.

¡Gracias por visitar Iron Play!
Equipo de desarrollo: Carlos Said, Hamilton Quiroga y el apoyo de IA generativa.
