import * as express from 'express'
import session from 'express-session'

declare module 'express-session' {
  interface SessionData {
    returnTo?: string
  }
}

declare module 'express' {
  interface Request {
    session: session.Session &
      Partial<session.SessionData> & { returnTo?: string }
  }
}

declare module 'http' {
  interface IncomingMessage {
    user?: IUser
  }
}
