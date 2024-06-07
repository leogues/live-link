export interface IRoomRepository {
  findById(id: string): Promise<Room | null>
  create(userData: newRoom): Promise<Room>
}
