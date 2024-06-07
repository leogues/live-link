import { Request, Response } from "express";

export class UserController {
  static async Index(req: Request, res: Response) {
    const { id, name, lastName, picture } = (await req.user) as User
    const user = { id, name, lastName, picture }

    return res.json(user)
  }
}
