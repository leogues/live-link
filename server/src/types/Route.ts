import { Request, Response } from 'express'

export interface IExpressRoute {
  req: Request
  res: Response
}
