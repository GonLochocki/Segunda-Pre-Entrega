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
    const buscado = await Product.findById(productId)
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).json({ error: "cart not found..." });
    }

    const product = cart.products.find((p) => p._id === buscado._id);
    if(!product){
      cart.products.push({_id: buscado._id, quantity: 1})
      res.status(201).json({product, message: "Producto agregado existosamente"})
    } else {
      const indexProduct = cart.products.findIndex((p) => p._id === buscado._id)
      cart.products[indexProduct].quantity++
      res.json({mensaje: "El producto se incremento en el carrito" })
    }

    await cart.save()

    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
