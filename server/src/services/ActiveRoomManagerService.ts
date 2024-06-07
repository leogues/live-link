import { IMessageRepositoryClass } from "../interfaces/repositories/IMessageRepository";
import { IPeerRepositoryClass } from "../interfaces/repositories/IPeerRepository";
import { IActiveRoomManagerService } from "../interfaces/services/IActiveRoomManagerService";
import {
    IActiveRoomService, IActiveRoomServiceClass
} from "../interfaces/services/IActiveRoomService";

export class ActiveRoomManagerService implements IActiveRoomManagerService {
  private rooms: Record<string, IActiveRoomService>
  private userSocketMap: Record<string, string>

  constructor(
    private PeerRepository: IPeerRepositoryClass,
    private MessageRepository: IMessageRepositoryClass,
    private ActiveRoomService: IActiveRoomServiceClass
  ) {
    this.rooms = {}
    this.userSocketMap = {}
  }

  public createRoom(roomId: string): IActiveRoomService {
    if (!this.rooms[roomId]) {
      const peerRepository = new this.PeerRepository()
      const messageRepository = new this.MessageRepository()
      this.rooms[roomId] = new this.ActiveRoomService(
        roomId,
        messageRepository,
        peerRepository
      )
    }

    return this.rooms[roomId]
  }

  public getRoom(roomId: string): IActiveRoomService {
    if (!this.rooms[roomId]) {
      this.createRoom(roomId)
    }

    return this.rooms[roomId]
  }

  public addUserSocket(userId: string, socketId: string): void {
    this.userSocketMap[userId] = socketId
  }

  public getUserSocket(userId: string): string | undefined {
    return this.userSocketMap[userId]
  }

  public removeUserSocket(userId: string): void {
    delete this.userSocketMap[userId]
  }
}
