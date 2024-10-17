import express from "express";
import {
  createBrand,
  createProduct,
  productSchema,
} from "./database/querys.js";

import cors from "cors";

import { capitalize } from "./utils/string.js";
import {
  filterProducts,
  getProductByProductBrand,
  getProducts,
} from "./database/get.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const whitelist = ["http://localhost:5173"];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

const corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));

app.get("/products", async (req, res) => {
  try {
    let products = await getProducts();
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

app.get("/products/:product_id/:brand_id", async (req, res) => {
  let { product_id, brand_id } = req.params;
  try {
    let products = await getProductByProductBrand({ product_id, brand_id });
    res.status(200).json(products);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.get("/products/filter", async (req, res) => {
  let { name, brand, description } = req.query;
  if (brand) {
    brand = brand.split(",");
  }
  try {
    let filteredProducts = await filterProducts({ name, brand, description });
    res.status(200).json(filteredProducts);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/newProduct", async (req, res) => {
  let { name, description, img_url, brand_name, price } = req.body;
  name = capitalize(name);
  brand_name = capitalize(brand_name);
  const product: productSchema = {
    name,
    description,
    img_url,
    price,
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

// app.get("/brands", async (req, res) => {
//   try {
//     const { cursor } = req.query;
//     let brands = await getBrands(cursor ? parseInt(cursor) : undefined);
//     res.status(200).json(brands);
//   } catch (e) {
//     console.error(e);
//     res.status(500).send(e);
//   }
// });

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
