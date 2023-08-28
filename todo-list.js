/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
  - `npm run test-todo-list`
*/
const fs = require('fs');

class TodoList{

    constructor() {
        this.todoList = [];
        this.idCount = 1;
        this.readFromFile();
    }
    add(todo){
        let task = {
            id: this.idCount,
            title: todo.title,
            description: todo.description,
            completed: false
        }
        let success = this.todoList.push(task);
        this.writeToFile();

        if(success){
            return {
                id: this.idCount++,
                status: true
            }
        }else{
            return {
                id: -1,
                status: false
            }
        }
    }

    remove(indexOfTodo){
        if (indexOfTodo >= 0 && indexOfTodo < this.todoList.length) {
            this.todoList.splice(indexOfTodo, 1);
            this.writeToFile();

            return true;
        }else{

            return false;
        }
    }

    update(index, updatedTodo){
        if (index >= 0 && index < this.todoList.length){
            this.todoList[index] = updatedTodo;
            this.writeToFile();

            return true;

        }else{

            return false;
        }
    }

    getAll(){
        return this.todoList;
    }

    get(indexOfTodo){
        if (indexOfTodo >= 0 && indexOfTodo < this.todoList.length){
            return this.todoList[indexOfTodo];
        }else{
            return false;
        }
    }

    isExist(taskId){
        const matchedIndex = this.todoList.findIndex(task => {
            return task.id === taskId;
        });

        if(matchedIndex === -1){
            return -1;
        }else{
            return matchedIndex;
        }
    }

    clear(){
        this.todoList = [];
        this.writeToFile();
    }

    readFromFile() {
        let fileName = "todo.json";
        fs.readFile(fileName, "utf8", (err, data) => {
            if(err){
                console.error("Error reading file: ", err);
            }else{
                if(data){
                    this.todoList = JSON.parse(data);
                    console.log("Read data from the file: ", this.todoList);

                    this.todoList.forEach((task) => {
                        if(task.id > this.idCount){
                            this.idCount = task.id;
                        }
                    });
                    this.idCount++;
                }else{
                    console.log("todo.json is empty ");
                }
            }
        });
    }

    writeToFile(){
        let jsonData = JSON.stringify(this.todoList);
        let fileName = "todo.json";

        fs.writeFile(fileName, jsonData, "utf8", (err) => {
            if(err){
                console.error("Error writing to file: ", err);
            }else{
                console.log("Data has been written to the file successfully.");
            }
        })
    }
}

module.exports = TodoList;