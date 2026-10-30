
const todoInput = document.getElementById("to-do");
const addButton = document.getElementById("add-btn");
const completeddbtn = document.getElementById("clear-all");
const maindiv = document.getElementById("task-list");
const taskcount = document.getElementById("task-count");
const progressPercent = document.getElementById("progress-label");

// Local Storage
let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const savedTasks = localStorage.getItem("tasks");

  tasks = savedTasks ? JSON.parse(savedTasks) : [];

  maindiv.innerHTML = "";

  tasks.forEach(function (task) {
    displayTask(task);
  });

  updateTaskCount();
  updateCompletionPercentage();
}

// Display task
function displayTask(taskdata) {
  const task = document.createElement("div");
  task.className = "tasks";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "task-check";
  checkbox.checked = taskdata.completed;

  const spandiv = document.createElement("span");
  spandiv.textContent = taskdata.text;

  spandiv.style.textDecoration = taskdata.completed
    ? "line-through"
    : "none";

  // Checkbox event
  checkbox.addEventListener("change", function () {
    taskdata.completed = checkbox.checked;

    spandiv.style.textDecoration = checkbox.checked
      ? "line-through"
      : "none";

    saveTasks();
    updateCompletionPercentage();
  });

  // Delete button
  const dbutton = document.createElement("button");
  dbutton.textContent = "Delete";
  dbutton.className = "delete-btn";

  dbutton.addEventListener("click", function () {
    tasks = tasks.filter(function (item) {
      return item.id !== taskdata.id;
    });

    saveTasks();
    task.remove();

    updateTaskCount();
    updateCompletionPercentage();
  });

  task.append(checkbox, spandiv, dbutton);
  maindiv.append(task);
}

// Add task
function add() {
  const text = todoInput.value.trim();

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();

  displayTask(newTask);

  updateTaskCount();
  updateCompletionPercentage();

  todoInput.value = "";
  todoInput.focus();
}

// Update task count
function updateTaskCount() {
  const count = tasks.length;

  taskcount.textContent =
    `${count} ${count === 1 ? "TASK" : "TASKS"}`;
}

// Update progress
function updateCompletionPercentage() {
  const total = tasks.length;

  const completed = tasks.filter(function (task) {
    return task.completed;
  }).length;

  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  progressPercent.textContent = `${percentage}% complete`;
}

// Add button
addButton.addEventListener("click", add);

// Enter key
todoInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    add();
  }
});

// Clear completed tasks
completeddbtn.addEventListener("click", function () {
  tasks = tasks.filter(function (task) {
    return !task.completed;
  });

  saveTasks();

  loadTasks();
});

// Initialize application
loadTasks();
