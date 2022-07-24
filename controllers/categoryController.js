const express = require("express");
const Category = require("../models/categoryModel.js");
const Product = require("../models/productModel.js");

exports.getAllCategories = async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    status: "success",
    Results: categories.length,
    data: {
      categories,
    },
  });
};

exports.getOneCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
};

exports.updateCategory = async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { runValidators: true, new: true }
  );
  res.status(200).json({
    status: "success",
    data: {
      category,
    },
  });
};

exports.createCategory = async (req, res, next) => {
  const category = await Category.create({ name: req.body.name });
  res.status(201).json({
    status: "success",
    data: {
      category,
    },
  });
};

exports.deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  // delete all the products belonging to the deleted category
  category.products.forEach(async (product) => {
    await Product.findByIdAndDelete(product);
  });

  await Category.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: "success",
  });
};
