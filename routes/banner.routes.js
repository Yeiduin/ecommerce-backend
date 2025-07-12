// ecommerce-backend/routes/banner.routes.js
import express from "express";
import {
  getActiveBanners,
  createBanner,
  deleteBanner,
  updateBannerOrder,
} from "../controllers/banner.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Ruta pública para que el frontend obtenga los banners
router.get("/", getActiveBanners);

// Rutas de administrador
router.post("/", protect, admin, createBanner);
router.put("/order", protect, admin, updateBannerOrder);
router.delete("/:id", protect, admin, deleteBanner);

export default router;
