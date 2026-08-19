import "./styles.css";
import { addProjectToList } from "./state.js";
import "./events.js";
import { displaySidebar } from "./render.js";

addProjectToList("test", "test", "test");
displaySidebar();