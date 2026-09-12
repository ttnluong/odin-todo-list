import * as state from "./state.js"

import spriteUrl from "./assets/lucide-sprite.svg";

// sidebar
// ==========================================

function createIcon(iconId, color) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.classList.add("sidebar-icon");

    if (color) {
        svg.style.color = color;
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
    label.classList.add("sidebar-label");
    label.textContent = item.title;
    label.title = item.title;

    button.append(icon, label);

    const endSlot = document.createElement("div");
    endSlot.classList.add("sidebar-end-slot");

    const taskCount = state.getTaskCountPerFilter(item.id);
    if (taskCount > 0) {
        const count = document.createElement("span");
        count.classList.add("sidebar-count");
        count.textContent = taskCount;
        endSlot.append(count);
    }

    if (item.type === "project") {
        const moreBtn = document.createElement("button");
        moreBtn.className = "sidebar-more-btn";
        moreBtn.dataset.id = item.id;
        moreBtn.textContent = "⋮";
        endSlot.append(moreBtn);
    }

    button.append(endSlot);
    listItem.append(button);

    return listItem;
}

function displaySidebarList(container, items, activeId) {
    const list = document.querySelector(container);
    list.innerHTML = "";
    items.forEach(item => list.appendChild(createSidebarItem(item, activeId)));
}

export function displaySidebar() {
    const active = state.getActiveFilter();
    displaySidebarList(".views-list", state.getViews(), active?.id);
    displaySidebarList(".projects-list", state.getProjects(), active?.id);
}

// header main
// ==========================================

export function displayHeader() {
    const active = state.getActiveFilter();

    const headerTitle = document.getElementById("header-title");
    const headerDescription = document.getElementById("header-description");

    headerTitle.textContent = active?.title ?? "";
    headerDescription.textContent = active?.description ?? "";
}

// due date helpers
// ==========================================

function getDueDateDiff(dueDateStr) {
    if (!dueDateStr) return null;
    const [year, month, day] = dueDateStr.split("-").map(Number);
    const dueDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return { dueDate, today, diffDays: Math.round((dueDate - today) / (1000 * 60 * 60 * 24)) };
}

function formatDueDate(dueDateStr) {
    const diff = getDueDateDiff(dueDateStr);
    if (!diff) return "";
    const { dueDate, today, diffDays } = diff;

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";

    const isCurrentYear = dueDate.getFullYear() === today.getFullYear();
    return dueDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: isCurrentYear ? undefined : "numeric"
    });
}

function getDueDateStatus(dueDateStr) {
    const diff = getDueDateDiff(dueDateStr);
    if (!diff) return null;
    const { diffDays } = diff;
    
    if (diffDays < 0) return "overdue";
    if (diffDays === 0) return "today";

    if (diffDays <= 7) return "soon";
    return "later";
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
    taskTitle.classList.add("task-title");

    const taskProjectTag = document.createElement("span");
    const project = state.getProjectById(task.projectId);
    taskProjectTag.textContent = project ? project.title : "Unassigned";
    const showProjectTag = active?.id === "all" || active?.id === "today";
    taskProjectTag.classList.toggle("hidden-tag", !showProjectTag);

    const taskDueDate = document.createElement("span");
    taskDueDate.textContent = formatDueDate(task.dueDate);
    const dueStatus = getDueDateStatus(task.dueDate);
    if (dueStatus && !task.done) taskDueDate.dataset.status = dueStatus;

    const taskPriority = document.createElement("span");
    taskPriority.textContent = task.priority;
    if (!task.done) taskPriority.dataset.priority = task.priority.toLowerCase();

    const taskChecklist = document.createElement("span");
    const progress = state.getChecklistProgress(task);
    taskChecklist.textContent = progress ? `${progress.done} / ${progress.total}` : "";

    taskCard.append(taskCheckbox, taskTitle, taskProjectTag, taskDueDate, taskPriority, taskChecklist);

    return taskCard;
}


export function displayTasks() {
    const container = document.getElementById("tasks-list");
    container.innerHTML = "";
    const active = state.getActiveFilter();

    const header = document.getElementById("task-list-header");
    header.classList.toggle("show-project", active?.id === "all" || active?.id === "today");

    state.getFilteredTasks().forEach(task => container.appendChild(createTaskCard(task, active)));
}

// editable inline title input (also for quick-add)
// ==========================================

export function createTaskTitleInput(currentValue, onCommit) {
    const input = document.createElement("input");
    input.type = "text";
    input.classList.add("task-title-input");
    input.value = currentValue;
    input.placeholder = "New task";

    let committed = false;
    function commitOnce(value) {
        if (committed) return;
        committed = true;
        onCommit(value);
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            commitOnce(input.value.trim());
        }
        if (e.key === "Escape") {
            commitOnce(null);
        }
    });

    input.addEventListener("focusout", () => {
        commitOnce(input.value.trim());
    });

    return input;
}

export function editTaskTitle(taskCard, task) {
    const titleEl = taskCard.querySelector(".task-title");
    if (!titleEl) return;

    const input = createTaskTitleInput(task.title, (value) => {
        if (value) state.updateTask(task.id, { title: value });
        displayTasks();

        const editForm = document.getElementById("edit-task-form");
        if (editForm.dataset.editingId === task.id) {
            displayTaskEditor(task.id);
        }
    });

    titleEl.replaceWith(input);
    input.focus();
}

// taskform
// ==========================================

function addProjectSelect(select, selectedProjectId) {
    select.innerHTML = '<option value="">Unassigned</option>';
    state.getProjects().forEach(project => {
        const option = document.createElement("option");
        option.value = project.id;
        option.textContent = project.title;
        select.appendChild(option);
    });
    select.value = selectedProjectId ?? "";
}

export function fillProjectSelect() {
    const active = state.getActiveFilter();
    const select = document.getElementById("task-project");
    addProjectSelect(select, active?.type === "project" ? active.id : "");
}

export function displayTaskEditor(taskId) {
    const form = document.getElementById("edit-task-form");
    const task = taskId ? state.getTaskById(taskId) : null;

    if (!task) {
        form.classList.add("hidden");
        form.dataset.editingId = "";
        return;
    }

    form.classList.remove("hidden");

    document.getElementById("edit-task-title").value = task.title;
    document.getElementById("edit-task-description").value = task.description ?? "";
    document.getElementById("edit-task-due").value = task.dueDate ?? "";
    document.getElementById("edit-task-notes").value = task.notes ?? "";

    const prioritySelect = document.getElementById("edit-task-priority");
    prioritySelect.value = task.priority;
    prioritySelect.dataset.priority = task.priority.toLowerCase();

    addProjectSelect(document.getElementById("edit-task-project"), task.projectId);
    
    const checklistStart = task.checklist?.length ? task.checklist : [{id: crypto.randomUUID(), text: "", done: false }];
    displayChecklistRows("#edit-task-checklist-items", checklistStart);
    form.dataset.editingId = taskId;
}

function createChecklistItemRow(item = { id: crypto.randomUUID(), text: "", done: false }) {
    const row = document.createElement("div");
    row.classList.add("checklist-item");
    row.dataset.id = item.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.classList.add("checklist-item-checkbox");
    checkbox.checked = item.done;
    checkbox.addEventListener("change", () => {
        text.classList.toggle("done", checkbox.checked);
    });

    const text = document.createElement("input");
    text.type = "text";
    text.classList.toggle("done", item.done);
    text.classList.add("checklist-item-text");
    text.placeholder = "Type here";
    text.value = item.text;
    text.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    });

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.classList.add("checklist-item-remove");
    removeBtn.textContent = "×";

    row.append(checkbox, text, removeBtn);
    return row;
}

export function displayChecklistRows(containerSelector, items = []) {
    const container = document.querySelector(containerSelector);
    container.innerHTML = "";
    items.forEach(item => container.appendChild(createChecklistItemRow(item)));
}

export function addChecklistRow(containerSelector) {
    const container = document.querySelector(containerSelector);
    const row = createChecklistItemRow();
    container.appendChild(row);
    row.querySelector(".checklist-item-text").focus();
}

export function collectChecklistFromForm(containerSelector) {
    const rows = document.querySelectorAll(`${containerSelector} .checklist-item`);
    return [...rows]
        .map(row => ({
            id: row.dataset.id,
            text: row.querySelector(".checklist-item-text").value.trim(),
            done: row.querySelector(".checklist-item-checkbox").checked
        }))
        .filter(item => item.text);
}

// modals
// ==========================================

export function resetColorPicker() {
    const defaultSwatch = document.querySelector(".color-swatch");
    document.getElementById("project-color").value = defaultSwatch.dataset.color;

    document.querySelectorAll(".color-swatch").forEach(swatch => swatch.classList.remove("selected"));
    defaultSwatch.classList.add("selected");
}

export function displayProjectModalForAdd() {
    document.getElementById("project-modal-title").textContent = "Add project";
    document.getElementById("project-form").reset();
    document.getElementById("project-form").dataset.editingId = "";
    resetColorPicker();
}


export function displayProjectModalForEdit(projectId) {
    const project = state.getProjectById(projectId);
    if (!project) return;

    document.getElementById("project-modal-title").textContent = "Edit project";
    document.getElementById("project-title").value = project.title;
    document.getElementById("project-description").value = project.description ?? "";
    document.getElementById("project-color").value = project.color;

    document.querySelectorAll(".color-swatch").forEach(swatch => {
        swatch.classList.toggle("selected", swatch.dataset.color === project.color);
    });

    document.getElementById("project-form").dataset.editingId = projectId;
    document.getElementById("project-modal").showModal();
}

export function displayDeleteModal({title, message, id, type}) {
    document.getElementById("delete-modal-title").textContent = title;
    document.getElementById("delete-modal-msg").textContent = message;
    document.getElementById("item-delete-btn").textContent = title;

    const confirmBtn = document.getElementById("item-delete-btn");
    confirmBtn.dataset.deletingId = id;
    confirmBtn.dataset.deletingType = type;

    document.getElementById("item-delete-modal").showModal();
}

export function displayDeleteProjectModal(projectId) {
    const project = state.getProjectById(projectId);
    if (!project) return;

    displayDeleteModal({
        title: "Delete project",
        message: `Are you sure you want to delete "${project.title}"? This will also delete all of its tasks.`,
        id: projectId,
        type: "project"
    });
}

export function displayDeleteTaskModal(taskId) {
    const task = state.getTaskById(taskId);
    if (!task) return;

    displayDeleteModal({
        title: "Delete task",
        message: `Are you sure you want to delete "${task.title}"? This can't be undone.`,
        id: taskId,
        type: "task"
    });
}