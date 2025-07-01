import "dotenv/config"; // ¡Importante! Carga las variables de entorno
import express from "express";
import cors from "cors"; // 1. Importa cors
import connectDB from "./database/db.js"; // Importamos la función de conexión
import productRoutes from "./routes/products.routes.js";
import userRoutes from "./routes/user.routes.js"; // 1. Importa las rutas de usuario
import categoryRoutes from "./routes/category.routes.js";
import orderRoutes from "./routes/order.routes.js";
import summaryRoutes from "./routes/summary.routes.js";

// Conectamos a la base de datos
connectDB();

// Creamos una instancia de express
const app = express();

app.use(cors()); // 2. Usa el middleware de cors
app.use(express.json());

// Definimos un "puerto" donde nuestro servidor escuchará peticiones
const PORT = 4000;

// Definimos una ruta de prueba
// Cuando alguien haga una petición GET a la raíz ('/'), responderemos
app.use("/api/products", productRoutes); // rutas de los productos
app.use("/api/users", userRoutes); // 2. Usa las rutas de usuario
app.use("/api/categories", categoryRoutes); // rutas para las categorias de productos
app.use("/api/orders", orderRoutes);
app.use("/api/summary", summaryRoutes);

// Le decimos al servidor que empiece a escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
