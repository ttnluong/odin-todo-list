import "./styles.css";
import { addProjectToList, addTaskToProject, addExamples } from "./state.js";
import { refresh, attachEvents } from "./events.js";
import { displaySidebar, displayHeader } from "./render.js";

addExamples();
refresh();
attachEvents();