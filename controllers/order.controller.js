// ecommerce-backend/controllers/order.controller.js
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";

export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "No hay artículos en el pedido." });
    } else {
      const order = new Order({
        user: req.user._id,
        orderItems: orderItems.map((item) => ({
          ...item,
          product: item._id,
          _id: undefined,
        })),
        shippingAddress,
        paymentMethod,
        totalPrice,
      });

      // Guardamos el pedido en la base de datos
      const createdOrder = await order.save();

      // ===== NUEVA LÓGICA DE ACTUALIZACIÓN DE STOCK =====
      // 2. Recorremos cada item del pedido recién creado
      for (const item of createdOrder.orderItems) {
        // Buscamos el producto correspondiente en la base de datos
        const product = await Product.findById(item.product);
        if (product) {
          // Restamos la cantidad comprada del stock actual
          product.stock = product.stock - item.quantity;
          // Guardamos el producto actualizado
          await product.save();
        }
      }

      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al crear pedido",
      error: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al obtener mis pedidos",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
    if (order) {
      if (
        req.user.role === "admin" ||
        order.user._id.toString() === req.user._id.toString()
      ) {
        res.status(200).json(order);
      } else {
        res
          .status(401)
          .json({ message: "No autorizado para ver este pedido." });
      }
    } else {
      res.status(404).json({ message: "Pedido no encontrado." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al obtener pedido por ID",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    // Usamos la versión más robusta, que primero se asegura de que el campo 'user' exista.
    const orders = await Order.find({ user: { $ne: null } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al obtener todos los pedidos",
      error: error.message,
    });
  }
};

export const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ message: "Pedido no encontrado" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al actualizar pedido",
      error: error.message,
    });
  }
};
