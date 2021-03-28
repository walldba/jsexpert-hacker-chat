import EventEmitter from "events";
import { constants } from "./constants";
import SocketClient from "./socket";

interface IEventManager {
  socketClient: SocketClient;
  componentEmitter: EventEmitter;
}

interface User {
  id: string;
  username: string;
}

export default class EventManager {
  [k: string]: any;

  private allUsers: Map<string, string> = new Map();
  componentEmitter: EventEmitter;
  socketClient: SocketClient;

  constructor({ componentEmitter, socketClient }: IEventManager) {
    this.componentEmitter = componentEmitter;
    this.socketClient = socketClient;
  }

  joinRoomAndWaitForMessage(data: any) {
    this.socketClient.sendMessage(constants.events.socket.JOIN_ROOM, data);

    this.componentEmitter.on(constants.events.app.MESSAGE_SENT, (msg) => {
      this.socketClient.sendMessage(constants.events.socket.MESSAGE, msg);
    });
  }

  newUserConnected(user: User) {
    const newUser = user;
    this.allUsers.set(newUser.id, newUser.username);

    this.updateUsersComponent();
    this.updateActivityLogComponent(`${newUser.username} joined!`);
  }

  updateUsers(users: User[]) {
    const connectedUsers = users;
    connectedUsers.forEach(({ id, username }) =>
      this.allUsers.set(id, username)
    );
    this.updateUsersComponent();
  }

  disconnectUser(user: User) {
    const { username, id } = user;
    this.allUsers.delete(id);

    this.updateActivityLogComponent(`${username} left!`);
    this.updateUsersComponent();
  }

  private updateActivityLogComponent(message: string) {
    this.componentEmitter.emit(
      constants.events.app.ACTIVITYLOG_UPDATED,
      message
    );
  }

  message(message: string) {
    this.componentEmitter.emit(constants.events.app.MESSAGE_RECEIVED, message);
  }

  private updateUsersComponent() {
    this.componentEmitter.emit(
      constants.events.app.STATUS_UPDATED,
      Array.from(this.allUsers.values())
    );
  }

  getEvents() {
    const functions: any[] = Reflect.ownKeys(EventManager.prototype)
      .filter((fn) => fn != "constructor")
      .map((name) => [name, this[String(name)].bind(this)]);

    return new Map(functions) as Map<string, () => void>;
  }
}
