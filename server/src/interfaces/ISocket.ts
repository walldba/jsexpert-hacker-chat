import { Socket } from "net";

export default interface ISocket extends Socket {
  id: string;
}
