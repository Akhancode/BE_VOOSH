const express = require("express");
const router = express();

const authRoute = require("./auth.route");
const taskRoute = require("./task.route");
const userRoute = require("./user.route");
const columnRoute = require("./column.route");

const authMiddleware = require("../middleware/authMiddlware");



router.use("/api/task",authMiddleware,taskRoute);
router.use("/api/column",authMiddleware,columnRoute);
router.use("/api/user",authMiddleware,userRoute);

router.use("/api/auth",authRoute);

module.exports = router;
