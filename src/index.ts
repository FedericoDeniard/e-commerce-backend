import express from "express";
import {
  createBrand,
  createProduct,
  productSchema,
} from "./database/create.js";

import cors from "cors";

import { capitalize } from "./utils/string.js";
import { filterProducts, getProducts } from "./database/get.js";

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

app.get("/products/filter", async (req, res) => {
  let { name, brand, description, model } = req.query;
  if (brand) {
    brand = brand.split(",");
  }
  try {
    let filteredProducts = await filterProducts({
      name,
      brand,
      description,
      model,
    });
    res.status(200).json(filteredProducts);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/newProduct", async (req, res) => {
  const { name, brand_name, product_brand } = req.body;

  const product: productSchema = {
    name,
    product_brand: product_brand.map((brand) => ({
      model: brand.model,
      img_url: brand.img_url,
      price: brand.price,
      description: brand.description,
    })),
  };

  try {
    const newProduct = await createProduct(product, brand_name); // Asegúrate de pasar también brand_name
    res.status(201).json(newProduct);
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
