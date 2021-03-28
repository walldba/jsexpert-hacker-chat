import Events from "events";
import CliConfig from "./src/cliConfig";
import EventManager from "./src/eventManager";
import SocketClient from "./src/socket";
import TerminalController from "./src/terminalController";

const componentEmitter = new Events();

const controller = new TerminalController();

const [node, dsa, ...commands] = process.argv;

const config = CliConfig.parseArguments(commands);

const socketClient = new SocketClient(config);

async function main() {
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
