// We are importing data/code from the libraies we are using.
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory database/variable
let tasks = [
  {
    id: 1,
    title: "Complete project proposal",
    completed: false,
    createdAt: new Date(),
  },
  { id: 2, title: "Buy groceries", completed: true, createdAt: new Date() },
  {
    id: 3,
    title: "Schedule dentist appointment",
    completed: false,
    createdAt: new Date(),
  },
];

// Get all tasks
app.get("/api/tasks", (req, res) => {
  return res.json(tasks);
});

// Get a single task
app.get("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);

  if (!taskId) {
    res
      .status(404)
      .json({
        message: "Task Id need to fetch the data.",
        error: "Full Fledge",
      });
  }

  const task = tasks.find((task) => task.id === taskId);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.json(task).status(200);
});

// Create a new task
app.post("/api/tasks", (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Task title is required" });
  }

  const newTask = {
    id: tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1,
    title,
    completed: false,
    createdAt: new Date(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Update a task
app.put("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, completed } = req.body;
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title !== undefined ? title : tasks[taskIndex].title,
    completed: completed !== undefined ? completed : tasks[taskIndex].completed,
  };

  res.json(tasks[taskIndex]);
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  const deletedTask = tasks[taskIndex];
  tasks = tasks.filter((task) => task.id !== taskId);

  res.json(deletedTask);
});

// Toggle task completion status
app.patch("/api/tasks/:id/toggle", (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "Task not found" });
  }

  tasks[taskIndex].completed = !tasks[taskIndex].completed;

  res.json(tasks[taskIndex]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
