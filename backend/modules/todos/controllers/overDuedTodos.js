import todosModel from "../../../models/todos.model.js";

export const overDuedTodos = async (req, res) => {
  // user id
  const userId = req.user._id;

  // page and limit
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  // calculating the skip
  const skip = (page - 1) * limit;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const overDuedTodos = await todosModel
    .find({
      userId,
      completed: false,
      dueDate: { $lt: startOfToday, $ne: null },
    })
    .skip(skip)
    .limit(limit)
    .sort({ dueDate: 1 });

  const totalOverDue = await todosModel.countDocuments({
    userId,
    completed: false,
    dueDate: {
      $lt: startOfToday,
      $ne: null,
    },
  });

  // success response
  res.status(200).json({
    status: "success",
    message: "OverDue Todos",
    currentPage: page,
    totalPages: Math.ceil(totalOverDue / limit),
    todos: overDuedTodos,
  });
};
