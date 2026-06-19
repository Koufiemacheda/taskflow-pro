const API_URL = "https://d2wm9oj5gl.execute-api.us-east-1.amazonaws.com";

// Elements
const taskInput = document.getElementById("taskInput");
const createBtn = document.getElementById("createBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const completionRate = document.getElementById("completionRate");

const searchInput = document.getElementById("searchInput");
const statusFilter = document.getElementById("statusFilter");

const loadingState = document.getElementById("loadingState");
const emptyState = document.getElementById("emptyState");

const toast = document.getElementById("toast");

// App State
let allTasks = [];

// Startup
window.onload = loadTasks;

createBtn.addEventListener("click", createTask);

searchInput.addEventListener("input", filterTasks);

statusFilter.addEventListener("change", filterTasks);

// Toast Notification
function showToast(message, type = "success") {

    toast.textContent = message;

    toast.className = "";

    if (type === "success") {
        toast.classList.add("toast-success");
    }
    else if (type === "danger") {
        toast.classList.add("toast-danger");
    }
    else {
        toast.classList.add("toast-info");
    }

    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);

}

// Create Task
async function createTask() {

    const taskName = taskInput.value.trim();

    if (!taskName) {

        showToast(
            "Please enter a task name",
            "danger"
        );

        return;
    }

    try {

        await fetch(`${API_URL}/tasks`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                taskName: taskName
            })

        });

        taskInput.value = "";

        showToast(
            "Task Created Successfully"
        );

        loadTasks();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Failed to create task",
            "danger"
        );

    }

}

// Load Tasks
async function loadTasks() {

    try {

        loadingState.style.display = "block";
        taskList.style.display = "none";
        emptyState.style.display = "none";

        const response =
            await fetch(`${API_URL}/tasks`);

        const data =
            await response.json();

        allTasks = data.tasks || [];

        updateDashboard(allTasks);

        filterTasks();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Failed to load tasks",
            "danger"
        );

    }
    finally {

        loadingState.style.display = "none";

    }

}

// Dashboard
function updateDashboard(tasks) {

    const total = tasks.length;

    const pending =
        tasks.filter(
            task =>
                task.status === "Pending"
        ).length;

    const completed =
        tasks.filter(
            task =>
                task.status === "Completed"
        ).length;

    const rate =
        total === 0
            ? 0
            : Math.round(
                (completed / total) * 100
            );

    taskCount.textContent = total;

    pendingCount.textContent = pending;

    completedCount.textContent = completed;

    completionRate.textContent =
        `${rate}%`;

}

// Search + Filter
function filterTasks() {

    let filteredTasks = [...allTasks];

    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();

    const filterValue =
        statusFilter.value;

    // Search

    if (searchValue) {

        filteredTasks =
            filteredTasks.filter(task =>
                task.taskName
                    .toLowerCase()
                    .includes(searchValue)
            );

    }

    // Status Filter

    if (filterValue !== "all") {

        filteredTasks =
            filteredTasks.filter(task =>
                task.status === filterValue
            );

    }

    displayTasks(filteredTasks);

}

// Display Tasks
function displayTasks(tasks) {

    taskList.innerHTML = "";

    if (tasks.length === 0) {

        emptyState.style.display = "block";
        taskList.style.display = "none";

        return;

    }

    emptyState.style.display = "none";
    taskList.style.display = "grid";

    // Pending first

    tasks.sort((a, b) => {

        if (
            a.status === "Pending" &&
            b.status === "Completed"
        ) {
            return -1;
        }

        if (
            a.status === "Completed" &&
            b.status === "Pending"
        ) {
            return 1;
        }

        return 0;

    });

    tasks.forEach(task => {

        const card =
            document.createElement("div");

        card.className =
            "task-card";

        card.innerHTML = `

            <div class="task-header">

                <div class="task-name">
                    📋 ${task.taskName}
                </div>

                <span class="${
                    task.status === "Completed"
                        ? "completed"
                        : "pending"
                }">

                    ${
                        task.status === "Completed"
                            ? "✅ Completed"
                            : "⏳ Pending"
                    }

                </span>

            </div>

            <div class="task-meta">
                Created:
                ${task.createdAt}
            </div>

            <div class="task-meta">
                Task ID:
                ${task.taskId.substring(0,8)}...
            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTaskStatus(
                        '${task.taskId}',
                        '${task.status}'
                    )">

                    ${
                        task.status === "Completed"
                            ? "Undo"
                            : "Mark Complete"
                    }

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask(
                        '${task.taskId}'
                    )">

                    Delete

                </button>

            </div>

        `;

        taskList.appendChild(card);

    });

}

// Toggle Status
async function toggleTaskStatus(
    taskId,
    currentStatus
) {

    const newStatus =
        currentStatus === "Completed"
            ? "Pending"
            : "Completed";

    try {

        await fetch(`${API_URL}/tasks`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                taskId: taskId,
                status: newStatus
            })

        });

        showToast(
            newStatus === "Completed"
                ? "Task Completed"
                : "Task Reopened"
        );

        loadTasks();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Update Failed",
            "danger"
        );

    }

}

// Delete Task
async function deleteTask(taskId) {

    if (
        !confirm(
            "Delete this task?"
        )
    ) {
        return;
    }

    try {

        await fetch(`${API_URL}/tasks`, {

            method: "DELETE",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                taskId: taskId
            })

        });

        showToast(
            "Task Deleted",
            "danger"
        );

        loadTasks();

    }
    catch (error) {

        console.error(error);

        showToast(
            "Delete Failed",
            "danger"
        );

    }

}