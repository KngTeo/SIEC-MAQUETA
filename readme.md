📘 SIEC – Sistema de Inventario de Equipos de Computo
SIEC es una aplicación web desarrollada para gestionar de forma eficiente el inventario de equipos de cómputo, la asignación a empleados, el control de actas de entrega, mantenimientos preventivos y correctivos, así como el seguimiento a los usuarios del sistema.

📂 Estructura del Proyecto

/SIEC
│
├── index.html                  # Página principal (dashboard)
├── Equipos.html                # Registro de equipos
├── Empleados.html              # Registro de empleados
├── Usuarios.html               # Registro de usuarios (roles)
├── Login.html                  # Inicio de sesión
├── Informes.html               # Reportes del sistema
├── Cronogramas.html           # Cronograma de mantenimientos
│
├── js/
│   ├── equipos.js              # Lógica de CRUD para equipos
│   ├── empleados.js            # Lógica de CRUD para empleados
│   ├── usuarios.js             # Lógica de CRUD para usuarios
│   ├── asignaciones.js         # Lógica de asignar/desasignar equipos
│   └── dashboard.js            # Lógica del dashboard (conteos, gráficas)
│
├── css/
│   └── estilos.css             # Estilos personalizados (si aplica)
│
└── db/
    └── estructura.sql          # Script de creación de la base de datos

    ////////////////////////////////////////////////////////////////////////////

🚀 Características
📋 Registro, edición y eliminación de equipos y empleados

🔐 Sistema de login con autenticación por roles (Administrador, Técnico, Invitado)

💻 Panel de dashboard dinámico con conteo de registros y gráfico de estado

📦 Gestión de asignaciones y desasignaciones de equipos

🛠️ Programación de cronogramas de mantenimiento

🧾 Generación de informes

🌐 Interfaz amigable y responsive usando Bootstrap 4

🛠️ Tecnologías Utilizadas
Frontend: HTML5, CSS3, Bootstrap 4, JavaScript ES6

Backend: Node.js + Express (en desarrollo)

Base de Datos: MySQL o SQL Server

Otros: Chart.js para gráficas, LocalStorage para login temporal

////////////////////////////////////////////////////////////////////////////

🧑‍💻 Cómo Usar el Proyecto
Clonar el repositorio

bash
Copiar
Editar
git clone https://github.com/tu_usuario/siec.git
cd siec
Abrir en tu editor (Visual Studio Code recomendado)

Configurar conexión con la base de datos

Crea la base de datos desde el archivo /db/estructura.sql

Modifica la configuración en el archivo de backend (cuando esté listo)

Iniciar servidor backend (si aplica)

bash
Copiar
Editar
npm install
node index.js
Abrir Login.html en tu navegador

////////////////////////////////////////////////////////////////////////////

👤 Roles del Sistema
Rol	Acceso
Administrador	Total (incluye gestión de usuarios)
Técnico	Gestión de empleados, equipos, actas
Invitado	Solo visualización de informes

////////////////////////////////////////////////////////////////////////////

📌 Próximas Mejoras
Autenticación JWT

Reportes en PDF

Filtros avanzados por estado, fecha, empresa

Notificaciones por correo

////////////////////////////////////////////////////////////////////////////

👨‍💻 Autores
Mateo Ramírez Aicardy
Desarrollador en formación – Tecnólogo en Desarrollo de Software
GitHub: @KngTeo

Daniel Naranjo Yotagri
Desarrollador en formación – Tecnólogo en Desarrollo de Software
GitHub: @TheDoc15

Duber Emerson Taborda
Desarrollador en formación – Tecnólogo en Desarrollo de Software
GitHub: @Dubert11