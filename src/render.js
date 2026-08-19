import { getViews, getProjects, getActiveFilter, setActiveFilter } from "./state.js";

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
    displaySidebarList(".views-list", getViews());
    displaySidebarList(".projects-list", getProjects())
}


export function displayHeader() {
    const active = getActiveFilter();

    const headerTitle = document.getElementById("header-title");
    const headerDescription = document.getElementById("header-description");

    headerTitle.textContent = active.title;
    headerDescription.textContent = active.description;
}


/* function createTaskCard(task) {

}

function displayTasks() {

} */
