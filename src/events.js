const addProject = document.getElementById("project-form");

addProject.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = document.getElementById("project-title").value;

    addProject(title);
    displayProjects();
});