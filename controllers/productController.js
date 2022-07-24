const express = require("express");
const mongoose = require("mongoose");
const Product = require("./../models/productModel.js");
const Category = require("./../models/categoryModel.js");

// Function to find category IDs based on category names and adding them to req.body
exports.createCategories = (fromWhere = "body") => {
  return async (req, res, next) => {
    //function to find category IDs from category names
    // takes an array of category names as input AND gives an array of category IDs as output
    const myAsyncLoopFunction = async (data) => {
      const categories = [];

      for (const category of data) {
        const categoryId = await Category.find({
          name: category,
        });
        categories.push(categoryId[0]._id);
      }

      return categories;
    };

    let details = { ...req.body };
    if (fromWhere === "body") details.categoryNames = req.body.category;

    details.category =
      fromWhere === "body"
        ? await myAsyncLoopFunction(req.body.category)
        : await myAsyncLoopFunction([req.params.id]);

    req.body = details;

    next();
  };
};

exports.getAllProducts = async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    status: "success",
    Results: products.length,
    data: {
      products,
    },
  });
};

exports.getOneProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

exports.getProductByCategory = async (req, res, next) => {
  // cateogry name is specified in params but we put it in req.body through createCategories function
  const products = await Product.find({
    category: req.body.category[0],
  });
  res.status(200).json({
    status: "success",
    Results: products.length,
    data: {
      products,
    },
  });
};

exports.createProduct = async (req, res, next) => {
  console.log(req.body);
  const product = await Product.create(req.body);

  req.body.category.forEach(async (category) => {
    const categoryId = await Category.findByIdAndUpdate(
      category,
      { $addToSet: { products: product._id } },
      { runValidators: true, new: true }
    );
  });

  res.status(201).json({
    status: "success",
    data: {
      product: "sa",
    },
  });
};

exports.updateProduct = async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
    new: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
};

exports.deleteProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  // if(!product) return next(Error("No product found"))

  product.category.forEach(async (category) => {
    await Category.findByIdAndUpdate(
      category,
      { $pull: { products: product._id } },
      { runValidators: true, new: true }
    );
  });
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
};
