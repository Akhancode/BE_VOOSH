const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/user.model");
const { CustomError } = require("../utils/errors/error");
const {
  validateEmail,
  validatePassword,
} = require("../utils/validators/validators");
const { saveColumn } = require("../services/column.service");
const Column = require("../model/columns.model");

// Register a new user
exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      throw new CustomError("Mandatory fields are missing ", 400);
    }
    if (!validateEmail(email)) {
      throw new CustomError("Invalid email ! ", 400);
    }
    const existingUser = await User.findOne({ email });
    console.log(existingUser);
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();
    let column = await Column.findOne({ user: newUser._id });
    console.log(column)
    const newColumn = new Column({user:newUser._id})
    await newColumn.save()
    const token = jwt.sign({ id: newUser._id, email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ accessToken: token });
  } catch (error) {
    next(error);
  }
};

// Login a user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!email || !password) {
      throw new CustomError("Mandatory fields are missing ", 400);
    }
    if (!validateEmail(email)) {
      throw new CustomError("Invalid email ! ", 400);
    }
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
    const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.json({ accessToken: token });
  } catch (error) {
    next(error);
  }
};
