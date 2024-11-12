const Column = require("../model/columns.model");
const Task = require("../model/task.model");

const saveTaskAndUpdateColumn = async (taskData, userId) => {
  const { title, description, reminder } = taskData;

  const newTask = new Task({
    title,
    description,
    reminder,
    user: userId,
  });

  await newTask.save();

  const column = await Column.findOne({ user: userId });
  //adding todo
  if (column) {
    column.col_todo.push(newTask._id);
    await column.save();
  }

  return newTask;
};
const deleteTaskAndUpdateColumn = async (taskId, userId) => {
    // Find and delete the task
    const taskToDelete = await Task.findByIdAndDelete(taskId);
    
    if (!taskToDelete) {
      throw new Error("Task not found");
    }
  
    // Find the column associated with the user
    const column = await Column.findOne({ user: userId });
    
    if (column) {
      // Remove the task ID from col_todo array
      column.col_todo = column.col_todo.filter(id => id.toString() !== taskId.toString());
      column.col_inProgress = column.col_inProgress.filter(id => id.toString() !== taskId.toString());
      column.col_Done = column.col_Done.filter(id => id.toString() !== taskId.toString());
      await column.save();
    }
  
    return { message: "Task deleted and column updated" };
  };
  

module.exports = { saveTaskAndUpdateColumn,deleteTaskAndUpdateColumn };
