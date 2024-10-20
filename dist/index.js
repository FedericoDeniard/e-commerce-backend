import express from "express";
import { createBrand, createProduct, } from "./database/create.js";
import cors from "cors";
import { capitalize } from "./utils/string.js";
import { filterProducts, getProducts } from "./database/get.js";
import { checkUser, createToken } from "./utils/validation.js";
import cookieParser from "cookie-parser";
import { deleteProduct } from "./database/delete.js";
import { authMiddleware } from "./utils/middleware.js";
import { modifyProduct } from "./database/update.js";
const app = express();
const PORT = process.env.PORT || 3000;
const corsOptions = {
    origin: process.env.NODE_ENV === "production"
        ? "https://federicodeniard.github.io"
        : "http://localhost:3000",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.get("/products", async (req, res) => {
    try {
        let products = await getProducts();
        res.status(200).json(products);
    }
    catch (e) {
        console.error(e);
        res.status(500).json(e);
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
    }
    catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
app.post("/newProduct", async (req, res) => {
    const { name, brand_name, product_brand } = req.body;
    const product = {
        name,
        brand_name,
        product_brand: {
            model: product_brand.model,
            img_url: product_brand.img_url,
            price: parseFloat(product_brand.price),
            description: product_brand.description,
        },
    };
    try {
        const newProduct = await createProduct(product);
        res.status(201).json(newProduct);
    }
    catch (e) {
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
    }
    catch (e) {
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
            sameSite: "None",
            maxAge: 1000 * 60 * 60 * 24,
        })
            .status(200)
            .send(user);
    }
    catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
app.get("/checkToken", authMiddleware, async (req, res) => {
    const { id, role } = req.user;
    res.status(200).json({ id, role });
});
app.post("/removeProduct", authMiddleware, async (req, res) => {
    let { id, brand_id, model } = req.body;
    try {
        const deletedProduct = await deleteProduct({ id, brand_id, model });
        res.status(200).json(deletedProduct);
    }
    catch (e) {
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
    }
    catch (e) {
        console.error(e);
        res.status(500).send(e);
    }
});
app.get("/products/filter", async (req, res) => {
    let { name, brand, description } = req.query;
    const brandsArray = brand
        ? brand.split(",").map((brand) => brand.trim())
        : undefined;
    try {
        const products = await filterProducts({
            name,
            brand: brandsArray,
            description,
        });
        res.status(200).json(products);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al buscar productos" });
    }
});
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map