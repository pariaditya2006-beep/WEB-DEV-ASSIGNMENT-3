// Import the packages
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const app = express();

// This allows our server to read JSON data
app.use(express.json());

// Home route
app.get("/", (req, res) => {
  res.send("Inventory Management System is running");
});

// All product routes start with /api/products
app.use("/api/products", productRoutes);

// If a route is not found
app.use((req, res) => {
  res.status(404).json({ message: "Page not found" });
});

// Simple error handler
app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(400).json({ message: err.message });
});

// Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log("Server started");
    });
  })
  .catch((error) => {
    console.log("Database connection error:", error.message);
  });