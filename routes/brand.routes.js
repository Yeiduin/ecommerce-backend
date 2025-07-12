// ecommerce-backend/routes/brand.routes.js
import express from "express";
import { getAllBrands, createBrand } from "../controllers/brand.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Ruta pública para que cualquiera pueda verlas
router.get("/", getAllBrands);
// Ruta protegida para que solo admins puedan crear
router.post("/", protect, admin, createBrand);

export default router;
