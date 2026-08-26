import { 
    getViews, 
    getProjects, 
    getActiveFilter, 
    getFilteredTasks , 
    getProjectById, 
    getTaskById 
} from "./state.js";

import {
    resetColorPicker
} from "./events.js";

// sidebar
// ==========================================

import spriteUrl from "./assets/lucide-sprite.svg";

function createIcon(iconId, color) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("sidebar-icon");

    if (color) {
        svg.style.color = color; // sets the `color` property that currentColor reads from
    }

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `${spriteUrl}#${iconId}`);

    svg.appendChild(use);
    return svg;
}

function createSidebarItem(item, activeId) {
    const listItem = document.createElement("li");
    const button = document.createElement("div");

    button.classList.add("sidebar-item");
    button.dataset.id = item.id;
    button.classList.toggle("active", item.id === activeId);

    const icon = createIcon(item.icon, item.color);
    const label = document.createElement("span");
    label.textContent = item.title;
    label.title = item.title;

    button.append(icon, label);

    if (item.type === "project") {
        const moreBtn = document.createElement("button");
        moreBtn.className = "sidebar-more-btn";
        moreBtn.dataset.id = item.id;
        moreBtn.textContent = "⋮";
        button.append(moreBtn);
    }

    listItem.append(button);

    return listItem;
}

function displaySidebarList(container, items, activeId) {
    const list = document.querySelector(container);
    list.innerHTML = "";
    items.forEach(item => list.appendChild(createSidebarItem(item, activeId)));
}

export function displaySidebar() {
    const active = getActiveFilter();
    displaySidebarList(".views-list", getViews(), active?.id);
    displaySidebarList(".projects-list", getProjects(), active?.id);
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

    let taskProjectTag = null;
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

// taskform
// ==========================================

export function fillProjectSelect() {
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

export function displayTaskEditor(taskId) {
    const form = document.getElementById("edit-task-form");
    const task = taskId ? getTaskById(taskId) : null;

    if (!task) {
        form.classList.add("hidden");
        form.dataset.editingId = "";
        return;
    }

    form.classList.remove("hidden");

    document.getElementById("edit-task-title").value = task.title;
    document.getElementById("edit-task-description").value = task.description || "";
    document.getElementById("edit-task-due").value = task.dueDate || "";
    document.getElementById("edit-task-priority").value = task.priority;

    const projectSelect = document.getElementById("edit-task-project");
    projectSelect.innerHTML = '<option value="">Unassigned</option>';
    getProjects().forEach(project => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.title;
        if (project.id === task.projectId) option.selected = true;
        projectSelect.appendChild(option);
    });

    form.dataset.editingId = taskId;
}

// modals
// ==========================================

export function openProjectModalForEdit(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;

  document.getElementById("project-modal-title").textContent = "Edit project";
  document.getElementById("project-title").value = project.title;
  document.getElementById("project-description").value = project.description || "";
  document.getElementById("project-color").value = project.color;

  document.querySelectorAll(".color-swatch").forEach(swatch => {
    swatch.classList.toggle("selected", swatch.dataset.color === project.color);
  });

  document.getElementById("project-form").dataset.editingId = projectId;
  document.getElementById("project-modal").showModal();
}

export function openProjectModalForAdd() {
  document.getElementById("project-modal-title").textContent = "Add project";
  document.getElementById("project-form").reset();
  document.getElementById("project-form").dataset.editingId = "";
  resetColorPicker();
}

export function displayDeleteProjectModal(projectId) {
  const project = getProjectById(projectId);
  if (!project) return;

  document.getElementById("project-delete-msg").textContent =
    `Are you sure you want to delete "${project.title}"? This will also delete all of its tasks.`;

  document.getElementById("project-delete-btn").dataset.deletingId = projectId;
  document.getElementById("project-delete-modal").showModal();
}