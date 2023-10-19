import { Request, Response } from 'express'
import prisma from '../database/client'
import { User } from '.prisma/client'

export const RoomController = {
  async Show(req: Request, res: Response) {
    const { id } = req.params

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        topic: true,
        userId: true,
        createdAt: true,
      },
    })

    return res.json(room)
  },

  async Create(req: Request, res: Response) {
    const { topic } = req.body
    const { id: userId } = (await req.user) as User

    const room = await prisma.room.create({
      data: {
        userId,
        topic,
      },
    })

    return res.json(room)
  },
}
