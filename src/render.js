import { getViews, getProjects, getActiveFilter } from "./state.js";

function createItem(item) {
    const listItem = document.createElement("li");
    const button = document.createElement("button");

    button.classList.add("sidebar-item");
    button.dataset.id = item.id;
    button.textContent = item.title;

    listItem.append(button);

    return listItem;
}

export function displaySidebarList(container, items) {
    const list = document.querySelector(container);
    list.innerHTML = "";
    items.forEach(item => list.appendChild(createItem(item)));
}

export function displaySidebar() {
    displaySidebarList(".view-list", getViews());
    displaySidebarList(".project-list", getProjects())
}


function displayHeader() {
    const header = document.querySelector("header");
    const headerTitle = document.createElement("h1");
    const headerDescription = document.createElement("p");

    headerTitle.textContent = project.title;
}

/* function createTaskCard(task) {

}

function displayTasks() {

} */
