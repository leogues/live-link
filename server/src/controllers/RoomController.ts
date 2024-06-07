import { Request, Response } from "express";

import { RoomRepository } from "../repositories/database/RoomRepository";
import { RoomService } from "../services/RoomService";

const roomRepository = new RoomRepository()
const roomService = new RoomService(roomRepository)

export class RoomController {
  static async Show(req: Request, res: Response) {
    try {
      const { id } = req.params

      const room = await roomService.getRoomById(id)

      return res.json(room)
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  static async Create(req: Request, res: Response) {
    try {
      const { topic } = req.body

      const { id: userId } = (await req.user) as User

      const room = await roomService.createRoom({
        topic,
        userId,
      })

      return res.json(room)
    } catch (error) {
      console.error(error)

      return res.status(500).json({ error: 'Internal Server Error' })
    }
  }
}
