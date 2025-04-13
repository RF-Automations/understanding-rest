# Creating a Simple Express Server for Todo Application

This guide shows how to create a basic Express server with API endpoints for a todo application.

## Setup

1. Create a new project folder:
```
mkdir todo-express-app
cd todo-express-app
```

2. Initialize a Node.js project:
```
npm init -y
```

3. Install Express:
```
npm install express
```

## Creating the Server

Create a file named `server.js`:

```javascript
const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// In-memory storage for todos
const todos = [
  { id: 1, text: 'Learn Express', completed: false },
  { id: 2, text: 'Build a todo API', completed: false }
];

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// GET a single todo by ID
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  res.json(todo);
});

// POST a new todo
app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({ message: 'Text is required' });
  }
  
  const newTodo = {
    id: todos.length + 1,
    text,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT (update) a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { text, completed } = req.body;
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  todos[todoIndex] = {
    ...todos[todoIndex],
    text: text || todos[todoIndex].text,
    completed: completed !== undefined ? completed : todos[todoIndex].completed
  };
  
  res.json(todos[todoIndex]);
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1);
  res.json(deletedTodo[0]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

## Running the Server

Start the server with:
```
node server.js
```

## API Endpoints

- `GET /api/todos`: Get all todos
- `GET /api/todos/:id`: Get a specific todo
- `POST /api/todos`: Create a new todo
- `PUT /api/todos/:id`: Update a todo
- `DELETE /api/todos/:id`: Delete a todo