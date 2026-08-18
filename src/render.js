import { getProjects } from "./state.js";

function createProjectItem(project) {
    const projectItem = document.createElement("li");
    const projectTitle = document.createElement("h3");

    projectTitle.textContent = project.title;

    projectItem.append(projectTitle);

    return projectItem;
}

export function displayProjects() {
    const list = document.querySelector(".nav-projects");
    list.innerHTML = "";
    getProjects().forEach(project => list.appendChild(createProjectItem(project)));
}



/* function createTaskCard(task) {

}

function displayTasks() {

} */
