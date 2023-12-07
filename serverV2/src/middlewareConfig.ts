import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { Express } from 'express'
import passport from 'passport'
import { routes, frontendUrl } from './routes'
import session, { MemoryStore } from 'express-session'

export const configureMiddleware = (app: Express, store: MemoryStore) => {
  app.use(
    cors({
      origin: frontendUrl,
      credentials: true,
    })
  )

  app.use(
    session({
      secret: process.env.SESSION_SECRET || '',
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 1,
      },
      resave: true,
      saveUninitialized: true,
      store,
    })
  )

  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(express.json())
  app.use(express.static('public'))
  app.use(routes)
}
