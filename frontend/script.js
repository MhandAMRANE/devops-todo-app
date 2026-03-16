const API = "/api/todos";

function loadTodos() {
    fetch(API)
        .then(res => res.json())
        .then(data => {
            const list = document.getElementById("list");
            list.innerHTML = "";

            if (data.length === 0) {
                list.innerHTML = '<div class="empty-state">Aucune tâche pour le moment. Détendez-vous !</div>';
                return;
            }

            data.forEach(todo => {
                const li = document.createElement("li");
                if (todo.completed) li.classList.add("completed");

                li.innerHTML = `
                    <div class="checkbox" onclick="toggleTodo(${todo.id}, ${todo.completed})"></div>
                    <span class="todo-text" onclick="toggleTodo(${todo.id}, ${todo.completed})">${todo.task}</span>
                    <button class="delete-btn" onclick="deleteTodo(${todo.id})" title="Supprimer">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                    </button>
                `;

                list.appendChild(li);
            });
        });
}

function addTodo() {
    const input = document.getElementById("taskInput");
    const task = input.value.trim();

    if (!task) return;

    fetch(API, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ task })
    })
        .then(res => res.json())
        .then(() => {
            input.value = "";
            loadTodos();
        });
}

function toggleTodo(id, currentStatus) {
    fetch(`${API}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ completed: !currentStatus })
    })
        .then(() => loadTodos());
}

function deleteTodo(id) {
    if (!confirm("Voulez-vous vraiment supprimer cette tâche ?")) return;

    fetch(`${API}/${id}`, {
        method: "DELETE"
    })
        .then(() => loadTodos());
}

// Support Enter key
document.getElementById("taskInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTodo();
});

loadTodos();