const express=require('express');
const app=express();
const mongoose=require("mongoose");
const jwt=require("jsonwebtoken");
const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

// Define mongoose schemas
const userSchema = new mongoose.Schema({
  username: {type: String},
  password: String,
  purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
});

const adminSchema = new mongoose.Schema({
  username: String,
  password: String
});

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  imageLink: String,
  published: Boolean
});
const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Course = mongoose.model('Course', courseSchema);
app.use(express.json());
const jwtAuthentication=(req,res,next)=>{
      const authHeader=req.headers.authorization;
      if(authHeader){
        const token = authHeader.split(' ')[1];
jwt.verify(token, SECRET, (err, decoded) => {
  if (err) {
    res.status(401).send('Invalid token');
  }
  else {
    req.user = decoded.user;  
    next(); 
  }
});
      }else{
        res.status(401).send("Unauthorized")
      }
}
mongoose.connect('mongodb+srv://adityasainihr75:tVbXN9kBozYjV96Q@cluster0.ho0xwcj.mongodb.net/courses', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "courses" });


app.post('/admin/signup', async(req, res) => {
// Admin routes
  // logic to sign up admin
        const {username,password}=req.body;
        const admin= await admin.findOne({username});
        if(admin){
          return res.status(400).send("User already exists");
        }else{
          const obj={username:username,password:password};
          const newAdmin=new Admin(obj);
          await newAdmin.save();
          const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
          res.status(200).send("Admin Succesfully created",token);
        }
});

app.post('/admin/login', async(req, res) => {
  // logic to log in admin
  const {username,password}=req.body;
  const admin= await Admin.findOne({username});
  if(admin){
    const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
    res.status(200).send("Admin Successfully Logged In",token);
  }
  else{
    res.status(400).send("User does not exist ! Please SignuP");
  }
});

app.post('/admin/courses',jwtAuthentication,async(req, res) => {
  // logic to create a course
  // const {name,description,price}=req.body;
  // const obj={name:name,description:description,price:price}; OR
  const newCourse=new Course(req.body);
  await newCourse.save();
  res.status(200).send("Course Successfully created");
});

app.put('/admin/courses/:courseId',jwtAuthentication,async (req, res) => {
  // logic to edit a course
  const courseId=req.params.id;
  const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
  if(course){
  res.status(200).json({message:"successfully updated"});}
else{
  res.status(403).json({message:"course not found"});
}
});

app.get('/admin/courses', jwtAuthentication,async(req, res) => {
  // logic to get all courses
  const admin=req.user;
  const courses=await Course.find({});
  res.json({courses});
});

// User routes
app.post('/users/signup', async(req, res) => {
  // logic to sign up user
  const {username,password}=req.body;
  const user=await User.findOne({username});
  if(user){
    res.status(400).send("User already exists ! Please Login");
  }else{
    const newUser=new User(req.body);
    await newUser.save();
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.status(200).json({message:"successfully Signed"}, token);
  }
});

app.post('/users/login',async (req, res) => {
  // logic to log in user
  const {username,password}=req.body;
  const user=await User.findOne({username});
  if(user){
    const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
    res.status(200).json({message:"successfully Logged In"}, token);
  }
});

app.get('/users/courses',jwtAuthentication, async(req, res) => {
  // logic to list all courses
  const user=req.user;
  const courses=await Course.find({});
  res.status(200).json({courses});
});

app.post('/users/courses/:courseId', jwtAuthentication,async(req, res) => {
  // logic to purchase a course
  const courseId=req.params.id;
  const course=await Course.findById(courseId);
  if(course){
    const user=await User.findOne({username:req.user});
  user.purchasedCourses.push(course);
  await user.save();
    res.status(200).json({message:"course purchased successfully"},course);
  }else{
    res.status(400).send("Course not found !");
  }
});

app.get('/users/purchasedCourses', jwtAuthentication,async(req, res) => {
  // logic to view purchased courses
  const user=await User.findOne({username:req.user});
  if(user){
    res.json({purchasedCourses:user.purchasedCourses});
  }else{
    res.status(400).send("User not found !");
  }
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});