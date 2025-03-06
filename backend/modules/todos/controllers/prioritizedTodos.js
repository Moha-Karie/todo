import todosModel from "../../../models/todos.model.js";

export const prioritizedTodos = async (req, res) => {
  const userId = req.user._id;

  // page and limit
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit) || 4;

  // skip value
  const skip = (page - 1) * limit;

  const prioritized = await todosModel
    .find({
      userId,
      priority: { $in: ["High", "Low", "Medium"] },
    })
    .skip(skip)
    .limit(limit)
    .sort({
      createdAt: -1,
    });

  const todalPrioritizedTodos = await todosModel.countDocuments({
    userId,
    priority: { $in: ["High", "Low", "Meduim"] },
  });

  // success response
  res.status(200).json({
    status: "Success",
    todalPrioritizedTodos: todalPrioritizedTodos,
    totalPages: Math.ceil(todalPrioritizedTodos / limit),
    currentPage: page,
    todos: prioritized,
  });
};
