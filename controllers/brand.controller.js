// ecommerce-backend/controllers/brand.controller.js
import Brand from "../models/Brand.model.js";

// Obtener todas las marcas
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 }); // Ordenamos alfabéticamente
    res.status(200).json(brands);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las marcas" });
  }
};

// Crear una nueva marca (protegido por admin)
export const createBrand = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "El nombre es requerido" });
    }
    // Verificación sin distinguir mayúsculas/minúsculas
    const brandExists = await Brand.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (brandExists) {
      return res.status(400).json({ message: "La marca ya existe." });
    }
    const brand = await Brand.create({ name });
    res.status(201).json(brand);
  } catch (error) {
    res.status(500).json({ message: "Error al crear la marca" });
  }
};
