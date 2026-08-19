import "./styles.css";
import { addProjectToList, addTaskToProject } from "./state.js";
import { refresh, attachEvents } from "./events.js";
import { displaySidebar, displayHeader } from "./render.js";

addProjectToList("test", "test", "test");
addTaskToProject("test", "test2", "test3", "test4", "test5");

refresh();
attachEvents();