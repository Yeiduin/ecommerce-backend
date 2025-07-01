// ecommerce-backend/routes/user.routes.js
import express from "express";
// 1. Importamos las nuevas funciones y middlewares
import {
  registerUser,
  loginUser,
  getUsers,
  deleteUser,
} from "../controllers/user.controller.js";
import { protect, admin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Cuando llegue una petición POST a /register, se ejecutará la función registerUser
router.post("/register", registerUser);

// ruta de login
router.post("/login", loginUser);

//rutas protegidas solo para administradores

router.get("/", protect, admin, getUsers);
router.delete("/:id", protect, admin, deleteUser);

export default router;
