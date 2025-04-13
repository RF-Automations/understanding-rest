## What is Express?

Express is a lightweight web application framework for Node.js. It helps you build web applications and APIs (Application Programming Interfaces) easily. Think of it as a toolbox that makes creating web servers much simpler.

## Understanding Our Server Code

Let's break down the `server.js` file:

### Setting Up

```javascript
const express = require('express');
const app = express();
const PORT = 3000;
```

- `require('express')` imports the Express framework into our application
- `express()` creates a new Express application and stores it in the `app` variable
- `PORT = 3000` defines which port number our server will listen on (like an apartment number for our application)

### Middleware

```javascript
app.use(express.json());
```

- Middleware is code that runs between receiving a request and sending a response
- `express.json()` is middleware that automatically converts incoming JSON data from requests into JavaScript objects that we can work with

### Data Storage

```javascript
const todos = [
  { id: 1, text: 'Learn Express', completed: false },
  { id: 2, text: 'Build a todo API', completed: false }
];
```

- This creates an array to store our todo items
- In a real application, you would use a database instead of an array
- Each todo has three properties: `id`, `text`, and `completed`

### API Endpoints (Routes)

#### 1. Get All Todos

```javascript
app.get('/api/todos', (req, res) => {
  res.json(todos);
});
```

- `app.get` defines a route that responds to GET requests (for retrieving data)
- `/api/todos` is the URL path where this route is available
- `(req, res) => { ... }` is a callback function that runs when someone visits this route
  - `req` (request) contains information about the incoming request
  - `res` (response) is used to send data back to the client
- `res.json(todos)` sends our todos array back as JSON data

#### 2. Get a Single Todo

```javascript
app.get('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(todo => todo.id === id);
  
  if (!todo) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  res.json(todo);
});
```

- `:id` in the path is a parameter (variable part of the URL)
- `req.params.id` extracts the ID from the URL
- `parseInt()` converts the ID from a string to a number
- `todos.find()` searches our array for a todo with a matching ID
- If no todo is found, we return a 404 status (not found) and an error message
- Otherwise, we return the found todo item

#### 3. Create a New Todo

```javascript
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
```

- `app.post` defines a route that responds to POST requests (for creating data)
- `req.body` contains data sent in the request body (thanks to our `express.json()` middleware)
- `{ text } = req.body` extracts the `text` property from the request body
- We check if text is provided, returning an error if it's not
- We create a new todo object with a generated ID, the provided text, and set it as not completed
- `todos.push()` adds the new todo to our array
- `res.status(201)` sets the response status to 201 (Created)
- We return the newly created todo to the client

#### 4. Update a Todo

```javascript
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
```

- `app.put` defines a route that responds to PUT requests (for updating data)
- We find the position (index) of the todo in our array
- If no todo is found (index is -1), we return a 404 error
- `...todos[todoIndex]` copies all properties of the existing todo
- We then update either or both of the `text` and `completed` properties if they were provided
- We send back the updated todo

#### 5. Delete a Todo

```javascript
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todoIndex = todos.findIndex(todo => todo.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ message: 'Todo not found' });
  }
  
  const deletedTodo = todos.splice(todoIndex, 1);
  res.json(deletedTodo[0]);
});
```

- `app.delete` defines a route that responds to DELETE requests
- We find the position of the todo in our array
- If no todo is found, we return a 404 error
- `todos.splice()` removes the todo from our array and returns the removed item(s)
- We send back the deleted todo

### Starting the Server

```javascript
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

- `app.listen` starts the server on the specified port
- The callback function runs when the server successfully starts
- The console message helps confirm the server is running and shows its address

## HTTP Methods Explained

Our API uses different HTTP methods for different operations:

- **GET**: Retrieve data (like viewing todos)
- **POST**: Create new data (like adding a new todo)
- **PUT**: Update existing data (like modifying a todo)
- **DELETE**: Remove data (like removing a todo)

## How to Use This API

To interact with this API, you can use tools like:

1. A web browser (for GET requests only)
2. Command line tools like curl
3. API testing tools like Postman
4. JavaScript code in a web application

Example using curl:

```
# Get all todos
curl http://localhost:3000/api/todos

# Create a new todo
curl -X POST -H "Content-Type: application/json" -d '{"text":"Buy groceries"}' http://localhost:3000/api/todos

# Update a todo (mark as completed)
curl -X PUT -H "Content-Type: application/json" -d '{"completed":true}' http://localhost:3000/api/todos/1

# Delete a todo
curl -X DELETE http://localhost:3000/api/todos/2
```

## Common Terms

- **API**: Application Programming Interface - a set of rules that allows different software applications to communicate with each other
- **Endpoint**: A specific URL where an API can be accessed (like `/api/todos`)
- **JSON**: JavaScript Object Notation - a lightweight data format that's easy for humans to read and write and for machines to parse
- **HTTP Status Codes**: Numbers that indicate the result of a request
  - 200: OK (successful)
  - 201: Created (successful creation)
  - 400: Bad Request (client error)
  - 404: Not Found
  - 500: Server Error