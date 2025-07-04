// ecommerce-backend/controllers/user.controller.js
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Función para generar un token JWT (no cambia)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// registerUser y loginUser no cambian
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, completa todos los campos." });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Datos de usuario inválidos." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, completa todos los campos." });
    }
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Credenciales inválidas." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// --- FUNCIÓN MEJORADA ---
// @desc    Obtener todos los usuarios (solo admin) con búsqueda
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    // Si hay un término de búsqueda, creamos un filtro para buscar
    // por nombre o por email, sin distinguir mayúsculas/minúsculas.
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Buscamos a todos los usuarios que coincidan con el filtro y
    // excluimos su contraseña del resultado.
    const users = await User.find(filter).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// La función deleteUser no cambia
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      if (user.role === "admin") {
        return res
          .status(400)
          .json({ message: "No se pueden eliminar usuarios administradores." });
      }
      await user.deleteOne();
      res.json({ message: "Usuario eliminado con éxito." });
    } else {
      res.status(404).json({ message: "Usuario no encontrado." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
