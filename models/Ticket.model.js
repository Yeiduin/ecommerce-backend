// ecommerce-backend/models/Ticket.model.js
import { Schema, model } from "mongoose";

const messageSchema = new Schema(
  {
    sender: {
      type: String,
      required: true,
      enum: ["user", "admin"],
    },
    text: {
      type: String,
      required: true,
    },
    name: {
      // Nombre de quien envía (ej. "Yeiduin" o "Soporte BestDeal")
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ticketSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: false, // Un ticket puede no estar asociado a una orden
    },
    subject: {
      type: String,
      required: [true, "El asunto es obligatorio."],
    },
    status: {
      type: String,
      enum: ["Abierto", "En proceso", "Cerrado"],
      default: "Abierto",
    },
    messages: [messageSchema], // La conversación se guardará aquí
  },
  {
    timestamps: true,
  }
);

const Ticket = model("Ticket", ticketSchema);
export default Ticket;
