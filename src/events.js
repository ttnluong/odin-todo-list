import { 
    addProjectToList, 
    setActiveFilter, 
    addTaskToProject, 
    toggleTaskDone, 
    updateTask
} from "./state.js";

import { 
    displaySidebar, 
    displayHeader, 
    displayTasks, 
    displayTaskEditor, 
    fillProjectSelect, 
    openProjectModalForAdd,
    openProjectModalForEdit
} from "./render.js";

export function refresh() {
  displaySidebar();
  displayHeader();
  displayTasks();
}

function openAddProjectModal() {
  document.getElementById("add-project-btn").addEventListener("click", () => {
    openProjectModalForAdd();
  });
}

function projectContextMenu() {
  const sidebar = document.getElementById("sidebar");
  const contextMenu = document.getElementById("project-context-menu");
  let targetProjectId = null;

  sidebar.addEventListener("click", (e) => {
    const moreBtn = e.target.closest(".sidebar-more-btn");
    if (!moreBtn) return;

    e.stopPropagation();
    targetProjectId = moreBtn.dataset.id;

    const rect = moreBtn.getBoundingClientRect();
    contextMenu.style.top = `${rect.bottom + 4}px`;
    contextMenu.style.left = `${rect.left}px`;
    contextMenu.classList.remove("hidden");
  });

  document.getElementById("context-edit-btn").addEventListener("click", () => {
    contextMenu.classList.add("hidden");
    openProjectModalForEdit(targetProjectId);
  });

  document.getElementById("context-delete-btn").addEventListener("click", () => {
    contextMenu.classList.add("hidden");
    document.getElementById("delete-project-modal").showModal();
  });

  document.addEventListener("click", () => {
    contextMenu.classList.add("hidden");
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

export function resetColorPicker() {
  const defaultSwatch = document.querySelector(".color-swatch");
  document.getElementById("project-color").value = defaultSwatch.dataset.color;

  document.querySelectorAll(".color-swatch").forEach(swatch => swatch.classList.remove("selected"));
  defaultSwatch.classList.add("selected");
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
            updateProject(editingId, { title, description, color });
        } else {
            const newProject = addProjectToList(title, description, color);
            setActiveFilter(newProject.id);
        }

        refresh();
        document.getElementById("project-modal").close();
        resetColorPicker();
    });
}

function resetProjectModal() {
  const modal = document.getElementById("project-modal");

  modal.addEventListener("close", () => {
    document.getElementById("project-form").reset();
    resetColorPicker();
  });
}

function selectFilter() {
    const sidebar = document.getElementById("sidebar");

    sidebar.addEventListener("click", (e) => {
        const btn = e.target.closest(".sidebar-item");
        if (btn) {
            setActiveFilter(btn.dataset.id);
            refresh();
        }
    });
}

function openTaskModal() {
    document.getElementById("add-task-btn").addEventListener("click", () => {
    fillProjectSelect();
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

        addTaskToProject(projectId, title, description, dueDate, priority);
        refresh();

        document.getElementById("task-modal").close();
        taskForm.reset();
    });
}

function toggleTaskCheckbox() {
    const taskList = document.getElementById("tasks-list");

    taskList.addEventListener("change", (e) => {
        if (e.target.classList.contains("task-checkbox")) {
            const card = e.target.closest(".card-task");
            toggleTaskDone(card.dataset.id);
            refresh();
        }
    });
}

function editTask() {
  const taskList = document.getElementById("tasks-list");
  const editForm = document.getElementById("edit-task-form");

  taskList.addEventListener("click", (e) => {
    if (e.target.classList.contains("task-checkbox")) return;
    const card = e.target.closest(".card-task");
    if (card) {
      displayTaskEditor(card.dataset.id);
    }
  });

  editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const taskId = editForm.dataset.editingId;

    updateTask(taskId, {
      title: document.getElementById("edit-task-title").value.trim(),
      description: document.getElementById("edit-task-description").value.trim(),
      dueDate: document.getElementById("edit-task-due").value,
      priority: document.getElementById("edit-task-priority").value,
      projectId: document.getElementById("edit-task-project").value || null
    });

    displayTasks();
    displayTaskEditor();
  });

  document.getElementById("edit-task-cancel").addEventListener("click", () => {
    editForm.reset();
    displayTaskEditor();
  });
}

export function attachEvents() {
    openAddProjectModal();
    projectContextMenu();
    selectProjectColor();
    submitProject();
    resetProjectModal();
    selectFilter();
    openTaskModal();
    submitTask();
    toggleTaskCheckbox();
    editTask();
}


