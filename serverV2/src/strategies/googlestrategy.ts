const GoogleStrategy = require('passport-google-oauth20').Strategy
const passport = require('passport')

import { Profile, _StrategyOptionsBase } from 'passport-google-oauth20'

import { UserRepository } from '../repositories/database/UserRepository'
import { UserService } from '../services/UserService'

const userRepository = new UserRepository()
const userService = new UserService(userRepository)

const googleStrategyOptions: _StrategyOptionsBase = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SCRET || '',
  callbackURL: process.env.GOOGLE_CALLBACK_URL || '',
  scope: ['profile'],
}

passport.use(
  new GoogleStrategy(
    googleStrategyOptions,
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: any
    ) => {
      try {
        const id = profile._json.sub
        const name = profile._json.given_name || profile.displayName

        const newUserData = {
          name,
          lastName: profile._json.family_name,
          picture: profile._json.picture,
          providerId: id,
          provider: profile.provider,
        }

        const user = await userService.getUserOrCreate(id, newUserData)

        if (!user) return done(null, false)

        console.log(user)

        return done(null, user)
      } catch (error) {
        console.error(error)

        return done(error, false)
      }
    }
  )
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

      return done(null, user)
    } catch (error) {
      console.log(error)
      return done(error, null)
    }
  })
})
