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
  [k: string]: any;

  users: Map<string, User> = new Map();
  rooms: Map<string, Map<string, User>> = new Map();
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

  broadcast({
    socketId,
    roomId,
    event,
    message,
    includeCurrentSocket = false,
  }: any) {
    const usersOnRoom = this.rooms.get(roomId);

    if (usersOnRoom)
      for (const [key, user] of usersOnRoom) {
        if (!includeCurrentSocket && key === socketId) continue;
        this.socketServer.sendMessage(user?.socket, event, message);
      }
  }

  async joinRoom(socketId: string, data: User) {
    const userData = data;
    const user = this.updateGlobalUserData(socketId, userData);

    console.log(`${userData.username} joined: ${socketId}`);
    const { roomId } = userData;

    const users = this.joinUserInRoom(String(roomId), user);

    const currentUsers = (Array.from(
      users.values()
    ) as User[]).map(({ id, username }) => ({ id, username }));

    this.socketServer.sendMessage(
      user?.socket,
      constants.event.UPDATE_USERS,
      currentUsers
    );

    this.broadcast({
      socketId,
      roomId,
      message: { id: socketId, username: user?.username },
      event: constants.event.NEW_USER_CONNECTED,
    });
  }

  message(socketId: string, message: string) {
    const user = this.users.get(socketId);
    console.log(`${user?.username} said: ${message}`);
    this.broadcast({
      socketId,
      roomId: user?.roomId,
      message: { username: user?.username, message: message },
      event: constants.event.MESSAGE,
      includeCurrentSocket: true,
    });
  }

  joinUserInRoom(roomId: string, user: any) {
    const usersOnRoom = this.rooms.get(roomId) ?? new Map();
    usersOnRoom.set(user.id, user);

    this.rooms.set(roomId, usersOnRoom);

    return usersOnRoom;
  }

  private logoutUser(id: string, roomId: string) {
    this.users.delete(id);
    const usersOnRoom = this.rooms.get(roomId);
    usersOnRoom?.delete(id);

    if (usersOnRoom) this.rooms.set(roomId, usersOnRoom);
  }

  private onSocketData(id: string) {
    return (data: string) => {
      try {
        const { event, message } = JSON.parse(data);
        this[event](id, message);
      } catch (error) {
        console.error("Wrong event format", error);
      }
    };
  }

  private onSocketClosed(id: string) {
    return (_: void) => {
      const user = this.users.get(id);
      this.logoutUser(id, String(user?.roomId));
      this.broadcast({
        roomId: user?.roomId,
        message: { id, username: user?.username },
        socketId: id,
        event: constants.event.DISCONNECT_USER,
      });
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
