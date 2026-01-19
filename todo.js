console.log("JS Conectado");

const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const counter = document.getElementById("counter");
const filterButtons = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

addBtn.addEventListener("click", addTask);

input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        addTask();
    }
});

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

renderTasks();

function addTask() {
    const text = input.value.trim();
    if (!text) return;

    tasks.push({
        text,
        completed: false
    });

    input.value = "";
    saveAndRender();
}

function renderTasks() {
    list.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "pending") return !task.completed;
        if (currentFilter === "completed") return task.completed;
        return true;
    });

    filteredTasks.forEach((task) => {
        const li = document.createElement("li");
        li.textContent = task.text;

        if (task.completed) {
            li.classList.add("completed");
        }

        li.addEventListener("click", () => {
            task.completed = !task.completed;
            saveAndRender();
        });

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "❌";
        deleteBtn.classList.add("delete-btn");

        deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            if (!confirm("¿Eliminar esta tarea?")) return;
            tasks = tasks.filter(t => t !== task);
            saveAndRender();
        });

        li.appendChild(deleteBtn);
        list.appendChild(li);
    });

    updateCounter();
}

function saveAndRender() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
}

function updateCounter() {
    const pending = tasks.filter(task => !task.completed).length;
    counter.textContent = `Tareas pendientes: ${pending}`;
}
