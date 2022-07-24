//9VIeIKxKuTFveqLx

const express = require("express");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/productRoutes.js");
const categoryRouter = require("./routes/categoryRoutes.js");
const userRouter = require("./routes/userRoutes.js");

const app = express();
app.use(cookieParser());
app.use(express.json());

app.use("/api/products/", productRouter);
app.use("/api/categories/", categoryRouter);
app.use("/api/users/", userRouter);

module.exports = app;
