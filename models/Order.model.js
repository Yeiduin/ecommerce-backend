// ecommerce-backend/models/Order.model.js
import { Schema, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderNumber: { type: Number },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
        price: { type: Number, required: true },
        product: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true }, // Nombre de quien recibe
      phone: { type: String, required: true }, // Celular de contacto
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: true,
    },
    paidAt: {
      type: Date,
      default: Date.now,
    },
    // --- CAMBIOS AQUÍ ---
    // Reemplazamos los campos isDelivered y deliveredAt por un único campo "status".
    status: {
      type: String,
      required: true,
      enum: ["En proceso", "Enviado", "Entregado", "Cancelado"],
      default: "En proceso",
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

export default Order;
