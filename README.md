# BestDeal - Servidor Backend

Este es el servidor backend para la aplicación de e-commerce **BestDeal**. Ha sido construido con Node.js y Express, y utiliza MongoDB como base de datos a través de Mongoose. Provee una API RESTful completa y segura para ser consumida por el cliente frontend.

## Características Principales

- **API RESTful Completa:** Endpoints para gestionar Productos, Categorías, Usuarios y Pedidos.
- **Autenticación y Autorización:** Sistema seguro basado en JSON Web Tokens (JWT). Las contraseñas se almacenan encriptadas usando `bcryptjs`.
- **Roles de Usuario:** Diferenciación entre usuarios normales y administradores, con rutas protegidas para cada rol.
- **Gestión de Productos:** CRUD completo (Crear, Leer, Actualizar, Borrar) para productos, accesible solo para administradores.
- **Lógica de Negocio Avanzada:**
  - Búsqueda, filtrado (por categoría, marca) y ordenamiento (por precio, alfabético) de productos.
  - Control de inventario con reducción automática de stock al crear un pedido.
  - Gestión de categorías y marcas.
- **Gestión de Pedidos:** Creación de pedidos para usuarios y gestión completa (ver todos, marcar como entregado) para administradores.
- **Subida de Imágenes Segura:** Endpoint para generar firmas y autorizar subidas de archivos directamente a Cloudinary desde el cliente.

## Tecnologías Utilizadas

- **Node.js**
- **Express.js**
- **MongoDB** (Base de Datos NoSQL)
- **Mongoose** (ODM para MongoDB)
- **JSON Web Tokens (JWT)** (Para autenticación)
- **Bcrypt.js** (Para encriptación de contraseñas)
- **Cloudinary** (Para almacenamiento de imágenes)
- **CORS**

## Instalación y Ejecución Local

Sigue estos pasos para correr el servidor en tu máquina local.

1.  **Clonar el repositorio:**

    ```bash
    git clone [URL_DE_TU_REPOSITORIO]
    ```

2.  **Navegar a la carpeta del proyecto:**

    ```bash
    cd ecommerce-backend
    ```

3.  **Instalar dependencias:**

    ```bash
    npm install
    ```

4.  **Crear el archivo de variables de entorno:**

    - Crea un archivo llamado `.env` en la raíz del proyecto.
    - Copia el contenido de `.env.example` (si lo tienes) o añade las siguientes variables:

    ```
    MONGO_URI=tu_string_de_conexion_a_mongodb
    JWT_SECRET=tu_secreto_para_jwt_muy_largo_y_seguro
    CLOUDINARY_CLOUD_NAME=tu_cloud_name
    CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
    ```

5.  **Iniciar el servidor:**
    El servidor se ejecutará en modo de desarrollo con `nodemon`, reiniciándose automáticamente con cada cambio.
    ```bash
    npm run dev
    ```
    El servidor estará disponible en `http://localhost:4000`.
