// constructors
// ==========================================

export class Project {
    constructor(title, description, color) {
        this.id = crypto.randomUUID();
        this.type = "project";
        this.title = title;
        this.description = description;
        this.color = color;
    };
};

// filters, projects and tasks
// ==========================================

const views = [
    { id: "all", title: "All", description: "Every task across all projects", type: "view" },
    { id: "today", title: "Today", description: "Task due today", type: "view" },
    { id: "unassigned", title: "Unassigned", description: "Tasks with no project", type: "view"}
];

const projects = [];
const tasks = [];

let activeFilterId = "all";

// sidebar
// ==========================================

export function getViews() {
  return views;
};

export function getProjects() {
    return projects;
};

export function addProjectToList(title, description, color) {
    const project = new Project(title, description, color);
    projects.push(project);
    return project;
};

export function setActiveFilter(id) {
    activeFilterId = id;
}

export function getActiveFilter() {
    return views.find(v => v.id === activeFilterId)
        || projects.find(p => p.id === activeFilterId)
};

// tasks
// ==========================================

class Task {
    constructor(projectId, title, description, dueDate, priority) {
        this.id = crypto.randomUUID();
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    };
};

export function addTaskToProject(projectId, title, description, dueDate, priority) {
    const task = new Task(projectId, title, description, dueDate, priority);
    tasks.push(task);
    return task;
};

export function getFilteredTasks() {
    const active = getActiveFilter();

    if (active.id === "all") return tasks;

    if (active.id === "unassigned") {
        return tasks.filter(task => !task.projectId);
    }

    return tasks.filter(task => task.projectId === active.id);
}