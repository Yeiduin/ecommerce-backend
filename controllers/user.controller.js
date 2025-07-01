// ecommerce-backend/controllers/user.controller.js
import User from "../models/User.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Función para generar un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d", // El token expirará en 30 días
  });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/users/register
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validar que todos los campos lleguen
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, completa todos los campos." });
    }

    // 2. Verificar si el usuario ya existe en la base de datos
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }

    // 3. Hashear (encriptar) la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Crear el nuevo usuario en la base de datos
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // 5. Si el usuario se creó correctamente, le devolvemos sus datos y un token
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Generamos y enviamos el token
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

// @desc    Autenticar (loguear) un usuario
// @route   POST /api/users/login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validar que lleguen los datos
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Por favor, completa todos los campos." });
    }

    // 2. Buscar al usuario por su email
    const user = await User.findOne({ email });

    // 3. Si el usuario existe Y la contraseña coincide, enviamos los datos
    // bcrypt.compare compara la contraseña en texto plano con la hasheada
    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id), // Le damos un nuevo token
      });
    } else {
      // Si el usuario no existe o la contraseña es incorrecta,
      // enviamos un error genérico por seguridad.
      res.status(401).json({ message: "Credenciales inválidas." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};
// ===== NUEVA FUNCIÓN PARA ADMIN =====
// @desc    Obtener todos los usuarios (solo admin)
// @route   GET /api/users
export const getUsers = async (req, res) => {
  try {
    // Buscamos a todos los usuarios y excluimos su contraseña del resultado
    const users = await User.find({}).select("-password");
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error en el servidor", error: error.message });
  }
};

// ===== NUEVA FUNCIÓN PARA ADMIN =====
// @desc    Eliminar un usuario (solo admin)
// @route   DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      // Medida de seguridad importante: un admin no se puede borrar a sí mismo.
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
