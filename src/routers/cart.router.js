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

cartRouter.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "cart not found..." });
    }

    const product = cart.products.find((p) => p._id === productId);
    if(!product){
      cart.products.push({_id: productId, quantity: 1})
      res.status(201).json(product)
    } else {
      const indexProduct = cart.products.findIndex((p) => p._id === productId)
      cart.products[indexProduct].quantity++
      res.json({mensaje: "Añadido existosamente" })
    }

    // const indexProduct = cart.products.findIndex((p) => p._id === productId);
    // if (indexProduct !== -1) {
    //   cart.products[indexProduct].quantity++;
    // } else {
    //   const product = await Product.findById(productId);
    //   if (!product) {
    //     return res.status(404).json({ error: "product not found..." });
    //   }
    //   cart.products.push({
    //     _id: productId,
    //     quantity: 1,
    //   });
    // }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
