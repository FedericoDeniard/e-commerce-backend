import express from "express";
import {
  createBrand,
  createProduct,
  productSchema,
} from "./database/create.js";

import cors from "cors";

import { capitalize } from "./utils/string.js";
import { filterProducts, getProducts } from "./database/get.js";
import { checkUser, createToken } from "./utils/validation.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { deleteProduct } from "./database/delete.js";
import { authMiddleware } from "./utils/middleware.js";
import { modifyProduct } from "./database/update.js";

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

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
  let { name, brand, description, model, id } = req.query as {
    name?: string;
    brand?: string;
    description?: string;
    model?: string;
    id?: number;
  };
  let brandArray = brand.split(",");
  try {
    let filteredProducts = await filterProducts({
      name,
      brand: brandArray,
      description,
      model,
      id,
    });
    res.status(200).json(filteredProducts);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.get("/products/:id/:brand/:model", async (req, res) => {
  let { id, brand, model } = req.params;
  let brandArray = brand.split(",");
  try {
    const filteredProducts = await filterProducts({
      id: parseInt(id),
      brand: brandArray,
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
    const newProduct = await createProduct(product, brand_name);
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

app.post("/login", async (req, res) => {
  try {
    let { username, password } = req.body;

    let user = await checkUser(username, password);
    if (!user) {
      res.status(401).send("Invalid credentials");
      return;
    }

    const token = createToken({ id: user.id, role: user.role });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .send(user);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.get("/checkToken", authMiddleware, async (req, res) => {
  const { id, role } = req.user;
  res.status(200).json({ id, role });
});

app.post("/removeProduct", authMiddleware, async (req, res) => {
  let { id, brand_id, model }: { id: number; brand_id: number; model: string } =
    req.body;

  try {
    const deletedProduct = await deleteProduct({ id, brand_id, model });
    res.status(200).json(deletedProduct);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.post("/modifyProduct", authMiddleware, async (req, res) => {
  let { originalProduct, modifiedProduct } = req.body;
  try {
    const updatedProduct = await modifyProduct({
      originalProduct,
      modifiedProduct,
    });
    res.status(200).json(updatedProduct);
  } catch (e) {
    console.error(e);
    res.status(500).send(e);
  }
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
