import todosModel from "../../../models/todos.model.js";

const viewTodos = async (req, res) => {
  const userId = req.user._id;

  // Get page and limit from query params (with default values)
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 4;

  // Calculate the skip value based on page and limit
  const skip = (page - 1) * limit;

  // console.log(page, limit)

  try {
    // const todoss = await todosModel.find();
    const todos = await todosModel
      .find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalTodos = await todosModel.countDocuments({ userId });

    res.status(200).json({
      status: "success",
      totalTodos: totalTodos,
      totalPages: Math.ceil(totalTodos / limit), // Calculate total pages
      currentPage: page,
      todos: todos,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add your other controller functions below

export default viewTodos;
