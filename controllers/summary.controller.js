// ecommerce-backend/controllers/summary.controller.js
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";

// @desc    Obtener un resumen de las estadísticas de la tienda (solo admin)
// @route   GET /api/summary
export const getSummary = async (req, res) => {
  try {
    // Usamos Promise.all para ejecutar todas las consultas en paralelo para máxima eficiencia
    const [
      ordersCount,
      usersCount,
      productsCount,
      totalSalesData,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      User.countDocuments(),
      Product.countDocuments(),
      // Canalización de Agregación para sumar el precio total de todos los pedidos
      Order.aggregate([
        {
          $group: {
            _id: null, // Agrupamos todos los documentos en uno solo
            totalSales: { $sum: "$totalPrice" }, // Sumamos el campo totalPrice de cada documento
          },
        },
      ]),
      // Obtenemos los 5 pedidos más recientes
      Order.find().sort({ createdAt: -1 }).limit(5).populate("user", "name"),
    ]);

    // La agregación devuelve un array, así que tomamos el primer elemento
    const totalSales =
      totalSalesData.length > 0 ? totalSalesData[0].totalSales : 0;

    // Enviamos todo en un solo objeto JSON
    res.status(200).json({
      ordersCount,
      usersCount,
      productsCount,
      totalSales,
      recentOrders,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
