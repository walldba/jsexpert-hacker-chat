import Events from "events";
import CliConfig from "./src/cliConfig";
import EventManager from "./src/eventManager";
import SocketClient from "./src/socket";
import TerminalController from "./src/terminalController";

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
async function main() {
  const controller = new TerminalController();
  await controller.initializeTable(componentEmitter);
  await socketClient.initialize();
  const eventManager = new EventManager({ componentEmitter, socketClient });
  const events = eventManager.getEvents();
  socketClient.attachEvents(events);

  const data = {
    roomId: config.room,
    username: config.username,
  };

  eventManager.joinRoomAndWaitForMessage(data);
}

main();
