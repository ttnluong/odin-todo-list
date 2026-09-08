import "./styles.css";
import { addExamples, loadState } from "./state.js";
import { refresh, attachEvents } from "./events.js";

loadState();
addExamples();
refresh();
attachEvents();