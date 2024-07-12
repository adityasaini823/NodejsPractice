const fs=require('fs');
const path=require('path');
const express=require('express');
const app=express();
const port=3000;
const bodyParser=require('body-parser');

// const cors=require('cors');


// app.use(cors());

app.use(bodyParser.json());

app.post('/create', (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        return res.status(400).send('Title and description are required');
    }

    const newTodo = {
        id: Math.floor(Math.random() * 100000),
        title,
        description
    };

    fs.readFile('./file-solution/todos.json', 'utf-8', (error, data) => {
        if (error) {
            if (error.code === 'ENOENT') {
                // File does not exist, create a new one with the new todo
                const todos = [newTodo];
                fs.writeFile('./file-solution/todos.json', JSON.stringify(todos, null, 2), (writeError) => {
                    if (writeError) {
                        return res.status(500).send('Failed to write to file');
                    } else {
                        console.log(newTodo);
                        return res.status(200).json(newTodo);
                    }
                });
            } else {
                return res.status(500).send('Failed to read file');
            }
        } else {
            let todos;
            try {
                todos = JSON.parse(data);
            } catch (parseError) {
                return res.status(500).send('Error parsing JSON file');
            }

            todos.push(newTodo);

            fs.writeFile('./file-solution/todos.json', JSON.stringify(todos, null, 2), (writeError) => {
                if (writeError) {
                    return res.status(500).send('Failed to write to file');
                } else {
                    console.log(newTodo);
                    return res.status(200).json(newTodo);
                }
            });
        }
    });
});
app.put('/:id',(req,res)=>{
    const id=req.params.id;
    fs.readFile('./file-solution/todos.json','utf-8',(err,data)=>{
        if(err)throw error;
        else{
            const todos=JSON.parse(data);
            for(var i=0;i<todos.length;i++){
                if(todos[i].id==id){
                    todos[i].title=req.body.title;
                    todos[i].description=req.body.description;
                }
            }
            fs.writeFile('./file-solution/todos.json',JSON.stringify(todos),(err)=>{
                if(err)throw error;
                else{
                    console.log(todos[i]);
                    res.status(200).json(todos[i]);

                }
            })
        }
    })
})



// to show the total files
app.get('/todos',(req,res)=>{
    fs.readFile('./file-solution/todos.json',(error,data) =>{
        if(error) throw error;
        else{
            console.log(JSON.parse(data));
            res.status(200).json(data);
            
        }
    })
})
// to show the  files data 
app.get('/files/:filename',(req,res)=>{
    const filePath = './files/' + req.params.filename;
    fs.readFile(filePath,(error,data)=>{
        if(error){
            res.status(404).send('File not found');
        }
        else{
            res.status(200).json(data);
        }
    })
})
// app.get('/',(req,res)=>{
//     res.sendFile(path.join(__dirname,'index.html'));
// })
app.listen(port,()=>{
    console.log('server is runing on port 3000');
}); 
