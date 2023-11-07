import express from 'express'
import passport from 'passport'
import { UserController } from './controllers/UserController'
import { authenticationMiddleware } from './middleware/AuthenticationMiddleware'
import { RoomController } from './controllers/RoomController'

export const frontendUrl = 'http://localhost:5173'
// export const frontendUrl = 'https://advanced-muskox-only.ngrok-free.app'
require('./strategies/googlestrategy')

export const routes = express.Router()

routes.get('/user', authenticationMiddleware, UserController.Index)
routes.get('/room/:id', authenticationMiddleware, RoomController.Show)
routes.post('/room', authenticationMiddleware, RoomController.Create)

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
