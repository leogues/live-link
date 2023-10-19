import { User } from '@prisma/client'
import { Request, Response } from 'express'

export const UserController = {
  async Index(req: Request, res: Response) {
    const { id, name, lastName, picture } = (await req.user) as User
    const user = { id, name, lastName, picture }

    return res.json(user)
  },
}
