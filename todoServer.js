/**
  You need to create an express HTTP server in Node.js which will handle the logic of a todo list app.
  - Don't use any database, just store all the data in an array to store the todo list data (in-memory)
  - Hard todo: Try to save responses in files, so that even if u exit the app and run it again, the data remains (similar to databases)

  Each todo has a title and a description. The title is a string and the description is a string.
  Each todo should also get an unique autogenerated id every time it is created
  The expected API endpoints are defined below,
  1.GET /todos - Retrieve all todo items
    Description: Returns a list of all todo items.
    Response: 200 OK with an array of todo items in JSON format.
    Example: GET http://localhost:3000/todos
    
  2.GET /todos/:id - Retrieve a specific todo item by ID
    Description: Returns a specific todo item identified by its ID.
    Response: 200 OK with the todo item in JSON format if found, or 404 Not Found if not found.
    Example: GET http://localhost:3000/todos/123
    
  3. POST /todos - Create a new todo item
    Description: Creates a new todo item.
    Request Body: JSON object representing the todo item.
    Response: 201 Created with the ID of the created todo item in JSON format. eg: {id: 1}
    Example: POST http://localhost:3000/todos
    Request Body: { "title": "Buy groceries", "completed": false, description: "I should buy groceries" }
    
  4. PUT /todos/:id - Update an existing todo item by ID
    Description: Updates an existing todo item identified by its ID.
    Request Body: JSON object representing the updated todo item.
    Response: 200 OK if the todo item was found and updated, or 404 Not Found if not found.
    Example: PUT http://localhost:3000/todos/123
    Request Body: { "title": "Buy groceries", "completed": true }
    
  5. DELETE /todos/:id - Delete a todo item by ID
    Description: Deletes a todo item identified by its ID.
    Response: 200 OK if the todo item was found and deleted, or 404 Not Found if not found.
    Example: DELETE http://localhost:3000/todos/123

    - For any other route not defined in the server return 404

  Testing the server - run `npm run test-todoServer` command in terminal
 */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const todoList = require('./todo-list');
const todoTask = require('./todo-task');
const path = require('path');
const cors = require('cors');

const todoListInstance = new todoList();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

// Route and function that gets array containing all to do tasks.
app.get("/todos", (req, res) => {

  let todoList = todoListInstance.getAll();

  if(todoList){
    if(todoList.length === 0){
      res.status(200).send("To do list is empty");
    }else{
      res.status(200).json(todoList);
    }
  }else{
    res.status(404).send("No to do list found");
  }
});

app.get("/todos/:id", (req, res) => {
  let todoId = req.query.id;
  let todoTask = todoListInstance.get(todoId);

    if(todoTask){
      res.status(200).json(todoTask);
    }else{
      res.status(404).send("No such to do found");
    }
});

app.post("/todos", (req, res) => {
  let taskTitle = req.body.title;
  let taskDescription = req.body.description;

  if(taskTitle && taskDescription){
    let task = new todoTask(taskTitle, taskDescription);
    let response = todoListInstance.add(task);

    if(response.status){
      res.status(200).json(response.id);
    }else{
      res.status(500).send("Something went wrong");
    }
  }
});

app.put("/todos/:id", (req, res) => {
  let taskId = req.query.id;
  let taskTitle = req.body.title;
  let taskDescription = req.body.description;
  let taskCompleted = req.body.completed;

  if(taskId && taskTitle && taskDescription && taskCompleted){
    let matchIndex = todoListInstance.isExist(taskId);

    if(matchIndex === -1){
      res.status(404).send("No such to do found");
    }else{
        let task = {
          id: taskId,
          title: taskTitle,
          description: taskDescription,
          completed: taskCompleted
        };
        let response = todoListInstance.update(matchIndex, task);

        if(response){
          res.status(200).send(`To do item of id ${taskId} was found and updated`);
        }else{
          res.status(500).send("Something went wrong");
        }
    }
  }
});

app.delete("/todos/:id", (req, res) => {
  let taskId = parseInt(req.params.id);

  if(taskId){
    let matchIndex = todoListInstance.isExist(taskId);

    if(matchIndex === -1){
      res.status(404).send("No such to do found");
    }else{

      let response = todoListInstance.remove(matchIndex);

      if(response){
        res.status(200).send(`To do item of id ${taskId} was found and deleted`);
      }else{
        res.status(500).send("Something went wrong");
      }
    }
  }
});

// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
module.exports = app;
