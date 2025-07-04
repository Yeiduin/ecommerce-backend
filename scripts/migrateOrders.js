// ecommerce-backend/scripts/migrateOrders.js
import "dotenv/config";
import connectDB from "../database/db.js";
import Order from "../models/Order.model.js";
import Counter from "../models/Counter.model.js";
import mongoose from "mongoose";

const migrateOrders = async () => {
  try {
    // 1. Conectar a la base de datos
    await connectDB();
    console.log("Conectado a la base de datos para la migración...");

    // 2. Encontrar todos los pedidos que NO tienen un "orderNumber"
    // Los ordenamos por fecha de creación para que los más antiguos tengan los primeros números.
    const oldOrders = await Order.find({
      orderNumber: { $exists: false },
    }).sort({ createdAt: 1 });

    if (oldOrders.length === 0) {
      console.log("¡No hay pedidos antiguos que migrar! Todo está al día.");
      return;
    }

    console.log(
      `Se encontraron ${oldOrders.length} pedidos para actualizar...`
    );

    // 3. Recorrer cada pedido antiguo y asignarle un nuevo número
    for (const order of oldOrders) {
      const nextNumber = await Counter.getNextSequence("orderNumber");
      order.orderNumber = nextNumber;
      await order.save();
      console.log(
        `Pedido con ID ${order._id} actualizado al número de pedido #${nextNumber}`
      );
    }

    console.log("¡Migración completada con éxito!");
  } catch (error) {
    console.error("Ocurrió un error durante la migración:", error);
  } finally {
    // 4. Desconectar de la base de datos
    await mongoose.disconnect();
    console.log("Desconectado de la base de datos.");
  }
};

// Ejecutamos la función
migrateOrders();
