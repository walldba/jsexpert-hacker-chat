import Events from "events";
import TerminalController from "./src/terminalController";

const componentEmitter = new Events();
const controller = new TerminalController();

controller.initializeTable(componentEmitter);
