import Events from "events";
import CliConfig from "./src/cliConfig";
import SocketClient from "./src/socket";
import TerminalController from "./src/terminalController.js";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
async function main() {
  await socketClient.initialize();
}

main();
// const controller = new TerminalController()
// await controller.initializeTable(componentEmitter)
