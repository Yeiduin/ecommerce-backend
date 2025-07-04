// ecommerce-backend/scripts/addMissingShippingFields.js
import "dotenv/config";
import connectDB from "../database/db.js";
import Order from "../models/Order.model.js";
import mongoose from "mongoose";

// --- LA LÍNEA QUE FALTA ---
// Importamos el modelo User para que Mongoose lo reconozca.
import User from "../models/User.model.js";

const addMissingShippingFields = async () => {
  try {
    await connectDB();
    console.log("Conectado a la BD para añadir campos de envío faltantes...");

    // 1. Encuentra todos los pedidos donde no exista el campo "fullName" en shippingAddress.
    //    Ahora el .populate('user') funcionará correctamente.
    const ordersToUpdate = await Order.find({
      "shippingAddress.fullName": { $exists: false },
    }).populate("user", "name");

    if (ordersToUpdate.length === 0) {
      console.log(
        "¡No se encontraron pedidos para actualizar! Todo está al día."
      );
      return;
    }

    console.log(
      `Se encontraron ${ordersToUpdate.length} pedidos para actualizar...`
    );
    let updatedCount = 0;

    // 2. Recorre cada pedido y añade los campos faltantes.
    for (const order of ordersToUpdate) {
      if (order.user) {
        order.shippingAddress.fullName = order.user.name;
        order.shippingAddress.phone = "0000000000";

        await order.save();
        updatedCount++;
        console.log(`Pedido #${order.orderNumber} actualizado.`);
      }
    }

    console.log(
      `¡Migración completada! Se actualizaron ${updatedCount} pedidos.`
    );
  } catch (error) {
    console.error(
      "Ocurrió un error durante la migración de datos de envío:",
      error
    );
  } finally {
    await mongoose.disconnect();
    console.log("Desconectado de la base de datos.");
  }
};

addMissingShippingFields();
