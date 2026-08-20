import { addProjectToList, setActiveFilter, addTaskToProject, toggleTaskDone, updateTask } from "./state.js";
import { displaySidebar, displayHeader, displayTasks, displayTaskEditor } from "./render.js";

export function refresh() {
  displaySidebar();
  displayHeader();
  displayTasks();
}

function submitProject() {
    const projectForm = document.getElementById("project-form");

    projectForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("project-title").value;
        const description = document.getElementById("project-description").value;
        const color = document.getElementById("project-color").value;

        const newProject = addProjectToList(title, description, color);
        setActiveFilter(newProject.id);
        refresh();

        document.getElementById("project-modal").close();
        projectForm.reset();
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

function submitTask() {
    const taskForm = document.getElementById("task-form");

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.getElementById("task-title").value;
        const description = document.getElementById("task-description").value;
        const dueDate = document.getElementById("task-due").value;
        const priority = document.getElementById("task-priority").value;
        const projectId = document.getElementById("task-project").value;

        const newTask = addTaskToProject(projectId, title, description, dueDate, priority);
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
  const aside = document.querySelector(".task-form")

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
    displayTaskEditor(); // hides form after saving
  });

  document.getElementById("edit-task-cancel").addEventListener("click", () => {
    editForm.reset();
    displayTaskEditor(); // hides form on cancel
  });

}


export function attachEvents() {
    submitProject();
    selectFilter();
    submitTask();
    toggleTaskCheckbox();
    editTask();
}


