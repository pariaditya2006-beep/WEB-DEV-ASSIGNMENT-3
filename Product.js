const mongoose = require("mongoose");

// Product details and their rules
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  reorderLevel: {
    type: Number,
    required: true,
    min: 0,
    default: 10
  },
  supplier: {
    type: String,
    default: "Not given"
  }
}, { timestamps: true });

// Calculate total value of stock
productSchema.virtual("stockValue").get(function () {
  return this.price * this.quantity;
});

productSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);