//9VIeIKxKuTFveqLx

const express = require("express");
const productRouter = require("./routes/productRoutes.js");
const categoryRouter = require("./routes/categoryRoutes.js");

const app = express();
app.use(express.json());

app.use("/api/products/", productRouter);
app.use("/api/categories/", categoryRouter);

module.exports = app;
