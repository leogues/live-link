import { Request, Response, NextFunction } from 'express'
import { body, param, validationResult } from 'express-validator'

const validateRequestDefault = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  next()
}

export const validateRoomId = [
  param('id').isUUID().withMessage('roomId is invalid'),
  validateRequestDefault,
]

export const validateRoomTopic = [
  body('topic')
    .notEmpty()
    .withMessage('Topic cannot be empty')
    .isString()
    .withMessage('Topic must be a string'),
  validateRequestDefault,
]
