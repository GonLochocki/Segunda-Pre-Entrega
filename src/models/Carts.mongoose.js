import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";

const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID, require: true },
    products: [
      {
        _id: { type: String },
        quantity: { type: Number },
      },
    ],
  },
  {
    versionKey: false,
    strict: "throw",
  }
);

export const Cart = model("carts", cartSchema);
