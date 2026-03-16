
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// Ensure the data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}
const todosFile = path.join(dataDir, "todos.json");

// Helper to read todos from file
function readTodos() {
    if (!fs.existsSync(todosFile)) return [];
    try {
        const data = fs.readFileSync(todosFile, "utf-8");
        return JSON.parse(data);
    } catch {
        return [];
    }
}

// Helper to write todos to file
function writeTodos(todos) {
    fs.writeFileSync(todosFile, JSON.stringify(todos, null, 2), "utf-8");
}

// GET todos
app.get("/todos", (req, res) => {
    const todos = readTodos();
    res.json(todos.sort((a, b) => b.id - a.id));
});

// POST todo
app.post("/todos", (req, res) => {
    const task = (req.body.task || "").toString().trim();
    if (!task) {
        res.status(400).json({ error: "Task is required" });
        return;
    }
    if (task.length > 500) {
        res.status(400).json({ error: "Task too long (max 500 characters)" });
        return;
    }
    let todos = readTodos();
    const newId = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const todo = { id: newId, task, completed: 0 };
    todos.push(todo);
    writeTodos(todos);
    res.json(todo);
});

// PATCH todo (toggle completed)
app.patch("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    const { completed } = req.body;
    let todos = readTodos();
    const idx = todos.findIndex(t => t.id === id);
    if (idx === -1) {
        res.status(404).json({ error: "Todo not found" });
        return;
    }
    todos[idx].completed = completed ? 1 : 0;
    writeTodos(todos);
    res.json({ success: true });
});

// DELETE todo
app.delete("/todos/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    let todos = readTodos();
    const newTodos = todos.filter(t => t.id !== id);
    if (newTodos.length === todos.length) {
        res.status(404).json({ error: "Todo not found" });
        return;
    }
    writeTodos(newTodos);
    res.json({ success: true });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});