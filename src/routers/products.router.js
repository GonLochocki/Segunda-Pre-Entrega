import { Router, urlencoded } from "express";
import { Product } from "../models/Products.mongoose.js";

export const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const { limit = 10, page = 1, query = "{}", sort = "{}" } = req.query;
  const parsedLimit = parseInt(limit);
  const parsedPage = parseInt(page);
  const paginationOptions = { limit: parsedLimit, page: parsedPage };
  let parsedQuery;
  let parsedSort;

  try {
    parsedQuery = JSON.parse(query);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  try {
    parsedSort = JSON.parse(sort);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }

  if (req.query.sort) {
    try {
      const aggregation = [{ $match: parsedQuery }, { $sort: parsedSort }];
      const orderProducts = await Product.aggregate(aggregation);
      return res.status(200).json(orderProducts);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  const searchParam = parsedQuery;
  const products = await Product.paginate(searchParam, paginationOptions);

  if (products.docs.length === 0) {
    return res.json({ message: "products collection are empty..." });
  }

  const context = {
    pageTitle: "Listado de Productos",
    hayDocs: products.docs.length > 0,
    docs: products.docs,
    limit: products.limit,
    page: products.page,   
  };

  
  res.render("products", context)
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
