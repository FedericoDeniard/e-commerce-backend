import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/products", (req, res) => {
  res.send("Products");
});
app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map
