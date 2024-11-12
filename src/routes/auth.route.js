const express = require("express");
const  authController = require("../controllers/auth.controller");

const router = express.Router();

router.post("/register", async (req, res, next) => {
    authController.register(req,res,next)
});
router.post("/login", async (req, res, next) => {
    authController.login(req,res,next)
});

module.exports = router;
