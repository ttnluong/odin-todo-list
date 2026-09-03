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
        || projects.find(project => project.id === activeFilterId)
}

export function deleteProject(id) {
  const index = projects.findIndex(project => project.id === id);
  if (index === -1) return;

  projects.splice(index, 1);

  for (let i = tasks.length - 1; i >= 0; i--) {
    if (tasks[i].projectId === id) {
      tasks.splice(i, 1);
    }
  }
}

// tasks
// ==========================================

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
        this.done = false;
    }
}

export function addTaskToProject(projectId, title, description, dueDate, priority, notes, checklist = []) {
    const task = new Task(projectId, title, description, dueDate, priority, notes, checklist);
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

export function getFilteredTasks(filterId) {
    const id = filterId ?? getActiveFilter()?.id;

    if (id === "all") return tasks;

    if (id === "today") {
        const todayStr = new Date().toISOString().split("T")[0];
        return tasks.filter(task => task.dueDate === todayStr);
    }

    if (id === "unassigned") {
        return tasks.filter(task => !task.projectId);
    }

    return tasks.filter(task => task.projectId === id);
}

export function getTaskCountPerFilter(filterId) {
    return getFilteredTasks(filterId).filter(task => !task.done).length;
}

export function toggleTaskDone(taskId) {
  const task = getTaskById(taskId);
  if (task) {
    task.done = !task.done;
  }
}

export function toggleChecklistItem(taskId, itemId) {
    const task = getTaskById(taskId);
    const item = task?.checklist.find(item => item.id === itemId);
    if (item) item.done = !item
}

export function getChecklistProgress(task) {
    if (!task.checklist?.length) return null;
    return {done: task.checklist.filter(item => item.done).length, total: task.checklist.length};
}

export function deleteTask(id) {
    const index = tasks.findIndex(task => task.id === id);
    if (index === -1) return;
    tasks.splice(index, 1);
}

// examples
// ==========================================

export function addExamples() {
    if (projects.length || tasks.length) return; // don't reseed if data already exists

    const work = addProjectToList("Work", "Tasks related to my job", "#BF63F3");
    const personal = addProjectToList("Personal", "Life admin and personal goals", "#2ABB7F");
    const learning = addProjectToList("Learning", "Courses and skills to pick up", "#42B2D7");

    const dayOffset = (n) => new Date(Date.now() + n * 86400000).toISOString().split("T")[0];

    const today = dayOffset(0);
    const tomorrow = dayOffset(1);
    const overdue = dayOffset(-4);
    const coming = dayOffset(14);

    addTaskToProject(work.id, "Finish quarterly report", "Include Q3 numbers and forecast", today, "High", "",
        [{ id: crypto.randomUUID(), text: "Gather sales data", done: true },
         { id: crypto.randomUUID(), text: "Write summary", done: false }]);

    addTaskToProject(work.id, "Reply to client emails", "", tomorrow, "Medium", "");

    addTaskToProject(personal.id, "Book dentist appointment", "", overdue, "Low", "Call before 11am");

    addTaskToProject(learning.id, "Finish CSS grid course", "Module 4 onward", coming, "Medium", "",
        [{ id: crypto.randomUUID(), text: "Watch lesson 5", done: false },
         { id: crypto.randomUUID(), text: "Do the practice exercise", done: false }]);

    addTaskToProject(null, "Unassigned quick task", "", "", "Low", ""); // no project, tests the "Unassigned" view
}