import todosModel from "../../../models/todos.model.js";

const userDashboard = async (req, res) => {
  // Extract the user ID from the request (from JWT token)
  const userId = req.user._id;

  // Get the counts for the user's todos
  const totalTodosCount = await todosModel.countDocuments({ userId });
  const completedTodosCount = await todosModel.countDocuments({
    userId,
    completed: true,
  });
  const pendingTodosCount = await todosModel.countDocuments({
    userId,
    completed: false,
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dueDateTodosCount = await todosModel.countDocuments({
    userId,
    completed: false,
    dueDate: {
      $gte: today,
      $lt: tomorrow,
      $ne: null,
    },
  });
  const overdueTodosCount = await todosModel.countDocuments({
    userId,
    completed: false,
    dueDate: { $lt: today, $ne: null },
  });

  const prioritizedTodosCount = await todosModel.countDocuments({
    userId,
    priority: { $in: ["High", "Low", "Medium"] },
  });

  // Respond with the counts including overdue todos
  res.status(200).json({
    status: "Success",
    todosStats: {
      totalTodosCount,
      completedTodosCount,
      pendingTodosCount,
      overdueTodosCount,
      dueDateTodosCount,
      prioritizedTodosCount,
    },
  });
};

export default userDashboard;
