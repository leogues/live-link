import { IRoomRepository } from '../../interfaces/repositories/IRoomRepository'
import prisma from '../../database/client'

export class RoomRepository implements IRoomRepository {
  findById(id: string): Promise<Room | null> {
    try {
      const room = prisma.room.findUnique({
        where: {
          id,
        },
      })

      return room
    } catch (error) {
      console.error('Erro ao buscar sala por ID:', error)

      throw error
    }
  }

  create(roomData: newRoom): Promise<Room> {
    const { topic, userId } = roomData
    try {
      const room = prisma.room.create({
        data: {
          topic,
          userId,
        },
      })

      return room
    } catch (error) {
      console.error('Erro ao criar sala:', error)

      throw error
    }
  }
}
