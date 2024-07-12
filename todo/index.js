const express=require('express');
const app=express();
const fs=require('fs');
const cors=require('cors');
app.use(cors());
app.use(express.json());
app.post('/todos',(req,res)=>{
   const todo={
    id:Date.now(),
    title:req.body.title,

    description:req.body.description,
   }
   
   fs.readFile('./todos.json',(err,data)=>{
    if(err) throw err;
    const todos=JSON.parse(data);
    todos.push(todo);

    fs.writeFile('./todos.json', JSON.stringify(todos, null, 2), (writeError) => {
     if (writeError) {
         return res.status(500).send('Failed to write to file');
     } else {
         console.log(todo);
         return res.status(200).json(todo);
     }
 });
   })
   
   
})
app.get('/todos',(req,res)=>{
    fs.readFile('todos.json',(error,data)=>{
        if(error) throw error;
        else{
            const todos=JSON.parse(data);
            res.json(todos);

        }
    })
})
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // Parse the id to an integer
    console.log(id);
    fs.readFile('./todos.json', (error, data) => {
        if (error) throw error;
        let todos = JSON.parse(data);
        todos = todos.filter(todo => todo.id !== id);
        fs.writeFile('./todos.json', JSON.stringify(todos, null, 2), (err) => {
            if (err) throw err;
            else {
                res.status(200).send('item deleted');
            }
        });
    });
});
app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})