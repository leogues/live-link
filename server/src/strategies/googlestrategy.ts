const GoogleStrategy = require('passport-google-oauth20').Strategy

import { Profile, _StrategyOptionsBase } from 'passport-google-oauth20'
import { User } from '@prisma/client'
import prisma from '../database/client'

const passport = require('passport')

const googleStrategyOptions: _StrategyOptionsBase = {
  clientID: process.env.GOOGLE_CLIENT_ID || '',
  clientSecret: process.env.GOOGLE_CLIENT_SCRET || '',
  callbackURL: 'http://localhost:8080/auth/google/callback',
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
        const { provider, displayName } = profile
        const {
          sub: id,
          given_name: name,
          family_name: lastName,
          picture,
        } = profile._json

        let user = await prisma.user.findFirst({
          where: {
            providerId: id,
            provider: provider,
          },
        })

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: name ? name : displayName,
              lastName,
              picture,
              providerId: id,
              provider,
            },
          })
        }

        if (!user) return done(null, false)

        console.log(user)

        return done(null, user)
      } catch (error) {
        console.log(error)
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
