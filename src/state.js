// views, projects and tasks
// ==========================================

const views = [
    { id: "all", title: "All", description: "Every task across all projects", type: "view", icon: "list-todo" },
    { id: "today", title: "Today", description: "Tasks due today", type: "view", icon: "calendar" },
    { id: "unassigned", title: "Unassigned", description: "Tasks with no project", type: "view", icon: "circle-question-mark"}
];

const projects = [];
const tasks = [];

let activeFilterId = "all";

// projects
// ==========================================

class Project {
    constructor(title, description, color) {
        this.id = crypto.randomUUID();
        this.type = "project";
        this.title = title;
        this.description = description;
        this.color = color;
        this.icon = "square";
    }
}

export function addProjectToList(title, description, color) {
    const project = new Project(title, description, color);
    projects.push(project);
    return project;
}

export function updateProject(id, updates) {
  const project = getProjectById(id);
  if (project) {
    Object.assign(project, updates);
  }
  return project;
}

export function getViews() {
  return views;
}

export function getProjects() {
    return projects;
}

export function getProjectById(id) {
  return projects.find(project => project.id === id);
}

export function setActiveFilter(id) {
    activeFilterId = id;
}

export function getActiveFilter() {
    return views.find(v => v.id === activeFilterId)
        || projects.find(p => p.id === activeFilterId)
}

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
        this.done = false;
    }
}

export function addTaskToProject(projectId, title, description, dueDate, priority) {
    const task = new Task(projectId, title, description, dueDate, priority);
    tasks.push(task);
    return task;
}

export function getTaskById(id) {
  return tasks.find(task => task.id === id);
}

export function updateTask(id, updates) {
  const task = getTaskById(id);
  if (task) {
    Object.assign(task, updates);
  }
  return task;
}

export function getFilteredTasks() {
    const active = getActiveFilter();

    if (active.id === "all") return tasks;

    if (active.id === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        return tasks.filter(task => task.dueDate === todayStr);
    }

    if (active.id === "unassigned") {
        return tasks.filter(task => !task.projectId);
    }

    return tasks.filter(task => task.projectId === active.id);
}

export function toggleTaskDone(taskId) {
  const task = getTaskById(taskId);
  if (task) {
    task.done = !task.done;
  }
}