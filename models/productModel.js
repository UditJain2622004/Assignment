const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  created: {
    type: Date,
    default: Date.now,
    select: false,
  },
  category: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      // required: [true, "Product must have a category"],
    },
  ],
  categoryNames: [
    {
      type: String,
      required: [true, "Product must have a category"],
    },
  ],
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
