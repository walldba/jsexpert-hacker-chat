import SocketServer from "./socket";
import Event from "events";
import { constants } from "./constants";
import Controller from "./controller";

const eventEmitter = new Event();

const port = !process.env.PORT ? 9898 : Number(process.env.PORT);
const socketServer = new SocketServer({ port });
async function main() {
  const server = await socketServer.initialize(eventEmitter);
  console.log(server?.address());
}

const controller = new Controller(socketServer);
eventEmitter.on(
  constants.event.NEW_USER_CONNECTED,
  controller.onNewConnection.bind(controller)
);

main();
