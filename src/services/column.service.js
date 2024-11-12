const Column = require("../model/columns.model");

const saveColumn = async (col_todo, col_inProgress, col_Done, userId) => {
    const newColumn = new Column({
      col_todo: col_todo || [],
      col_inProgress: col_inProgress || [],
      col_Done: col_Done || [],
      user: userId,
    });
  
    return await newColumn.save();
  };
  

  module.exports = {saveColumn}