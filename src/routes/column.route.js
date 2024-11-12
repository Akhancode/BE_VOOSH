const express = require("express");
const router = express.Router();
const columnController = require("../controllers/column.controller");
// router.get("/", getHabits);
router.get("/", columnController.getColumns);
router.get("/board", columnController.getColumnsBoard);

router.post("/", columnController.createColumn);

router.patch("/edit", columnController.patchColumnByUserId);
router.put("/:id", columnController.updateColumn);
router.patch("/:id", columnController.patchColumn);
//req user id-

router.delete("/:id", columnController.deleteColumn);

module.exports = router;
