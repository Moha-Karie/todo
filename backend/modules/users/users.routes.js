import express from "express";
import register from "./controllers/register.js";
import login from "./controllers/login.js";

import auth from "../../middleware/auth.js"
import userDashboard from "./controllers/userDashboard.js";



const userRoutes = express.Router();

// Routes..........

// Public routes...........
userRoutes.post("/register", register);
userRoutes.post("/login", login);

// middleware
userRoutes.use(auth)


// Protected routes..........
userRoutes.get("/dashboard", userDashboard)

export default userRoutes;
