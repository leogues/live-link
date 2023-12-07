export interface IRoomService {
  getRoomById(id: string): Promise<Room | null>
  createRoom(userData: newRoom): Promise<Room>
}
