// models/Product.model.js

import { Schema, model } from "mongoose";
const reviewSchema = new Schema(
  {
    name: { type: String, required: true }, // Nombre del usuario que deja la reseña
    rating: { type: Number, required: true }, // Calificación de 1 a 5
    comment: { type: String, required: true }, // Comentario
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User", // Referencia al usuario que hizo la reseña
    },
  },
  {
    timestamps: true,
  }
);

// Definimos el Schema (el plano) de nuestros productos
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es obligatorio."], // El campo es requerido
      trim: true, // Limpia los espacios en blanco al principio y al final
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria."],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, "La marca es obligatoria."],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "El precio es obligatorio."],
    },
    category: {
      type: Schema.Types.ObjectId, // El tipo ahora es un ID de Objeto de MongoDB
      ref: "Category", // Le decimos que este ID hace referencia al modelo 'Category'
      required: [true, "La categoría es obligatoria."],
    },
    stock: {
      type: Number,
      required: [true, "El stock es obligatorio."],
      default: 0, // Si no se provee, el valor por defecto será 0
    },
    image: {
      type: String, // Guardaremos la URL de la imagen
      required: false, // Hacemos que la imagen no sea obligatoria por ahora
    },
    reviews: [reviewSchema], // Un array de reseñas
    rating: {
      type: Number,
      required: true,
      default: 0, // Calificación promedio
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0, // Número total de reseñas
    },
  },
  {
    // timestamps: true añade dos campos a nuestro schema: createdAt y updatedAt
    timestamps: true,
  }
);

// Creamos el Modelo a partir del Schema.
// Mongoose, por defecto, creará una colección en MongoDB llamada 'products' (plural y en minúsculas)
const Product = model("Product", productSchema);

export default Product;
