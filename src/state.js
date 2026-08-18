const projects = [];
const tasks = [];

class Project {
    constructor(title, color, order) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.color = color;
        this.order = order;
    };
};

function addProjectToList {
    const project = new Project();
    projects.push(project);
};

class Task {
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

function addTaskToProject {
    const task = new Task();
    tasks.push(task);
};
