// ecommerce-backend/models/User.model.js

import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio."],
      trim: true, // Elimina espacios en blanco al principio y al final
    },
    email: {
      type: String,
      required: [true, "El email es obligatorio."],
      unique: true, // No puede haber dos usuarios con el mismo email
      trim: true,
      lowercase: true, // Guarda el email siempre en minúsculas
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor, introduce un email válido.",
      ], // Valida que el formato del email sea correcto
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria."],
    },
    role: {
      type: String,
      enum: ["user", "admin"], // El rol solo puede ser 'user' o 'admin'
      default: "user", // Por defecto, todos los usuarios nuevos son 'user'
    },
  },
  {
    timestamps: true, // Añade automáticamente createdAt y updatedAt
  }
);

const User = model("User", userSchema);

export default User;
