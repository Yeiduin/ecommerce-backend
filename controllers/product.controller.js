// ecommerce-backend/controllers/product.controller.js
import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js"; // <-- 1. IMPORTAMOS EL MODELO CATEGORY (LA CORRECCIÓN PRINCIPAL)

// @desc    Obtener todos los productos (con filtros, búsqueda y ordenamiento)
// @route   GET /api/products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let filter = {};

    // ===== LÓGICA DE BÚSQUEDA MEJORADA =====
    if (search) {
      // 1. Buscamos el término de búsqueda en el nombre de las categorías
      const matchingCategories = await Category.find({
        name: { $regex: search, $options: "i" },
      });
      // Extraemos solo los IDs de las categorías encontradas
      const categoryIds = matchingCategories.map((cat) => cat._id);

      // 2. Creamos una condición $or para buscar en múltiples campos
      filter.$or = [
        { name: { $regex: search, $options: "i" } }, // Busca en el nombre del producto
        { description: { $regex: search, $options: "i" } }, // Busca en la descripción del producto
        { category: { $in: categoryIds } }, // Busca si la categoría del producto está en nuestra lista de IDs
      ];
    }

    // La lógica de filtro por categoría se mantiene y puede combinarse con la búsqueda
    if (category && category !== "Todos") {
      const categoryObj = await Category.findOne({
        name: { $regex: `^${category}$`, $options: "i" },
      });
      if (categoryObj) {
        filter.category = categoryObj._id;
      } else {
        return res.status(200).json([]);
      }
    }

    let query = Product.find(filter).populate("category");

    if (sort) {
      if (sort === "price-asc") {
        query = query.sort({ price: 1 });
      } else if (sort === "price-desc") {
        query = query.sort({ price: -1 });
      }
    }

    const products = await query;
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

// Función para obtener un producto por ID (actualizada)
export const getProductById = async (req, res) => {
  try {
    // Añadimos .populate() aquí también para que nos devuelva el objeto categoría completo
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.status(200).json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el producto", error: error.message });
  }
};
// @desc    Crear un nuevo producto
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error al crear el producto", error: error.message });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock || product.stock;
      product.image = image || product.image;
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne(); // Nuevo método en Mongoose v6+
      res.json({ message: "Producto eliminado" });
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el producto", error: error.message });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    // LA FORMA CORRECTA: Llama a .distinct() directamente sobre el Modelo.
    const categories = await Product.distinct("category");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las categorías",
      error: error.message,
    });
  }
};
