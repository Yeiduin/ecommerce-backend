// ecommerce-backend/routes/summary.routes.js
import express from "express";
import { getSummary } from "../controllers/summary.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protegemos la ruta para que solo los admins puedan ver las estadísticas
router.get("/", protect, admin, getSummary);

export default router;
