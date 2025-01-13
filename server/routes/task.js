const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/tasks");
const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  if (!authHeader) {
    console.log("Authorization header missing");
    return res.status(401).send("Access Denied");
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token) {
    console.log("Token missing");
    return res.status(401).send("Access Denied");
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    console.log("Invalid Token", err);
    res.status(400).send("Invalid Token");
  }
};

// Create a new task
router.post("/", verifyToken, async (req, res) => {
  const { name, description, priority, deadline, status } = req.body;
  const task = new Task({
    name,
    owner: req.user.email,
    description,
    priority,
    deadline,
    status,
  });

  try {
    const savedTask = await task.save();
    res.status(201).send(savedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all tasks
router.get("/", verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.email });
    res.status(200).send(tasks);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get a specific task
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.email,
    });
    if (!task) return res.status(404).send("Task not found");
    res.status(200).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update a task
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.email },
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).send("Task not found");
    res.status(200).send(updatedTask);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a task
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.email,
    });
    if (!deletedTask) return res.status(404).send("Task not found");
    res.status(200).send("Task deleted");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
