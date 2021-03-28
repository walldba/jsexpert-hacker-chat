import { Socket } from "net";
import CliConfig from "./cliConfig";

export default class SocketClient {
  private _serverConnection: Socket = new Socket();
  host: string;
  port: string;
  protocol: string;

  constructor({ host, port, protocol }: CliConfig) {
    this.host = host;
    this.port = port;
    this.protocol = protocol;
  }

  async createConnection(): Promise<Socket> {
    const options = {
      port: this.port,
      host: this.host,
      headers: {
        Connection: "Upgrade",
        Upgrade: "websocket",
      },
    };

    const http = await import(this.protocol);
    const req = http.request(options);
    req.end();

    return new Promise((resolve) => {
      req.once("upgrade", (res: any, socket: Socket) => resolve(socket));
    });
  }

  async initialize() {
    this._serverConnection = await this.createConnection();
    console.log("I connected to the server!!");
  }
}
