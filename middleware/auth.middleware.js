// ecommerce-backend/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

// Guardia 1: Protege rutas, verifica que haya un token válido
export const protect = async (req, res, next) => {
  let token;
  // Los tokens se envían en los headers de la petición así: "Bearer [token]"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Obtenemos el token del header
      token = req.headers.authorization.split(" ")[1];

      // Verificamos y decodificamos el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Buscamos al usuario por el ID del token y lo adjuntamos a la petición
      // No incluimos la contraseña
      req.user = await User.findById(decoded.id).select("-password");

      next(); // El usuario es válido, puede continuar a la siguiente función
    } catch (error) {
      return res
        .status(401)
        .json({ message: "No autorizado, el token falló." });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token." });
  }
};

// Guardia 2: Verifica que el usuario tenga el rol de 'admin'
export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // El usuario es admin, puede continuar
  } else {
    res
      .status(403)
      .json({ message: "No autorizado, se requiere rol de administrador." });
  }
};
