// ecommerce-backend/scripts/addMissingStatus.js
import "dotenv/config";
import connectDB from "../database/db.js";
import Order from "../models/Order.model.js";
import mongoose from "mongoose";

const addMissingStatus = async () => {
  try {
    await connectDB();
    console.log("Conectado a la base de datos para actualizar estados...");

    // Buscamos todos los pedidos donde el campo "status" no exista.
    // Usamos el modelo de Mongoose que ya tiene el nuevo esquema con el campo 'status'.
    const result = await Order.updateMany(
      { status: { $exists: false } }, // El filtro: encuentra documentos sin el campo 'status'.
      { $set: { status: "En proceso" } } // La acción: establece el estado a 'En proceso'.
    );

    if (result.matchedCount === 0) {
      console.log("¡No se encontraron pedidos sin estado! Todo está al día.");
    } else {
      console.log(
        `¡Éxito! Se actualizaron ${result.modifiedCount} de ${result.matchedCount} pedidos encontrados.`
      );
    }
  } catch (error) {
    console.error(
      "Ocurrió un error durante la actualización de estados:",
      error
    );
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de la base de datos.");
  }
};

// Ejecutamos la función
addMissingStatus();
