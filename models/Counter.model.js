// ecommerce-backend/models/Counter.model.js
import { Schema, model } from "mongoose";

const counterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

// Creamos un método estático para obtener el siguiente número de la secuencia
counterSchema.statics.getNextSequence = async function (name) {
  const counter = await this.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true } // upsert: true crea el documento si no existe
  );
  return counter.seq;
};

const Counter = model("Counter", counterSchema);
export default Counter;
