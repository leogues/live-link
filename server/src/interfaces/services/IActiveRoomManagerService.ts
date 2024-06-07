import { IActiveRoomService } from "./IActiveRoomService";

export interface IActiveRoomManagerService {
  createRoom(roomId: string): IActiveRoomService
  getRoom(roomId: string): IActiveRoomService
  addUserSocket(userId: string, socketId: string): void
  getUserSocket(userId: string): string | undefined
  removeUserSocket(userId: string): void
}
