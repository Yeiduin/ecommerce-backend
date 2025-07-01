// ecommerce-backend/routes/order.routes.js
import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderToDelivered,
} from "../controllers/order.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/myorders", protect, getMyOrders);

// Ruta para el admin - debe ir antes de la ruta dinámica /:id
router.get("/all", protect, admin, getAllOrders);

router.get("/:id", protect, getOrderById);
router.put("/:id/deliver", protect, admin, updateOrderToDelivered);

export default router;
