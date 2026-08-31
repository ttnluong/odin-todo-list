import { 
    addProjectToList, 
    getActiveFilter,
    setActiveFilter, 
    deleteProject,
    addTaskToProject, 
    getTaskById,
    toggleTaskDone, 
    updateTask,
    toggleChecklistItem
} from "./state.js";

import { 
    displaySidebar, 
    displayHeader, 
    displayTasks, 
    displayTaskEditor, 
    fillProjectSelect, 
    openProjectModalForAdd,
    openProjectModalForEdit,
    displayDeleteProjectModal,
    renderChecklistRows,
    addChecklistRow,
    collectChecklistFromForm,
    displayQuickTask,
    editTaskTitle
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
      activeMoreBtn.classList.remove("menu-open"); // let it fade back to hover-only
      activeMoreBtn = null;
    }
  }

  document.getElementById("context-edit-btn").addEventListener("click", () => {
    closeMenu();
    openProjectModalForEdit(targetProjectId);
  });

  document.getElementById("context-delete-btn").addEventListener("click", () => {
    closeMenu();
    displayDeleteProjectModal(targetProjectId);
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

function deleteProjectEvents() {
    const projectDeleteBtn = document.getElementById("project-delete-btn");
  
    projectDeleteBtn.addEventListener("click", () => {
    const id = projectDeleteBtn.dataset.deletingId;

    const active = getActiveFilter();
    if (active?.id === id) {
      setActiveFilter("all");
    }

    deleteProject(id);
    refresh();
    document.getElementById("project-delete-modal").close();
  });
}

function selectFilter() {
    const sidebar = document.getElementById("sidebar");

    sidebar.addEventListener("click", (e) => {
        const btn = e.target.closest(".sidebar-item");
        if (btn && !e.target.closest(".sidebar-more-btn")) {
            setActiveFilter(btn.dataset.id);
            refresh();
        }
    });
}


function openTaskModal() {
    document.getElementById("add-task-btn").addEventListener("click", () => {
    fillProjectSelect();
    renderChecklistRows("#task-checklist-items", []);
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

        const checklist = collectChecklistFromForm("#task-checklist-items");
        addTaskToProject(projectId, title, description, dueDate, priority, checklist);
        refresh();

        document.getElementById("task-modal").close();
        taskForm.reset();
        renderChecklistRows("#task-checklist-items", []);
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

function checklistEvents(containerSelector, addBtnSelector) {
    document.querySelector(addBtnSelector).addEventListener("click", () => {
        addChecklistRow(containerSelector);
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
      projectId: document.getElementById("edit-task-project").value || null,
      checklist: collectChecklistFromForm("#edit-task-checklist-items")
    });

    document.activeElement.blur();
    displayTasks();
  });

  document.getElementById("edit-task-cancel").addEventListener("click", () => {
    editForm.reset();
    displayTaskEditor();
  });
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
        const task = getTaskById(card.dataset.id);
        editTaskTitle(card, task);
    });
}

export function attachEvents() {
    openAddProjectModal();
    projectContextMenu();
    selectProjectColor();
    submitProject();
    resetProjectModal();
    deleteProjectEvents();
    selectFilter();
    openTaskModal();
    submitTask();
    toggleTaskCheckbox();
    checklistEvents("#task-checklist-items", "#task-add-checklist-item-btn");
    checklistEvents("#edit-task-checklist-items", "#edit-task-add-checklist-item-btn");
    editTask();
    addQuickTask();
    editTaskTitleInline();
}


