// ecommerce-backend/routes/upload.routes.js
import express from "express";
import { getCloudinarySignature } from "../controllers/upload.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Ruta segura para que solo los admins puedan obtener la firma
router.get("/signature", protect, admin, getCloudinarySignature);

export default router;
