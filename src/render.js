import { getViews, getProjects, getActiveFilter, getFilteredTasks , getProjectById, getTaskById } from "./state.js";

// sidebar
// ==========================================

function createSidebarItem(item) {
    const listItem = document.createElement("li");
    const button = document.createElement("button");

    button.classList.add("sidebar-item");
    button.dataset.id = item.id;
    button.textContent = item.title;

    listItem.append(button);

    return listItem;
}

function displaySidebarList(container, items) {
    const list = document.querySelector(container);
    list.innerHTML = "";
    items.forEach(item => list.appendChild(createSidebarItem(item)));
}

export function displaySidebar() {
    displaySidebarList(".views-list", getViews());
    displaySidebarList(".projects-list", getProjects())
}

// header main
// ==========================================

export function displayHeader() {
    const active = getActiveFilter();

    const headerTitle = document.getElementById("header-title");
    const headerDescription = document.getElementById("header-description");

    headerTitle.textContent = active.title;
    headerDescription.textContent = active.description;
}

// tasks list
// ==========================================

function createTaskCard(task, active) {
    const taskCard = document.createElement("article");
    taskCard.classList.add("card-task");
    taskCard.dataset.id = task.id;

    const taskCheckbox = document.createElement("input");
    taskCheckbox.type = "checkbox";
    taskCheckbox.classList.add("task-checkbox");
    taskCheckbox.checked = task.done;

    const taskTitle = document.createElement("h2");
    taskTitle.textContent = task.title;
    taskTitle.classList.toggle("done", task.done);

    const taskDueDate = document.createElement("span");
    taskDueDate.textContent = task.dueDate;

    const taskPriority = document.createElement("span");
    taskPriority.textContent = task.priority;

    let taskProjectTag = "";
    if (active?.id === "all" || active?.id === "today") {
        taskProjectTag = document.createElement("span");
        const project = getProjectById(task.projectId);
        taskProjectTag.textContent = project ? project.title : "Unassigned";
    }

    taskCard.append(taskCheckbox, taskTitle, taskProjectTag, taskDueDate, taskPriority);

    return taskCard;
}

export function displayTasks() {
    const container = document.querySelector(".tasks-list");
    container.innerHTML = "";
    const active = getActiveFilter();

    getFilteredTasks().forEach(task => container.appendChild(createTaskCard(task, active)));
}

// 
// ==========================================

export function populateProjectSelect() {
  const select = document.getElementById("task-project");
  const active = getActiveFilter();

  select.innerHTML = '<option value="">Unassigned</option>';

  getProjects().forEach(project => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.title;
    if (active?.type === "project" && active.id === project.id) {
      option.selected = true;
    }
    select.appendChild(option);
  });
}

document.getElementById("add-task-btn").addEventListener("click", () => {
  populateProjectSelect();
});