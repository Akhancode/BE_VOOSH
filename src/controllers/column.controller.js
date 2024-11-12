const Column = require("../model/columns.model");
const { saveColumn } = require("../services/column.service");

exports.createColumn = async (req, res, next) => {
  try {
    const { col_todo, col_inProgress, col_Done } = req.body;

    const newColumn = await saveColumn(
      col_todo,
      col_inProgress,
      col_Done,
      req.user.id
    );

    res.status(201).json(newColumn);
  } catch (error) {
    next(error);
  }
};

exports.getColumns = async (req, res, next) => {
  try {
    const columns = await Column.findOne({ user: req.user.id });
    res.json(columns);
  } catch (error) {
    next(error);
  }
};

exports.updateColumn = async (req, res, next) => {
  try {
    const { col_todo, col_inProgress, col_Done } = req.body;

    const updatedColumn = await Column.findByIdAndUpdate(
      req.params.id,
      {
        col_todo: col_todo || [],
        col_inProgress: col_inProgress || [],
        col_Done: col_Done || [],
      },
      { new: true }
    );

    if (!updatedColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.json(updatedColumn);
  } catch (error) {
    next(error);
  }
};

exports.patchColumn = async (req, res, next) => {
  try {
    const { col_todo, col_inProgress, col_Done } = req.body;

    const updatedColumn = await Column.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          col_todo: col_todo || undefined,
          col_inProgress: col_inProgress || undefined,
          col_Done: col_Done || undefined,
        },
      },
      { new: true }
    );

    if (!updatedColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.json(updatedColumn);
  } catch (error) {
    next(error);
  }
};
exports.patchColumnByUserId = async (req, res, next) => {
  try {
    const { col_todo, col_inProgress, col_Done } = req.body;
    console.log(req.body)
    const updatedColumn = await Column.findOneAndUpdate(
      { user: req.user.id },
      {
        $set: {
          col_todo: col_todo || undefined,
          col_inProgress: col_inProgress || undefined,
          col_Done: col_Done || undefined,
        },
      },
      { new: true }
    );

    if (!updatedColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.json(updatedColumn);
  } catch (error) {
    next(error);
  }
};

exports.deleteColumn = async (req, res, next) => {
  try {
    const deletedColumn = await Column.findByIdAndDelete(req.params.id);

    if (!deletedColumn) {
      return res.status(404).json({ message: "Column not found" });
    }

    res.json({ message: "Column deleted successfully" });
  } catch (error) {
    next(error);
  }
};
