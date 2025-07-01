// ecommerce-backend/routes/category.routes.js
import express from "express";
import {
  getAllCategories,
  createCategory,
} from "../controllers/category.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllCategories); // Ruta pública para que cualquiera pueda verlas
router.post("/", protect, admin, createCategory); // Ruta protegida para que solo admins puedan crear

export default router;
