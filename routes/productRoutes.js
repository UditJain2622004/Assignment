const express = require("express");
const productController = require("./../controllers/productController.js");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  // .post(productController.createCategories);
  .post(
    productController.createCategories("body"),
    productController.createProduct
  );

router
  .route("/:id")
  .get(productController.getOneProduct)
  .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

// router.get("/category/:id", productController.getProductByCategory);
router.get(
  "/category/:id",
  productController.createCategories("params"),
  productController.getProductByCategory
);

module.exports = router;
