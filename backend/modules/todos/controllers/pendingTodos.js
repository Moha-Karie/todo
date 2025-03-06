import todosModel from "../../../models/todos.model.js";

const pendingTodos = async (req, res) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  const skip = (page - 1) * limit;

  const pending = await todosModel
    .find({
      userId,
      completed: false,
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (pending.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No pending Todos found.",
      todos: [],
    });
  }

  const totalPending = await todosModel.countDocuments({ userId, completed: false });

  res.status(200).json({
    status: "success",
    totalPending: pending.length,
    totalPages: Math.ceil(totalPending / limit),
    currentPage: page,
    todos: pending,
  });
};


export default pendingTodos