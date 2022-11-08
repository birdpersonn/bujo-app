const express = require("express");
const router = express.Router();
const Task = require("../models/task");
const requiresAuth = require("../middleware/permissions");
const validateTaskInput = require("../validation/taskValidation");
const { translateAliases } = require("../models/User");

// @route       GET /api/tasks/test
// @desc        test tasks route
// @access      public
router.get("/test", (req, res) => {
  res.send("task route workin");
});

// @route       POST /api/tasks/new
// @desc        create new task
// @access      private
router.post("/new", requiresAuth, async (req, res) => {
  try {
    // check if task is valid
    const { isValid, errors } = validateTaskInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    // create new task
    const newTask = new Task({
      user: req.user._id,
      content: req.body.content,
      complete: false,
    });

    // save new task
    await newTask.save();

    return res.json(newTask);
  } catch (err) {
    console.log(err);

    return res.status(500).send(err.message);
  }
});

// @route       GET /api/tasks/current
// @desc        current users tasks
// @access      private
router.get("/current", requiresAuth, async (req, res) => {
  try {
    const completeTasks = await Task.find({
      user: req.user._id,
      complete: true,
    }).sort({ completedAt: -1 });

    const incompleteTasks = await Task.find({
      user: req.user._id,
      complete: false,
    }).sort({ createdAt: -1 });

    return res.json({ incomplete: incompleteTasks, complete: completeTasks });
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

// @route       PUT /api/tasks/:taskId/complete
// @desc        mark task as complete
// @access      private
router.put("/:taskId/complete", requiresAuth, async (req, res) => {
  try {
    const task = await Task.findOne({
      user: req.user._id,
      _id: req.params.taskId,
    });

    if (!task) {
      return res.status(404).json({ error: "could not find task" });
    }

    if (task.complete) {
      return res.status(400).json({ error: "task is already complete" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        user: req.user._id,
        task: req.params.taskId,
      },
      {
        complete: true,
        completedAt: new Date(),
      },
      {
        new: true,
      }
    );

    return res.json(updatedTask);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route       PUT /api/tasks/:taskId/incomplete
// @desc        mark task as incomplete
// @access      private
router.put("/:taskId/incomplete", requiresAuth, async (req, res) => {
  try {
    const task = await Task.findOne({
      user: req.user._id,
      _id: req.params.taskId,
    });

    if (!task) {
      return res.status(404).json({ error: "could not find task" });
    }

    if (!task.complete) {
      return res.status(400).json({ error: "task is already incomplete" });
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        user: req.user._id,
        task: req.params.taskId,
      },
      {
        complete: false,
        completedAt: null,
      },
      {
        new: true,
      }
    );

    return res.json(updatedTask);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route       PUT /api/tasks/:taskId
// @desc        update a task
// @access      private
router.put("/:taskId", requiresAuth, async (req, res) => {
  try {
    const task = await Task.findOne({
      user: req.user._id,
      _id: req.params.taskId,
    });

    if (!task) {
      return res.status(404).json({ error: "could not find task" });
    }

    const { isValid, errors } = validateTaskInput(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }

    const updatedTask = await Task.findOneAndUpdate(
      {
        user: req.user._id,
        _id: req.params.taskId,
      },
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    return res.json(updatedTask);
  } catch {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// @route       DELETE /api/tasks/:taskId
// @desc        delete a task
// @access      private
router.delete("/:taskId", requiresAuth, async (req, res) => {
  try {
    const task = await Task.findOne({
      user: req.user._id,
      _id: req.params.taskId,
    });

    if (!task) {
      return res.status(404).json({ error: "task not found" });
    }

    await Task.findOneAndRemove({
      user: req.user._id,
      _id: req.params.taskId,
    });

    return res.json({ success: true });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

module.exports = router;
