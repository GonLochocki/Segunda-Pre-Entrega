import { Router } from "express";
import { Product } from "../models/Products.mongoose.js";
import util from "node:util";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const { limit = 10, page = 1, query = "{}" } = req.query;
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);  
  const paginationOptions = { limit: parsedLimit, page: parsedPage }; 
  let parsedQuery;

  try{
    parsedQuery = JSON.parse(query)
  }catch(error){
    return res.status(400).json({error: error.message})
  }
   
  const criterioBusqueda = parsedQuery;
  const products = await Product.paginate(criterioBusqueda, paginationOptions);

  if (products.docs.length === 0) {
    return res.json({ message: "products collection are empty..." });  }

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
  const old = await Product.findById(req.params.id);
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
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.json({ message: "product not found..." });
  }
  res.json(deleted);
});
