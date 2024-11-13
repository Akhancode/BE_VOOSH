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
const { default: axios } = require("axios");
const { saveTaskAndUpdateColumn } = require("../services/task.service");

// Register a new user
exports.register = async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    if (req.body.googleAccessToken) {
      const { googleAccessToken } = req.body;

      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        })
        .then(async (response) => {
          const firstName = response.data.given_name;
          const lastName = response.data.family_name;
          const email = response.data.email;
          const avatar = response.data.picture;

          const existingUser = await User.findOne({ email });

          if (existingUser)
            return res.status(400).json({ message: "User already exist!" });

          const newUser = new User({
            email,
            firstName,
            lastName,
            avatar,
          });
          await newUser.save();
          const newColumn = new Column({ user: newUser._id });
          await newColumn.save();
          //adding sample tasks
          await saveTaskAndUpdateColumn(
            {
              title: "Daily Morning Walk",
              description:
                "Starting your day with a 30-minute walk boosts mood, energy levels, and improves cardiovascular health.",
            },
            newUser._id
          );
          await saveTaskAndUpdateColumn(
            {
              title: "Stay Hydrated",
              description:
                "Aim to drink at least 8 glasses of water daily to support digestion, skin health, and energy levels.",
            },
            newUser._id
          );
          const token = jwt.sign(
            { id: newUser._id, email },
            process.env.JWT_SECRET,
            {
              expiresIn: "1d",
            }
          );

          res.status(200).json({ accessToken: token });
        })
        .catch((err) => {
          console.log(err);
          throw { message: "Invalid access token!" };
        });
    } else {
      if (!email || !password) {
        throw new CustomError("Mandatory fields are missing ", 400);
      }
      if (!validateEmail(email)) {
        throw new CustomError("Invalid email ! ", 400);
      }
      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ msg: "User already exists" });

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
      });
      await newUser.save();
      const newColumn = new Column({ user: newUser._id });
      await newColumn.save();
      //adding sample tasks
      await saveTaskAndUpdateColumn(
        {
          title: "Daily Morning Walk",
          description:
            "Starting your day with a 30-minute walk boosts mood, energy levels, and improves cardiovascular health.",
        },
        newUser._id
      );
      await saveTaskAndUpdateColumn(
        {
          title: "Stay Hydrated",
          description:
            "Aim to drink at least 8 glasses of water daily to support digestion, skin health, and energy levels.",
        },
        newUser._id
      );
      const token = jwt.sign(
        { id: newUser._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      res.json({ accessToken: token });
    }
  } catch (error) {
    next(error);
  }
};

// Login a user
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    if (req.body.googleAccessToken) {
      // gogole-auth
      const { googleAccessToken } = req.body;

      axios
        .get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${googleAccessToken}`,
          },
        })
        .then(async (response) => {
          const firstName = response.data.given_name;
          const lastName = response.data.family_name;
          const email = response.data.email;
          const avatar = response.data.picture;

          const existingUser = await User.findOne({ email });

          if (!existingUser) {
            const newUser = new User({
              email,
              firstName,
              lastName,
              avatar,
            });
            await newUser.save();
            const newColumn = new Column({ user: newUser._id });
            await newColumn.save();
            //adding sample tasks
            await saveTaskAndUpdateColumn(
              {
                title: "Daily Morning Walk",
                description:
                  "Starting your day with a 30-minute walk boosts mood, energy levels, and improves cardiovascular health.",
              },
              newUser._id
            );
            await saveTaskAndUpdateColumn(
              {
                title: "Stay Hydrated",
                description:
                  "Aim to drink at least 8 glasses of water daily to support digestion, skin health, and energy levels.",
              },
              newUser._id
            );
            const token = jwt.sign(
              { id: newUser._id, email },
              process.env.JWT_SECRET,
              {
                expiresIn: "1d",
              }
            );

            res.status(200).json({ accessToken: token });
          } else {
            const token = jwt.sign(
              {
                email: existingUser.email,
                id: existingUser._id,
              },
              process.env.JWT_SECRET,
              { expiresIn: "1d" }
            );
            res.json({ accessToken: token, existingUser });
          }
        })
        .catch((err) => {
          // res.status(400).json({ message: "Invalid access token!" });
          console.log(err);
          next(err);
        });
    } else {
      const user = await User.findOne({ email });
      if (!email || !password) {
        throw new CustomError("Mandatory fields are missing ", 400);
      }
      if (!validateEmail(email)) {
        throw new CustomError("Invalid email ! ", 400);
      }
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      if (!user.password)
        throw new CustomError("No password Set for this account", 400);
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
      const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({ accessToken: token });
    }
  } catch (error) {
    next(error);
  }
};
