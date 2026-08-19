// constructors
// ==========================================

export class Project {
    constructor(title, description, color) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.color = color;
    };
};

// filters, projects and tasks
// ==========================================

const views = [
    { id: "all", title: "All", description: "All tasks", color: "" },
    { id: "today", title: "Today", description: "All tasks for today", color: "" },
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


/* class Task {
    constructor(projectId, title, description, dueDate, priority, notes, checklist) {
        this.id = crypto.randomUUID();
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
    };
};

function addTaskToProject() {
    const task = new Task();
    tasks.push(task);
}; */