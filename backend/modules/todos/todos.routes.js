import express from "express";
import auth from "../../middleware/auth.js";

import viewTodos from "./controllers/viewTodos.js";
import editTodo from "./controllers/editTodo.js";
import deleteTodo from "./controllers/deleteTodo.js";

import pendingTodos from "./controllers/pendingTodos.js";
import completedTodos from "./controllers/completedTodos.js";
import completeTodo from "./controllers/completeTodo.js";
import pendTodo from "./controllers/pendTodo.js";
import { overDuedTodos } from "./controllers/overDuedTodos.js";
import { dueDateTodos } from "./controllers/dueDateTodos.js";
import { addTodos } from "./controllers/addTodos.js";
import { prioritizedTodos } from "./controllers/prioritizedTodos.js";

const todosRoutes = express.Router();

todosRoutes.use(auth);

// protected routes

// add - edit - delete
todosRoutes.post("/addTodos", addTodos);
todosRoutes.put("/editTodo/:id", editTodo);
todosRoutes.delete("/deleteTodo/:id", deleteTodo);

// view all - today - pending - completed - overDue - prioritized
todosRoutes.get("/viewTodos", viewTodos);
todosRoutes.get("/viewTodos/dueDate", dueDateTodos);
todosRoutes.get("/viewTodos/pending", pendingTodos);
todosRoutes.get("/viewTodos/completed", completedTodos);
todosRoutes.get("/viewTodos/overDued", overDuedTodos);
todosRoutes.get("/viewTodos/prioritized", prioritizedTodos);

// edit - complete
todosRoutes.patch("/pendTodo/:id", pendTodo);
todosRoutes.patch("/completeTodo/:id", completeTodo);

export default todosRoutes;
