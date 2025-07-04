import Product from "../models/Product.model.js";
import Category from "../models/Category.model.js";

export const getAllProducts = async (req, res) => {
  try {
    // 1. OBTENEMOS LOS PARÁMETROS DE LA URL
    const { page = 1, limit = 10, category, search, sort, brand } = req.query;

    let filter = {};

    // Lógica de búsqueda (sin cambios)
    if (search) {
      const matchingCategories = await Category.find({
        name: { $regex: search, $options: "i" },
      });
      const categoryIds = matchingCategories.map((cat) => cat._id);
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { brand: { $regex: search, $options: "i" } },
        { category: { $in: categoryIds } },
      ];
    }

    // Lógica de filtro por categoría (sin cambios)
    if (category && category !== "Todos") {
      const categoryObj = await Category.findOne({
        name: { $regex: `^${category}$`, $options: "i" },
      });
      if (categoryObj) {
        filter.category = categoryObj._id;
      } else {
        return res
          .status(200)
          .json({ products: [], page: 1, pages: 0, total: 0 });
      }
    }

    // Lógica de filtro por marca (sin cambios)
    if (brand && brand !== "Todos") {
      filter.brand = { $regex: `^${brand}$`, $options: "i" };
    }

    // 2. CONTAMOS EL TOTAL DE DOCUMENTOS QUE COINCIDEN CON LOS FILTROS
    const totalProducts = await Product.countDocuments(filter);

    // 3. CONSTRUIMOS LA CONSULTA CON PAGINACIÓN Y ORDENAMIENTO
    let query = Product.find(filter)
      .populate("category")
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    // Lógica de ordenamiento (sin cambios)
    if (sort) {
      if (sort === "price-asc") query = query.sort({ price: 1 });
      else if (sort === "price-desc") query = query.sort({ price: -1 });
      else if (sort === "name-asc")
        query = query
          .collation({ locale: "en", strength: 2 })
          .sort({ name: 1 });
      else if (sort === "name-desc")
        query = query
          .collation({ locale: "en", strength: 2 })
          .sort({ name: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const products = await query;

    // 4. DEVOLVEMOS UN OBJETO COMPLETO CON LOS DATOS DE PAGINACIÓN
    res.status(200).json({
      products,
      page: parseInt(page),
      pages: Math.ceil(totalProducts / parseInt(limit)), // Calculamos el total de páginas
      total: totalProducts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos",
      error: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
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

export const createProduct = async (req, res) => {
  try {
    const { name, description, brand, price, category, stock, image } =
      req.body;
    const product = new Product({
      name,
      description,
      brand,
      price,
      category,
      stock,
      image,
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("ERROR DETALLADO DEL BACKEND:", error);
    res
      .status(400)
      .json({ message: "Error al crear el producto", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, brand, price, category, stock, image } =
      req.body;
    const product = await Product.findById(req.params.id);
    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.brand = brand || product.brand;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock !== undefined ? stock : product.stock;
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

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
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
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las categorías",
      error: error.message,
    });
  }
};

export const getProductBrands = async (req, res) => {
  try {
    const brands = await Product.distinct("brand");
    res.status(200).json(brands.sort());
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las marcas", error: error.message });
  }
};

export const getRecentProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .sort({ createdAt: -1 })
      .limit(4)
      .populate("category");
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los productos recientes",
      error: error.message,
    });
  }
};

// @desc    Crear una nueva reseña
// @route   POST /api/products/:id/reviews
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Verificamos si el usuario ya ha dejado una reseña en este producto
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "Ya has dejado una reseña para este producto" });
    }

    // Creamos el objeto de la nueva reseña
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // Añadimos la nueva reseña al array de reseñas del producto
    product.reviews.push(review);

    // Actualizamos el número total de reseñas
    product.numReviews = product.reviews.length;

    // Calculamos el nuevo promedio de calificación
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    // Guardamos los cambios en la base de datos
    await product.save();
    res.status(201).json({ message: "Reseña añadida con éxito" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error en el servidor al añadir la reseña" });
  }
};
