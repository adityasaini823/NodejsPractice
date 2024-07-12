const express=require('express');
const app=express();
app.use(express.json());
let ADMIN=[{
    username:"aditya",
    password:"123",
}];
// let USERS=[];
// let COURSES=[];
const adminAuthentication=(req,res,next)=>{
    const {username,password}=req.headers;
    const admin=ADMIN.find(a=>a.username===username && a.password===password);
    if(admin){
        res.json({message: "successfully logged"});
        next();
    }
    else{
        res.json({message: "invalid username or password"});
    }
}

app.get("/admin/login",adminAuthentication,(req,res)=>{
        console.log(req.body.username+" "+ Number(req.body.password));
})
app.post('/admin/signup',(req,res)=>{
    const {username,password}=req.body;
    const existingAdmin=ADMIN.find(a=>a.username==username && a.password==password);
    if(existingAdmin){
        console.log("Admin already exists! Please Login");
    }
    else{
        const admin={username,password};
        ADMIN.push(admin);
        res.send(admin);
    }
})
app.listen(3000,()=>{
    console.log("server is running on port 3000")}
)