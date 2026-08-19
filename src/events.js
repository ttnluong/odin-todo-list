import { addProjectToList, setActiveFilter } from "./state.js";
import { displaySidebar, displayHeader} from "./render.js";

export function refresh() {
  displaySidebar();
  displayHeader();
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

export function attachEvents() {
    submitProject();
    selectFilter();
}