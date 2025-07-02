// ecommerce-backend/controllers/upload.controller.js
import { v2 as cloudinary } from "cloudinary";

// Configuramos Cloudinary con nuestras credenciales del .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const getCloudinarySignature = async (req, res) => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    // Usamos la utilidad de Cloudinary para crear una firma segura
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp: timestamp,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ signature, timestamp });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al generar la firma", error: error.message });
  }
};
