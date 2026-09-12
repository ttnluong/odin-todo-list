import * as state from "./state.js";
import * as render from "./render.js";

export function refresh() {
  render.displaySidebar();
  render.displayHeader();
  render.displayTasks();
}

// projects / sidebar
// ==========================================


function openProjectModalForAdd() {
    document.getElementById("add-project-btn").addEventListener("click", () => {
        render.displayProjectModalForAdd();
    });
}

function projectContextMenu() {
    const sidebar = document.getElementById("sidebar");
    const contextMenu = document.getElementById("project-context-menu");
    let targetProjectId = null;
    let activeMoreBtn = null;

    sidebar.addEventListener("click", (e) => {
        const moreBtn = e.target.closest(".sidebar-more-btn");
        if (!moreBtn) return;

        e.stopPropagation();
        targetProjectId = moreBtn.dataset.id;
        activeMoreBtn = moreBtn;
        activeMoreBtn.classList.add("menu-open");

        const rect = moreBtn.getBoundingClientRect();
        contextMenu.style.top = `${rect.bottom + 4}px`;
        contextMenu.style.left = `${rect.left}px`;
        contextMenu.classList.remove("hidden");
    });

    function closeMenu() {
        contextMenu.classList.add("hidden");
        if (activeMoreBtn) {
        activeMoreBtn.classList.remove("menu-open");
        activeMoreBtn = null;
        }
    }

    document.getElementById("context-edit-btn").addEventListener("click", () => {
        closeMenu();
        render.displayProjectModalForEdit(targetProjectId);
    });

    document.getElementById("context-delete-btn").addEventListener("click", () => {
        closeMenu();
        render.displayDeleteProjectModal(targetProjectId);
    });

    document.addEventListener("click", () => {
        closeMenu();
    });
}

function selectProjectColor() {
    const colorPicker = document.getElementById("project-color-picker");
    
    colorPicker.addEventListener("click", (e) => {
    const swatch = e.target.closest(".color-swatch");
    if (swatch) {
        document.getElementById("project-color").value = swatch.dataset.color;
        document.querySelectorAll(".color-swatch").forEach(swatch => swatch.classList.remove("selected"));
        swatch.classList.add("selected");
    }
});
}

function submitProject() {
    const projectForm = document.getElementById("project-form");

    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("project-title").value.trim();
        const description = document.getElementById("project-description").value.trim();
        const color = document.getElementById("project-color").value;

        const editingId = projectForm.dataset.editingId;

        if (editingId) {
            state.updateProject(editingId, { title, description, color });
        } else {
            const newProject = state.addProjectToList(title, description, color);
            state.setActiveFilter(newProject.id);
        }

        refresh();
        document.getElementById("project-modal").close();
        render.resetColorPicker();
    });
}

function resetProjectModal() {
    const modal = document.getElementById("project-modal");

    modal.addEventListener("close", () => {
        document.getElementById("project-form").reset();
        render.resetColorPicker();
    });
}

function selectFilter() {
    const sidebar = document.getElementById("sidebar");

    sidebar.addEventListener("click", (e) => {
        const btn = e.target.closest(".sidebar-item");
        if (btn && !e.target.closest(".sidebar-more-btn")) {
            state.setActiveFilter(btn.dataset.id);
            refresh();
        }
    });
}

function toggleSidebar() {
    const toggleBtn = document.getElementById("sidebar-toggle-btn");
    const sidebar = document.getElementById("sidebar");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    })

    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove("open");
        }
    });
}

// tasks
// ==========================================

function openTaskModal() {
    document.getElementById("add-task-btn").addEventListener("click", () => {
    render.fillProjectSelect();
    
    const prioritySelect = document.getElementById("task-priority");
    prioritySelect.value = "";
    delete prioritySelect.dataset.priority;

    render.displayChecklistRows("#task-checklist-items", [{ id: crypto.randomUUID(), text: "", done: false }]);
});
}

function updatePrioritySelectColor(selectId) {
    const select = document.getElementById(selectId);
    select.addEventListener("change", () => {
        select.dataset.priority = select.value.toLowerCase();
    });
}

function submitTask() {
    const taskForm = document.getElementById("task-form");

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value.trim();
        const description = document.getElementById("task-description").value.trim();
        const dueDate = document.getElementById("task-due").value;
        const priority = document.getElementById("task-priority").value;
        const projectId = document.getElementById("task-project").value || null;
        const notes = document.getElementById("task-notes").value.trim();
        const checklist = render.collectChecklistFromForm("#task-checklist-items");

        state.addTaskToProject(projectId, title, description, dueDate, priority, notes, checklist);
        refresh();

        document.getElementById("task-modal").close();
        taskForm.reset();
        render.displayChecklistRows("#task-checklist-items", [{ id: crypto.randomUUID(), text: "", done: false }]);
    });
}

function toggleTaskCheckbox() {
    const taskList = document.getElementById("tasks-list");

    taskList.addEventListener("change", (e) => {
        if (e.target.classList.contains("task-checkbox")) {
            const card = e.target.closest(".card-task");
            state.toggleTaskDone(card.dataset.id);
            refresh();
        }
    });
}

function checklistEvents(containerSelector, addBtnSelector) {
    document.querySelector(addBtnSelector).addEventListener("click", () => {
        render.addChecklistRow(containerSelector);
    });
    document.querySelector(containerSelector).addEventListener("click", (e) => {
        const removeBtn = e.target.closest(".checklist-item-remove");
        if (removeBtn) removeBtn.closest(".checklist-item").remove();
    });
}

function editTask() {
    const taskList = document.getElementById("tasks-list");
    const editForm = document.getElementById("edit-task-form");

    taskList.addEventListener("click", (e) => {
        if (e.target.classList.contains("task-checkbox")) return;
        const card = e.target.closest(".card-task");
        if (card) render.displayTaskEditor(card.dataset.id);
    });

    editForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const taskId = editForm.dataset.editingId;

        state.updateTask(taskId, {
            title: document.getElementById("edit-task-title").value.trim(),
            description: document.getElementById("edit-task-description").value.trim(),
            dueDate: document.getElementById("edit-task-due").value,
            priority: document.getElementById("edit-task-priority").value,
            projectId: document.getElementById("edit-task-project").value || null,
            notes: document.getElementById("edit-task-notes").value.trim(),
            checklist: render.collectChecklistFromForm("#edit-task-checklist-items")
        });

        document.activeElement.blur();
        render.displayTasks();
     });

    document.getElementById("edit-task-cancel").addEventListener("click", () => {
        editForm.reset();
        render.displayTaskEditor();
    });
}

function createQuickTask() {
    const quickTask = document.createElement("article");
    quickTask.classList.add("card-task", "card-task-new");

    const titleInput = render.createTaskTitleInput("", (value) => {
        quickTask.remove();
        if (!value) return;

        const active = state.getActiveFilter();
        const projectId = active?.type === "project" ? active.id : null;
        state.addTaskToProject(projectId, value, "", "", "");
        refresh();
        displayQuickTask();
    });

    quickTask.appendChild(titleInput);
    return quickTask;
}

function displayQuickTask() {
    const existing = document.querySelector(".card-task-new");
    if (existing) { existing.querySelector("input").focus(); return; }

    const tasksList = document.querySelector(".tasks-list");
    tasksList.appendChild(createQuickTask());
    tasksList.querySelector(".card-task-new input").focus();
}

function addQuickTask() {
    document.getElementById("quick-add-btn").addEventListener("click", () => {
        displayQuickTask();
    });
}

function editTaskTitleInline() {
    document.getElementById("tasks-list").addEventListener("click", (e) => {
        const titleEl = e.target.closest(".task-title");
        if (!titleEl) return;
        const card = titleEl.closest(".card-task");
        const task = state.getTaskById(card.dataset.id);
        render.editTaskTitle(card, task);
    });
}

// modals
// ==========================================

function deleteItemEvents() {
    const itemDeleteBtn = document.getElementById("item-delete-btn");
  
    itemDeleteBtn.addEventListener("click", () => {
        const id = itemDeleteBtn.dataset.deletingId;
        const type = itemDeleteBtn.dataset.deletingType;

        if (type === "project") {
            const active = state.getActiveFilter();
            if (active?.id === id) state.setActiveFilter("all");
            state.deleteProject(id);
        } else if (type === "task") {
            state.deleteTask(id);
        }

        refresh();
        document.getElementById("item-delete-modal").close();
    });
}

function deleteTaskEvents() {
    document.getElementById("edit-task-delete").addEventListener("click", () => {
        const editForm = document.getElementById("edit-task-form");
        const taskId = editForm.dataset.editingId;
        if (!taskId) return;
        render.displayDeleteTaskModal(taskId);
    });
}

function attachProjectEvents() {
    openProjectModalForAdd();
    projectContextMenu();
    selectProjectColor();
    submitProject();
    resetProjectModal();
    selectFilter();
    toggleSidebar();
}

function attachTaskEvents() {
    openTaskModal();
    submitTask();
    toggleTaskCheckbox();
    checklistEvents("#task-checklist-items", "#task-add-checklist-item-btn");
    checklistEvents("#edit-task-checklist-items", "#edit-task-add-checklist-item-btn");
    editTask();
    addQuickTask();
    editTaskTitleInline();
    updatePrioritySelectColor("task-priority");
    updatePrioritySelectColor("edit-task-priority");
}

function attachModalEvents() {
    deleteItemEvents();
    deleteTaskEvents();
}

export function attachEvents() {
    attachProjectEvents();
    attachTaskEvents();
    attachModalEvents();
}

