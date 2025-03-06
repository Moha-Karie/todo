import todosModel from "../../../models/todos.model.js";

export const editTodo = async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  const { todoName, description, dueDate, completed, priority } = req.body;

  const validPriorities = ["high", "low", "medium", "not prioritized"];

  const normalizedPriority = priority ? priority.toLowerCase() : null;
  if (normalizedPriority && !validPriorities.includes(normalizedPriority)) {
    throw `Invalid priority value. Allowed values are: ${validPriorities.join(
      " - "
    )}`;
  }

  const updateFields = {
    ...(todoName && { todoName }),
    ...(description && { description }),
    ...(completed !== undefined && { completed }),
    ...(normalizedPriority && { priority: normalizedPriority }),
  };

  // Allow clearing `dueDate` by setting it to `null`
  if (dueDate !== undefined) {
    updateFields.dueDate = dueDate === "" ? null : dueDate;
  }

  const editedTodo = await todosModel.findByIdAndUpdate(
    id, // Use MongoDB _id
    { $set: updateFields }, // Use $set to ensure fields are updated properly
    { new: true, runValidators: true }
  );

  if (!editedTodo) throw "Todo does not exist";

  res.status(200).json({
    status: "Success",
    message: "Todo edited successfully",
    editedTodo,
  });
};

export default editTodo;
