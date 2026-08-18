const projects = [];
const tasks = [];

export class Project {
    constructor(title, description, color, order) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.description = description;
        this.color = color;
        this.order = order;
    };
};

export function addProjectToList(title, description, color, order) {
    const project = new Project(title, description, color, order);
    projects.push(project);
    return project;
};

export function getProjects() {
    return projects;
}

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