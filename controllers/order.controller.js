// ecommerce-backend/controllers/order.controller.js
import Order from "../models/Order.model.js";
import User from "../models/User.model.js";
import Product from "../models/Product.model.js";
import Counter from "../models/Counter.model.js";

// @desc    Crear un nuevo pedido
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, totalPrice } = req.body;
    if (!orderItems || orderItems.length === 0) {
      return res
        .status(400)
        .json({ message: "No hay artículos en el pedido." });
    }

    const orderNumber = await Counter.getNextSequence("orderNumber");

    const order = new Order({
      user: req.user._id,
      orderNumber,
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id,
        _id: undefined,
      })),
      shippingAddress,
      paymentMethod,
      totalPrice,
    });

    const createdOrder = await order.save();

    for (const item of createdOrder.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock -= item.quantity;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({
      message: "Error en el servidor al crear pedido",
      error: error.message,
    });
  }
};

// @desc    Obtener los pedidos del usuario logueado
// @route   GET /api/orders/myorders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// @desc    Obtener un pedido por su ID
// @route   GET /api/orders/:id
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
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// @desc    Obtener todos los pedidos (solo admin) con búsqueda y filtros
// @route   GET /api/orders/all
export const getAllOrders = async (req, res) => {
  try {
    const { search, sort } = req.query;
    let filter = {};

    if (search) {
      if (!isNaN(search)) {
        filter.orderNumber = search;
      } else {
        const users = await User.find({
          name: { $regex: search, $options: "i" },
        });
        const userIds = users.map((u) => u._id);
        filter.$or = [
          { user: { $in: userIds } },
          { "orderItems.name": { $regex: search, $options: "i" } },
        ];
      }
    }

    let query = Order.find(filter).populate("user", "name email");

    if (sort) {
      if (sort === "date-desc") query = query.sort({ createdAt: -1 });
      else if (sort === "date-asc") query = query.sort({ createdAt: 1 });
      else if (sort === "price-desc") query = query.sort({ totalPrice: -1 });
      else if (sort === "price-asc") query = query.sort({ totalPrice: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const orders = await query;
    res.status(200).json(orders);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// @desc    Actualizar un pedido a 'entregado' (solo admin)
// @route   PUT /api/orders/:id/deliver
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
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
