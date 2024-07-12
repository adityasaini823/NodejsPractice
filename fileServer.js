const express=require("express");
const app=express();
const fs=require('fs');
const port=3000;
const path = require('path');
app.use(express.json());

app.get("/files",(req,res)=>{
  
    fs.readdir(path.join(__dirname, "./files/"),"utf8",(err,content)=>{
        if(err){
            res.status(404).send("File not found");
        }
        else{
            res.setHeader('Content-Type', 'text/plain');
            res.send(content);
        }
    })
})
app.get("/files/:filename", (req, res) => {
    const filename = req.params.filename;
    console.log(req.params);
    const filepath = path.join(__dirname, "./files/", filename);
    fs.readFile(filepath, "utf8", (err, data) => {
      if (err) return res.status(404).send("File not found");
      return res.status(200).send(data);
    });
  });
app.listen(port,()=>{
    console.log("port is running on 3000")
});