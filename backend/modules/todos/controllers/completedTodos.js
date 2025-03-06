import todosModel from "../../../models/todos.model.js";

const completedTodosCount = async (req, res) => {
  const userId = req.user._id;

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  const skip = (page - 1) * limit;

  const completed = await todosModel
    .find({
      userId,
      completed: true,
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  if (completed.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No completed Todos found.",
      todos: [],
    });
  }

  const totalCompleted = await todosModel.countDocuments({
    userId,
    completed: true,
  });

  res.status(200).json({
    status: "success",
    totalCompleted: totalCompleted,
    totalPages: Math.ceil(totalCompleted / limit),
    currentPage: page,
    todos: completed,
  });
};

export default completedTodosCount;
