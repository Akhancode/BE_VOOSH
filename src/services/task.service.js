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

module.exports = { saveTaskAndUpdateColumn };
