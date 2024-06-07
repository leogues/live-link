import { NextFunction, Request, Response } from "express";

export function authenticationMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (req.isAuthenticated()) return next()

  res.status(401).json({ message: 'Unauthorized' })
}
