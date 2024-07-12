const express = require('express');
const app = express();
app.use(express.json());

let ADMIN = [
    { username: "aditya", password: "123" }
];
let USERS = [];
let COURSES = [];

const adminAuthentication = (req, res, next) => {
    const { username, password } = req.headers;
    const admin = ADMIN.find(a => a.username === username && a.password === password);
    if (admin) {
        next();
    } else {
        res.status(401).json({ message: "Invalid admin credentials" });
    }
}

const userAuthentication = (req, res, next) => {
    const { username, password } = req.headers;
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) {
        req.user = user; // Attach user object to request for future use
        next();
    } else {
        res.status(401).json({ message: "Invalid user credentials" });
    }
}

// User routes

// User sign up
app.post('/users/signup', (req, res) => {
    const { username, password } = req.body;
    const existingUser = USERS.find(u => u.username === username);
    if (existingUser) {
        res.status(400).json({ message: "User already exists! Please log in." });
    } else {
        const newUser = { username, password, purchasedCourses: [] };
        USERS.push(newUser);
        res.status(201).json({ message: "User registered successfully", user: newUser });
    }
});

// User view purchased courses
app.get('/users/purchasedCourses', userAuthentication, (req, res) => {
    const userId = req.user.id; // Assuming user ID is stored in user object
    const user = USERS.find(u => u.id === userId);
    if (user) {
        res.status(200).json(user.purchasedCourses);
    } else {
        res.status(404).json({ message: "User not found!" });
    }
});

// User purchase course
app.post('/users/purchaseCourse/:id', userAuthentication, (req, res) => {
    const courseId = req.params.id;
    const course = COURSES.find(c => c.id === courseId);
    if (!course) {
        res.status(404).json({ message: "Course not found!" });
    } else {
        const userId = req.user.id;
        const userIndex = USERS.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            res.status(404).json({ message: "User not found!" });
        } else {
            USERS[userIndex].purchasedCourses.push(course);
            res.status(200).json({ message: "Course purchased successfully", course });
        }
    }
});

// Admin routes

// Admin create course
app.post('/admin/courses', adminAuthentication, (req, res) => {
    const { title, description, price, imgUrl } = req.body;
    const existingCourse = COURSES.find(c => c.title === title && c.description === description);
    if (existingCourse) {
        res.status(400).json({ message: "Course already exists!" });
    } else {
        const newCourse = { title, description, price, imgUrl, published: false };
        COURSES.push(newCourse);
        res.status(201).json({ message: "Course created successfully", course: newCourse });
    }
});

// Admin sign up
app.post('/admin/signup', (req, res) => {
    const { username, password } = req.body;
    const existingAdmin = ADMIN.find(a => a.username === username);
    if (existingAdmin) {
        res.status(400).json({ message: "Admin already exists! Please log in." });
    } else {
        const newAdmin = { username, password };
        ADMIN.push(newAdmin);
        res.status(201).json({ message: "Admin registered successfully", admin: newAdmin });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
