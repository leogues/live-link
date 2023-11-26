const CustomStrategy = require('passport-custom').Strategy

import { User } from '@prisma/client'
import prisma from '../database/client'
import { generateRandomNumericString } from '../utils/generateRandomNumericString'

const passport = require('passport')

passport.use(
  new CustomStrategy(async function (_req: any, done: any) {
    try {
      const tag = generateRandomNumericString({ quantityDigits: 4 })
      const user = await prisma.user.create({
        data: {
          name: 'Anônimo',
          provider: 'local',
          lastName: tag,
          picture: 'http://localhost:8080/images/sad.png',
        },
      })

      if (!user) return done(null, false)

      return done(null, user)
    } catch (error) {
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
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      })
      return done(null, user)
    } catch (error) {
      console.log(error)
      return done(error, null)
    }
  })
})
