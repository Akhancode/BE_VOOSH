const Task = require("../model/task.model.js");
const { saveTaskAndUpdateColumn } = require("../services/task.service.js");
// Create a new task
exports.createTask = async (req, res, next) => {
  try {
    const { title, description, reminder } = req.body;
    const taskData = {title,description,reminder}
    const userId = req.user.id
    const newTask = await saveTaskAndUpdateColumn(taskData,userId)
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

// Get all tasks for the authenticated user
exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// Update an existing task
exports.updateTask = async (req, res, next) => {
  try {
    const { title, description, reminder } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, reminder },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// Delete a task
exports.deleteTask = async (req, res, next) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    next(error);
  }
};
