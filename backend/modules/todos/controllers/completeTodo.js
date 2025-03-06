import todosModel from "../../../models/todos.model.js";

const completeTodo = async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Todo ID is required");

  const completedTodo = await todosModel.findByIdAndUpdate(
    id,
    { completed: true },
    { new: true, runValidators: true }
  );

  if (!completedTodo) throw new Error("Todo does not exist");

  res.status(200).json({
    status: "success",
    message: "Todo marked as completed successfully",
    data: completedTodo,
  });
};

export default completeTodo;
