// ecommerce-backend/routes/products.routes.js
import express from "express";
import {
  getAllProducts,
  getProductById,
  getProductCategories,
  getProductBrands,
  getRecentProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
} from "../controllers/product.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Rutas Públicas (cualquiera puede ver productos)
router.get("/recent", getRecentProducts);
router.get("/categories", getProductCategories);
router.get("/brands", getProductBrands);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/:id/reviews", protect, createProductReview);

// Rutas Protegidas (solo para administradores)
// Para llegar a createProduct, la petición debe pasar primero por 'protect' y luego por 'admin'.
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

export default router;
