// ecommerce-backend/controllers/summary.controller.js
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Ticket from "../models/Ticket.model.js";

export const getSummary = async (req, res) => {
  try {
    // 1. Obtener todos los datos necesarios en paralelo
    const [products, users, orders, tickets] = await Promise.all([
      Product.find(),
      User.find(),
      Order.find(),
      Ticket.find(),
    ]);

    // 2. Calcular el total de ingresos (solo de pedidos 'Entregado')
    const totalRevenue = orders.reduce((acc, order) => {
      if (order.status === "Entregado") {
        return acc + order.totalPrice;
      }
      return acc;
    }, 0);

    // 3. Contar pedidos por estado
    const initialOrderCounts = {
      Pendiente: 0,
      Enviado: 0,
      Entregado: 0,
      Cancelado: 0,
    };
    const orderStatusCounts = orders.reduce((acc, order) => {
      if (acc[order.status] !== undefined) {
        acc[order.status]++;
      }
      return acc;
    }, initialOrderCounts);

    // El total de pedidos "activos" (no cancelados) para la tarjeta principal
    const totalActiveOrders = orders.filter(
      (o) => o.status !== "Cancelado"
    ).length;

    // 4. Contar tickets por estado
    const initialTicketCounts = {
      Abierto: 0,
      "En proceso": 0,
      Cerrado: 0,
    };
    const ticketStatusCounts = tickets.reduce((acc, ticket) => {
      if (acc[ticket.status] !== undefined) {
        acc[ticket.status]++;
      }
      return acc;
    }, initialTicketCounts);

    // 5. Enviar el objeto de resumen completo
    res.status(200).json({
      totalProducts: products.length,
      totalUsers: users.length,
      totalOrders: orders.length, // Total histórico de pedidos
      totalActiveOrders, // Total sin contar cancelados
      totalRevenue,
      orderStatusCounts,
      totalTickets: tickets.length,
      ticketStatusCounts,
    });
  } catch (error) {
    console.error("Error al generar el resumen:", error);
    res
      .status(500)
      .json({ message: "Error al obtener el resumen del sistema" });
  }
};
