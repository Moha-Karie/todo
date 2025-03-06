import todosModel from "../../../models/todos.model.js";

export const addTodos = async (req, res) => {
  const userId = req.user._id;

  if (!userId) throw "User not found!";

  const { todoName, description, dueDate, completed, priority } = req.body;

  const validPriorities = ["high", "low", "medium", "not prioritized"];

  const normalizedPriority = priority ? priority.toLowerCase() : null;

  // Validations:
  if (!todoName) throw "todoName is required!";
  if (!description) throw "todo Description is required!";
  if (normalizedPriority && !validPriorities.includes(normalizedPriority))
    throw `Invalid priority value. Allowed values are: ${validPriorities.join(
      " - "
    )}`;

  // Checking for duplicate todoName
  const duplicateTodoName = await todosModel.findOne({
    userId,
    todoName: todoName,
  });

  if (duplicateTodoName)
    throw "Todo Name already exists, Please use a different Todo Name!";

  const addedTodo = await todosModel.create({
    todoName: todoName,
    description: description,
    priority: normalizedPriority,
    dueDate: dueDate,
    completed: completed,
    userId: userId,
  });

  // Success response
  res.status(200).json({
    status: "Success",
    message: "Todo added successfully!",
    addedTodo: addedTodo,
  });
};
