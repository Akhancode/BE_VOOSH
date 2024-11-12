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
exports.getColumnsBoard = async (req, res, next) => {
  try {
    const columns = await Column.aggregate([
      {
        $lookup: {
          from: "tasks",
          let: {
            userId: "$user",
          },
          pipeline: [
            {
              $group: {
                _id: null,
                allDocs: {
                  $push: {
                    k: {
                      $toString: "$_id",
                    },
                    v: "$$ROOT",
                  },
                },
              },
            },
            {
              $replaceRoot: {
                newRoot: {
                  $arrayToObject: "$allDocs",
                },
              },
            },
          ],
          as: "tasks",
        },
      },
      {
        $unwind: {
          path: "$tasks",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          columns: {
            col_Done: "$col_Done",
            col_inProgress: "$col_inProgress",
            col_todo: "$col_todo",
          },
        },
      },
      {
        $project: {
          columns: 1,
          tasks: 1,
          user: 1,
        },
      },
    ]);
    res.json(columns[0]||{});
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
    console.log(req.body);
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
