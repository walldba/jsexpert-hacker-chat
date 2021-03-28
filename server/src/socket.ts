import http from "http";
import Event from "events";
import { Server } from "http";
import { v4 } from "uuid";
import { constants } from "./constants";
import ISocket from "./interfaces/ISocket";

export default class SocketServer {
  port: number;

  constructor({ port }: { port: number }) {
    this.port = port;
  }

  async sendMessage(socket: ISocket | undefined, event: string, message: any) {
    const data = JSON.stringify({ event, message });
    socket?.write(`${data}\n`);
  }

  async initialize(eventEmitter: Event): Promise<Server> {
    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Type": "text/plan" });
      res.end("hey itália");
    });

    server.on("upgrade", (req, socket) => {
      socket.id = v4();
      const headers = [
        "HTTP/1.1 101 Web Socket Protocol Handshake",
        "Upgrade: WebSocket",
        "Connection: Upgrade",
        "",
      ]
        .map((line) => line.concat("\r\n"))
        .join("");
      socket.write(headers);
      eventEmitter.emit(constants.event.NEW_USER_CONNECTED, socket);
    });

    return new Promise((resolve, reject) => {
      server.on("error", reject);
      server.listen(this.port, () => resolve(server));
    });
  }
}
