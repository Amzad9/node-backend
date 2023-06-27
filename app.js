const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Register Model
const branchModel = require("./models/branch");

// Path of Environment File
const env = "dev";
const envPath = ".env." + env;
dotenv.config({
  path: envPath,
});

// Admin Routes
const restaurantRoutes = require("./routes/restaurant");
const adminRoutes = require("./routes/admin");
const branchRoutes = require("./routes/branch");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

const cors = require("cors");
const app = express();

// const db = url;
const db = process.env.MONGOHOST;
console.log(db);
mongoose.connect(db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "40mb" }));

app.use(cors());

app.use(function rootHandler(req, res, next) {
  next();
});

// Admin API Paths
app.use("/api/restaurant", restaurantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);

app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
