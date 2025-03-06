import "express-async-errors";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path"


import { fileURLToPath } from "url"; // Fix __dirname in ES modules

import errorHandler from "./handlers/errorHandler.js";
import userRoutes from "./modules/users/users.routes.js";
import todosRoutes from "./modules/todos/todos.routes.js";


// fix the __dirname in ES modules (since ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config(); // Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();




// Middleware
app.use(express.json()); // Allow JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing


// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("✅ MongoDB connected successfully!"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// Models Initialization (Ensure they are imported before routes)
import("./models/users.model.js");
import("./models/todos.model.js");

// Serve static frontend files (adjusted path to go up one level)
app.use(express.static(path.join(__dirname, "..", "frontend")));

// Serve pages dynamically with clean URLs (no .html extension)
const servePage = (page) => (req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "pages", `${page}.html`));
};

// Clean URL routing for pages (remove .html)
app.get("/", servePage("login")); // Default route
app.get("/login", servePage("login"));
app.get("/register", servePage("register"));
app.get("/home", servePage("home"));
app.get("/notFoundPage", servePage("notFoundPage"));

app.use("/api/users", userRoutes);
app.use("/api/todos", todosRoutes);

// 404 Route
app.all("*", (req, res)=>{
res.sendFile(path.join(__dirname, "..", "frontend", "pages", "notFoundPage.html"));
})


// Error Handling Middleware (should be after all routes)
app.use(errorHandler);

// Server Port
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
