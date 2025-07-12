// ecommerce-backend/controllers/banner.controller.js
import Banner from "../models/Banner.model.js";

// @desc    Obtener todos los banners activos
// @route   GET /api/banners
export const getActiveBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los banners" });
  }
};

// @desc    Crear un nuevo banner (solo admin)
// @route   POST /api/banners
export const createBanner = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res
        .status(400)
        .json({ message: "La URL de la imagen es requerida" });
    }
    const banner = await Banner.create({ imageUrl });
    res.status(201).json(banner);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el banner" });
  }
};

// @desc    Eliminar un banner (solo admin)
// @route   DELETE /api/banners/:id
export const deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (banner) {
      await banner.deleteOne();
      res.json({ message: "Banner eliminado" });
    } else {
      res.status(404).json({ message: "Banner no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el banner" });
  }
};

// @desc    Actualizar el orden de los banners (solo admin)
// @route   PUT /api/banners/order
export const updateBannerOrder = async (req, res) => {
  try {
    const { bannerIds } = req.body; // Recibimos un array de IDs en el nuevo orden

    if (!Array.isArray(bannerIds)) {
      return res.status(400).json({ message: "Se esperaba un array de IDs." });
    }

    // Usamos Promesas para actualizar todos los documentos en paralelo
    const updatePromises = bannerIds.map((id, index) =>
      Banner.findByIdAndUpdate(id, { order: index })
    );

    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ message: "Orden de los banners actualizado con éxito." });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el orden de los banners",
      error: error.message,
    });
  }
};
