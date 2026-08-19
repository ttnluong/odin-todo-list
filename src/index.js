import "./styles.css";
import { addProjectToList } from "./state.js";
import { refresh, attachEvents } from "./events.js";
import { displaySidebar, displayHeader } from "./render.js";

addProjectToList("test", "test", "test");

refresh();
attachEvents();