import { addProjectToList, setActiveFilter } from "./state.js";
import { displaySidebar, displayHeader} from "./render.js";

export function refresh() {
  displaySidebar();
  displayHeader();
}

const addProject = document.getElementById("project-form");

addProject.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("project-title").value;
    const description = document.getElementById("project-description").value;
    const color = document.getElementById("project-color").value;

    const newProject = addProjectToList(title, description, color);
    setActiveFilter(newProject.id);

    refresh();
    document.getElementById("project-modal").close();
    addProject.reset();
});

const sidebar = document.getElementById("sidebar");

export function attachEvents() {
    sidebar.addEventListener("click", (e) => {
    const btn = e.target.closest(".sidebar-item");
    if (btn) {
        setActiveFilter(btn.dataset.id);
        refresh();
    };
});
};