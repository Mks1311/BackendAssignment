const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// In-memory storage for tasks
let tasks = [];

// Middleware
app.use(bodyParser.json());

// API Documentation
app.get('/api-docs', (req, res) => {
  res.json({
    "/tasks": {
      "GET": "Get a list of all tasks",
      "POST": "Create a new task (requires title and description in body)"
    },
    "/tasks/:id": {
      "GET": "Get a specific task by ID",
      "PUT": "Update an existing task by ID (requires title and/or description in body)",
      "DELETE": "Delete a task by ID"
    }
  });
});

// Get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Get a task by ID
app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const task = tasks.find(task => task.id === id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});

// Create a new task
app.post('/tasks', (req, res) => {
  const { title, description } = req.body;

  // Basic validation
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const newTask = {
    id: Math.random().toString(36).substring(2, 15), // Generate random ID
    title,
    description,
  };

  tasks.push(newTask);
  res.status(201).json(newTask); 
});

// Update a task by ID
app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { title, description } = req.body;

  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  const updatedTask = { ...tasks[taskIndex], title, description };
  tasks[taskIndex] = updatedTask;
  res.json(updatedTask);
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.status(200).json(); // No content (204) on successful deletion
});

// Error handler 
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(400).json({ message: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
