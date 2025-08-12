import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import errorHandler from "./handlers/errorHandler.js";
import userRoutes from "./modules/users/users.routes.js";
import todosRoutes from "./modules/todos/todos.routes.js";

// Load environment variables
dotenv.config();

// Initialize app
const app = express();

// Middleware
app.use(express.json()); // Allow JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Models Initialization
import("./models/users.model.js");
import("./models/todos.model.js");

// Routes
app.use("/api/users", userRoutes);
app.use("/api/todos", todosRoutes);

// 404 JSON handler
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error Handling Middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
