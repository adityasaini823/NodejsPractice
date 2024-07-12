// const imp=require("./add");
// console.log(imp(5,6));
// console.log("World");
// console.log("World");
// console.log("World");

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    var count=req.query.counter;
    var answer="Hello World! "+count;
  res.send(answer);
})
app.post('/html',(req,res)=>{
    res.send("hello ji");
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})






