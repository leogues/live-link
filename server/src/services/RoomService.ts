import { IRoomRepository } from "../interfaces/repositories/IRoomRepository";
import { IRoomService } from "../interfaces/services/IRoomService";

export class RoomService implements IRoomService {
  constructor(private roomRepository: IRoomRepository) {}

  getRoomById(id: string): Promise<Room | null> {
    return this.roomRepository.findById(id)
  }
  createRoom(roomData: newRoom): Promise<Room> {
    return this.roomRepository.create(roomData)
  }
}
