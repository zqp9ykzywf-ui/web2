const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const errorMessage = document.getElementById("errorMessage");

const popup = document.getElementById("popup");
const popupText = document.getElementById("popupText");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");

const clearDoneBtn = document.getElementById("clearDone");
const deleteAllBtn = document.getElementById("deleteAll");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let popupAction = null;

/* Helpers */
const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

const validateTask = (text) => {
  if (text === "") return "Task cannot be empty";
  if (/^\d/.test(text)) return "Task cannot start with number";
  if (text.length < 5) return "Minimum 5 characters";
  return "";
};

const renderTasks = (filter = "all") => {
  taskList.innerHTML = "";
  tasks
    .filter(task =>
      filter === "all" ||
      (filter === "done" && task.done) ||
      (filter === "todo" && !task.done)
    )
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.className = task.done ? "done" : "";

      li.innerHTML = `
        <span>${task.text}</span>
        <div class="actions">
          <input type="checkbox" ${task.done ? "checked" : ""} onclick="toggleDone(${index})">
          <button onclick="renameTask(${index})">✏️</button>
          <button onclick="confirmDelete(${index})">🗑</button>
        </div>
      `;
      taskList.appendChild(li);
    });
};

/* Events */
addBtn.addEventListener("click", () => {
  const value = taskInput.value.trim();
  const error = validateTask(value);
  if (error) {
    errorMessage.textContent = error;
    return;
  }

  tasks.push({ text: value, done: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
  errorMessage.textContent = "";
});

/* Actions */
window.toggleDone = (index) => {
  tasks[index].done = !tasks[index].done;
  saveTasks();
  renderTasks();
};

window.renameTask = (index) => {
  const newName = prompt("Rename task:");
  if (newName) {
    tasks[index].text = newName;
    saveTasks();
    renderTasks();
  }
};

window.confirmDelete = (index) => {
  popupText.textContent = "Are you sure you want to delete this task?";
  popupAction = () => {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  };
  popup.style.display = "flex";
};

confirmBtn.addEventListener("click", () => {
  popupAction();
  popup.style.display = "none";
});

cancelBtn.addEventListener("click", () => {
  popup.style.display = "none";
});

/* Bottom buttons */
clearDoneBtn.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.done);
  saveTasks();
  renderTasks();
});

deleteAllBtn.addEventListener("click", () => {
  popupText.textContent = "Delete all tasks?";
  popupAction = () => {
    tasks = [];
    saveTasks();
    renderTasks();
  };
  popup.style.display = "flex";
});

/* Tabs */
document.querySelectorAll(".tabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    renderTasks(btn.dataset.filter);
  });
});

renderTasks();