// ecommerce-backend/models/Banner.model.js
import { Schema, model } from "mongoose";

const bannerSchema = new Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Podrías añadir un campo de orden si quieres controlar la posición
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = model("Banner", bannerSchema);

export default Banner;
