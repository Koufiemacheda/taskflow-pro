const API_URL = "https://d2wm9oj5gl.execute-api.us-east-1.amazonaws.com";

const taskInput = document.getElementById("taskInput");
const createBtn = document.getElementById("createBtn");
const taskList = document.getElementById("taskList");

const taskCount = document.getElementById("taskCount");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const completionRate = document.getElementById("completionRate");

// Load tasks when page opens
window.onload = loadTasks;

// Create Task
createBtn.addEventListener("click", createTask);

async function createTask() {

    const taskName = taskInput.value.trim();

    if (!taskName) {
        alert("Please enter a task");
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

        loadTasks();

    } catch (error) {

        console.error(error);
        alert("Failed to create task");

    }
}

// Load Tasks
async function loadTasks() {

    try {

        const response = await fetch(`${API_URL}/tasks`);

        const data = await response.json();

        const tasks = data.tasks || [];

        // Dashboard calculations
        const pending = tasks.filter(
            task => task.status === "Pending"
        ).length;

        const completed = tasks.filter(
            task => task.status === "Completed"
        ).length;

        const total = tasks.length;

        const rate =
            total === 0
                ? 0
                : Math.round(
                    (completed / total) * 100
                );

        taskCount.textContent = total;
        pendingCount.textContent = pending;
        completedCount.textContent = completed;
        completionRate.textContent = `${rate}%`;

        displayTasks(tasks);

    } catch (error) {

        console.error(error);

    }
}

// Display Tasks
function displayTasks(tasks) {

    taskList.innerHTML = "";

    // Pending first, completed last
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

        const card = document.createElement("div");

        card.className = "task-card";

        card.innerHTML = `
            <div class="task-header">

                <div class="task-name">
                    ${task.taskName}
                </div>

                <span class="${task.status === 'Completed'
                    ? 'completed'
                    : 'pending'}">

                    ${task.status}

                </span>

            </div>

            <div class="task-meta">
                Created: ${task.createdAt}
            </div>

            <div class="task-meta">
                Task ID: ${task.taskId.substring(0, 8)}...
            </div>

            <div class="task-actions">

                <button
                    class="complete-btn"
                    onclick="toggleTaskStatus(
                        '${task.taskId}',
                        '${task.status}'
                    )">

                    ${task.status === 'Completed'
                        ? 'Undo'
                        : 'Mark Complete'}

                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTask('${task.taskId}')">

                    Delete

                </button>

            </div>
        `;

        taskList.appendChild(card);

    });

}

// Toggle Status
async function toggleTaskStatus(taskId, currentStatus) {

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

        loadTasks();

    } catch (error) {

        console.error(error);

    }

}

// Delete Task
async function deleteTask(taskId) {

    if (!confirm("Delete this task?")) {
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

        loadTasks();

    } catch (error) {

        console.error(error);

    }

}