import { getViews, getProjects, getActiveFilter, getFilteredTasks } from "./state.js";

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


export function displayHeader() {
    const active = getActiveFilter();

    const headerTitle = document.getElementById("header-title");
    const headerDescription = document.getElementById("header-description");

    headerTitle.textContent = active.title;
    headerDescription.textContent = active.description;
}


function createTaskCard(task) {
    const taskCard = document.createElement("article");
    const taskTitle = document.createElement("h2");
    const taskDueDate = document.createElement("span");
    const taskPriority = document.createElement("span");

    taskCard.classList.add("card-task");
    taskCard.dataset.id = task.id;

    taskTitle.textContent = task.title;
    taskDueDate.textContent = task.dueDate;
    taskPriority.textContent = task.priority;

    taskCard.append(taskTitle, taskDueDate, taskPriority);

    return taskCard;
}

export function displayTasks() {
    const container = document.querySelector(".tasks-list");
    container.innerHTML = "";
    getFilteredTasks().forEach(task => container.appendChild(createTaskCard(task)));
}



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