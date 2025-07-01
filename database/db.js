// database/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(">>> Base de datos conectada correctamente <<<");
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error.message);
    // Salimos del proceso con error para que el servidor no se levante si la BD no funciona
    process.exit(1);
  }
};

export default connectDB;
