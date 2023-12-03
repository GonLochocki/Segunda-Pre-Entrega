import { Router } from "express";
import { Cart } from "../models/Carts.mongoose.js";
import { Product } from "../models/Products.mongoose.js";

export const cartRouter = Router();

cartRouter.post("/", async (req, res) => {
  try {
    const cart = await Cart.create({ products: [] });
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

cartRouter.get("/:id", async (req, res) => {
  const cart = await Cart.findById(req.params.id);
  if (!cart) {
    return res.json({ message: "cart not found..." });
  }
  res.json(cart.products);
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const prodBuscado = await Product.findById(productId);
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "cart not found..." });
    }
    if (!prodBuscado) {
      return res.status(404).json({ error: "product not found..." });
    }

    const existsInCart = cart.products.find((p) => p._id === prodBuscado._id);

    if (!existsInCart) {
      await Cart.findByIdAndUpdate(
        cartId,
        {
          $push: { products: { _id: productId, quantity: 1 } },
        },
        { new: true }
      );
      return res
        .status(201)
        .json({ message: "Product added succesfully..." });
    }

    const updatedCart = await Cart.findOneAndUpdate(
      { _id: cartId, "products._id": productId },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    );

    res.status(201).json({ message: "Product increased in cart..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await Cart.findById(cartId);

    if (!cart) {
      return res.status(404).json({ error: "cart not found..." });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      cartId,
      { $pull: { products: { _id: productId } } },
      { new: true }
    );

    res.json({ message: "Product deleted..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.delete("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await Cart.findByIdAndUpdate(cartId, { products: [] }, { new: true });

    res.json({ message: "All products are deleted..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

cartRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const newQuantity = req.body.quantity;

    const cart = await Cart.findOneAndUpdate(
      { _id: cartId, "products._id": productId },
      { $set: { "products.$.quantity": newQuantity } },
      { new: true }
    );

    res.json({ message: "Product quantity updated..." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});