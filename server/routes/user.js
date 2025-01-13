const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).send("User with given email already exists");
    }

    const salt = await bcrypt.genSalt(Number(process.env.JWT_SECRET_KEY));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({ ...req.body, password: hashedPassword });
    await newUser.save();

    res.status(201).send({ user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
});

module.exports = router;
