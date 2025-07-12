// ecommerce-backend/models/Brand.model.js
import { Schema, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre de la marca es obligatorio."],
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Brand = model("Brand", brandSchema);

export default Brand;
