const CustomStrategy = require('passport-custom').Strategy
const passport = require('passport')

import { UserRepository } from '../repositories/database/UserRepository'
import { UserService } from '../services/UserService'
import { generateRandomNumericString } from '../utils/generateRandomNumericString'

const userRepository = new UserRepository()
const userService = new UserService(userRepository)

passport.use(
  new CustomStrategy(async function (_req: any, done: any) {
    try {
      const tag = generateRandomNumericString({ quantityDigits: 4 })

      const user = await userService.createUser({
        name: 'Anônimo',
        lastName: tag,
        picture: 'http://localhost:8080/images/sad.png',
        provider: 'local',
      })

      if (!user) return done(null, false)

      return done(null, user)
    } catch (error) {
      console.error(error)

      return done(error)
    }
  })
)
passport.serializeUser(async (user: User, done: any) => {
  process.nextTick(function () {
    done(null, user.id)
  })
})

passport.deserializeUser(async (userId: string, done: any) => {
  process.nextTick(async function () {
    try {
      const user = await userService.getUserById(userId)

      if (!user) {
        return done(null, false)
      }

      return done(null, user)
    } catch (error) {
      console.error(error)

      return done(error, null)
    }
  })
})
