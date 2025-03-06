import todosModel from "../../../models/todos.model.js";

export const dueDateTodos = async (req, res) => {
  // user
  const userId = req.user._id;

  // page and limit for pagination
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  // calculating the skip value
  const skip = (page - 1) * limit;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dueDateTodos = await todosModel
    .find({
      userId,
      completed: false,
      dueDate: {
        $gte: today,
        $lt: tomorrow,
        $ne: null,
      },
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalDueDateTodos = await todosModel.countDocuments({
    userId,
    completed: false,
    dueDate: {
      $gte: today,
      $lt: tomorrow,
      $ne: null,
    },
  });

  // success response
  res.status(200).json({
    status: "Success",
    message: "dueDate Todos Are in here!",
    currentPage: page,
    totalPages: Math.ceil(totalDueDateTodos / limit),
    todos: dueDateTodos,
  });
};
