// ecommerce-backend/controllers/category.controller.js
import Category from "../models/Category.model.js";

// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort("name");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las categorías" });
  }
};

// Crear una nueva categoría (protegido por admin)
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "La categoría ya existe" });
    }
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la categoría" });
  }
};
