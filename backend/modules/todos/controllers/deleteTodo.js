import mongoose from "mongoose";
// import todosModel from "../../../models/todos.model.js";
const deleteTodo = async (req, res) => {
  const todosModel = mongoose.model("todos");
  const { id } = req.params;

  const todo = await todosModel.findByIdAndDelete(id);

  if (!todo) throw "ToDo does not exists!";

  res.status(200).json({
    status: "Success",
    message: "Todo deleted succesfully!",
  });
};

export default deleteTodo;