import "./styles.css";
import { addProjectToList } from "./state.js";
import "./events.js";
import { displayProjects } from "./render.js";

addProjectToList("test", "test", "test");
displayProjects();