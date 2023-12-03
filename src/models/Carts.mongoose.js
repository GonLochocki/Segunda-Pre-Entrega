import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import mongoosePaginate from "mongoose-paginate-v2";

const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID, require: true },
    products: [
      {
        _id: { type: String, ref: "products"},
        quantity: { type: Number, default: 0},
      },
    ],
  },
  {
    versionKey: false,
    strict: "throw",
  }
);

cartSchema.plugin(mongoosePaginate);

export const Cart = model("carts", cartSchema);

