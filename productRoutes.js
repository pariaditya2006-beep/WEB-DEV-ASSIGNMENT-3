const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// 1. CREATE PRODUCT
// POST /api/products
router.post("/", async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 2. GET ALL PRODUCTS
// Supports search, category, sorting and pagination
// GET /api/products?category=Stationery&page=1&limit=5
router.get("/", async (req, res) => {
  try {
    const filter = {};

    // Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    // Search by product name
    if (req.query.search) {
      filter.name = { $regex: req.query.search, $options: "i" };
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Sort products by name, price or quantity
    const sortBy = req.query.sort || "name";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const products = await Product.find(filter)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);

    const totalProducts = await Product.countDocuments(filter);

    res.json({
      totalProducts: totalProducts,
      page: page,
      totalPages: Math.ceil(totalProducts / limit),
      products: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 3. LOW STOCK REPORT
// GET /api/products/low-stock
router.get("/low-stock", async (req, res) => {
  try {
    const products = await Product.find({
      $expr: { $lte: ["$quantity", "$reorderLevel"] }
    });

    res.json({
      message: "Products with low stock",
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. CATEGORY-WISE SUMMARY
// GET /api/products/summary
router.get("/summary", async (req, res) => {
  try {
    const summary = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          totalProducts: { $sum: 1 },
          totalQuantity: { $sum: "$quantity" },
          totalStockValue: {
            $sum: { $multiply: ["$price", "$quantity"] }
          },
          averagePrice: { $avg: "$price" }
        }
      }
    ]);

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. GET ONE PRODUCT BY ID
// GET /api/products/product_id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

// 6. UPDATE PRODUCT DETAILS
// PUT /api/products/product_id
router.put("/:id", async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 7. UPDATE STOCK
// Use positive change for adding stock and negative change for selling
// PATCH /api/products/product_id/stock
router.patch("/:id/stock", async (req, res) => {
  try {
    const change = Number(req.body.change);
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (!Number.isInteger(change) || change === 0) {
      return res.status(400).json({
        message: "Enter a whole number other than zero"
      });
    }

    if (product.quantity + change < 0) {
      return res.status(400).json({
        message: "Not enough stock available"
      });
    }

    product.quantity = product.quantity + change;
    await product.save();

    res.json({
      message: "Stock updated successfully",
      product: product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 8. DELETE PRODUCT
// DELETE /api/products/product_id
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid product ID" });
  }
});

module.exports = router;