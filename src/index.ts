import express from "express";
import {
  createBrand,
  getProducts,
  getBrands,
  createProduct,
  productSchema,
  getProductByBrand,
} from "./database/querys.js";

import { capitalize } from "./utils/string.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/products", async (req, res) => {
  try {
    let products = await getProducts();
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.get("/products/:brand_name", async (req, res) => {
  let { brand_name } = req.params;
  brand_name = capitalize(brand_name);
  try {
    let products = await getProductByBrand(brand_name);
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/newProduct", async (req, res) => {
  let { name, description, img_url, brand_name } = req.body;
  name = capitalize(name);
  brand_name = capitalize(brand_name);
  const product: productSchema = {
    name,
    description,
    img_url,
    product_brand: [],
  };

  try {
    const newProduct = await createProduct(product, brand_name);
    res.status(201).json(newProduct);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.get("/brands", async (req, res) => {
  try {
    let brands = await getBrands();
    res.status(200).json(brands);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/newBrand", async (req, res) => {
  let { name, logo_url } = req.body;
  name = capitalize(name);
  try {
    const newBrand = await createBrand({ name, logo_url });
    res.status(201).json(newBrand);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
