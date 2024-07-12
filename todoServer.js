const express = require("express");
const app = express();
const fs = require('fs');
const port = 3000;
const bodyParser = require("body-parser");
const path = require('path');
const { title } = require("process");
app.use(bodyParser.json());
const todolist = [
    {
        id: 1,
        title: "task1",
        description: "this is task1"
    },
    {
        id: 2,
        title: "task2",
        description: "this is task2",
    }
]
app.post("/todos", (req, res) => {

    const newTodo = {
        id: todolist.length + 1,
        title: req.body.title,
        description: req.body.description,
    }
    todolist.push(newTodo);
    res.send(newTodo);
})
app.get("/todos", (req, res) => {
    res.status(200).json(todolist);
})
app.get("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id);
    var todo = todolist.find(todo => todo.id === id);
    if (todo) {
        res.status(200).json(todo);
    } else {
        res.status(404).send("Todo item not found");
    }
})

app.put("/todos/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    var todo = todolist.find(todo => todo.id === id);
        if(todo){
             todo.title=req.body.title;
            res.send(todo);
        }
        else{
            res.status(404).send("not found");
        }
});

app.delete("/todos/:id",(req,res)=>{
    const id = req.params.id;
    var todo=todolist.findIndex(todo => todo.id === id);
    if(todo){
        const deleted=todolist.splice(todo,1);
        res.send(deleted);
    }
    else{
        res.status(404).send("not found");
    }
})


app.listen(port, () => {
    console.log("server is running on port " + port);
})