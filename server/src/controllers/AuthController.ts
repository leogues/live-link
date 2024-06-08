import { Request, Response } from 'express'
import { frontendUrl } from '../routes'

export class AuthController {
  static async Logout(req: Request, res: Response) {
    req.logout(function (err) {
      if (err) {
        return res.status(500).json({ error: 'Internal Server Error' })
      }
      res.redirect(`${frontendUrl}/login`)
    })
  }
}
