import todosModel from "../../../models/todos.model.js";

const pendTodo = async (req, res) => {
  const { id } = req.params;

  if (!id) throw new Error("Todo ID is required");

  const pendedTodo = await todosModel.findByIdAndUpdate(
    id,
    { completed: false },
    { new: true, runValidators: true }
  );

  if (!pendedTodo) throw new Error("Todo does not exist");

  res.status(200).json({
    status: "success",
    message: "Todo marked as Pending successfully",
    data: pendedTodo,
  });
};

export default pendTodo;
