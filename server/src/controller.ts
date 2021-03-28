import { constants } from "./constants";
import ISocket from "./interfaces/ISocket";
import SocketServer from "./socket";

interface User {
  id: string;
  socket?: ISocket;
  username?: string;
  roomId?: string;
}

export default class Controller {
  users: Map<string, User> = new Map();
  socketServer: SocketServer;

  constructor(socketServer: SocketServer) {
    this.socketServer = socketServer;
  }

  onNewConnection(socket: ISocket) {
    const { id } = socket;
    const userData: User = { id, socket };

    this.updateGlobalUserData(id, userData);

    socket.on("data", this.onSocketData(id));
    socket.on("error", this.onSocketClosed(id));
    socket.on("end", this.onSocketClosed(id));
  }

  private onSocketData(id: string) {
    return (data: string) => {
      console.log("onSocketData", data.toString());
    };
  }

  private onSocketClosed(id: string) {
    return (data: string) => {
      console.log("onSocketClosed", data.toString());
    };
  }

  updateGlobalUserData(socketId: string, userData: User) {
    const users = this.users;
    const user = users.get(socketId);

    const updatedUserData = {
      ...user,
      ...userData,
    };

    users.set(socketId, updatedUserData);

    return users.get(socketId);
  }
}
