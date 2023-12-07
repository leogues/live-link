import express from 'express'
import passport from 'passport'

import { UserController } from './controllers/UserController'
import { RoomController } from './controllers/RoomController'

import { authenticationMiddleware } from './middleware/AuthenticationMiddleware'
import {
  validateRoomId,
  validateRoomTopic,
} from './middleware/ValidationMiddleware'

export const frontendUrl = 'http://localhost:5173'

require('./strategies/googlestrategy')
require('./strategies/customstrategy')

export const routes = express.Router()

routes.get('/auth/google', passport.authenticate('google'))
routes.get(
  '/auth/google/callback',

  passport.authenticate('google', {
    failureRedirect: frontendUrl + '/login?fail=true',
  }),
  (_req, res) => {
    res.redirect(frontendUrl + '/')
  }
)

routes.get(
  '/auth/local',
  passport.authenticate('custom', {
    failureRedirect: frontendUrl + '/login?fail=true',
  }),
  (_req, res) => {
    res.redirect(frontendUrl + '/')
  }
)

routes.get('/user', authenticationMiddleware, UserController.Index)

routes.get(
  '/room/:id',
  authenticationMiddleware,
  validateRoomId,
  RoomController.Show
)
routes.post(
  '/room',
  authenticationMiddleware,
  validateRoomTopic,
  RoomController.Create
)
