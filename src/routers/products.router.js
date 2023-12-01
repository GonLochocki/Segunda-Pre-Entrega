import { Router } from "express";
import { Product } from "../models/Products.mongoose.js";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  if (products.length === 0) {
    return res.json({ message: "products collection are empty..." });
  }
  res.json(products);
});

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.json({ message: "product not found..." });
  }
  res.json(product);
});

productRouter.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

productRouter.put("/:id", async (req, res) => {
  const old = Product.findById(req.params.id);
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    { $set: req.body },
    { new: true }
  );
  if (!updated) {
    return res.status(400).json({ message: "product not found..." });
  }
  res.json({
    old,
    updated,
  });
});

productRouter.delete("/:id", async (req, res) => {
  const deleted = Product.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.json({ message: "product not found..." });
  }
  res.json(deleted);
});
