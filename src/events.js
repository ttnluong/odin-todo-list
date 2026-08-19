import { addProjectToList } from "./state.js";
import { displaySidebar } from "./render.js";

const addProject = document.getElementById("project-form");

addProject.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("project-title").value;
    const description = document.getElementById("project-description").value;
    const color = document.getElementById("project-color").value;

    addProjectToList(title, description, color);
    displaySidebar();
    document.getElementById("project-modal").close();
});