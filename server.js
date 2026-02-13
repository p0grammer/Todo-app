const express = require('express');
const path = require('path');

const app = express();

/* ✅ REQUIRED FOR DEPLOYMENT */
const PORT = process.env.PORT || 5000;

app.use(express.json());

/* ✅ Serve Frontend */
app.use(express.static(path.join(__dirname, 'public')));


/* ---------------- DATA (TEMP - MEMORY) ---------------- */

let tasks = [
    { id: 1, title: "Learn Node", completed: false },
    { id: 2, title: "Understand Express", completed: false },
    { id: 3, title: "Build a successful Backend", completed: false }
];

let nextId = 4;


/* ---------------- ROUTES ---------------- */


/* GET ALL TASKS */
app.get('/tasks', (req, res) => {
    res.json(tasks);
});


/* GET SINGLE TASK */
app.get('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    res.json(task);
});


/* CREATE TASK */
app.post('/tasks', (req, res) => {

    if (!req.body.title) {
        return res.status(400).json({
            message: "Title is required"
        });
    }

    const newTask = {
        id: nextId++,
        title: req.body.title,
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});


/* UPDATE TASK */
app.put('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    if (req.body.title !== undefined) {
        task.title = req.body.title;
    }

    if (req.body.completed !== undefined) {
        task.completed = req.body.completed;
    }

    res.json(task);
});


/* DELETE TASK */
app.delete('/tasks/:id', (req, res) => {

    const id = Number(req.params.id);
    const exists = tasks.some(t => t.id === id);

    if (!exists) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks = tasks.filter(t => t.id !== id);

    res.json({
        message: "Task deleted successfully"
    });
});


/* GLOBAL 404 */
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


/* SERVER */
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

