import passport from 'passport'
import passportGithub from 'passport-github2'
import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, api } from '../config'
import { User } from '../dao/mongo/models/User'
import { generateToken } from './generateToken'
import { logger } from './logger'

const GitHubStrategy = passportGithub.Strategy

const initializePassport = (): void => {
  passport.use(
    'github',
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID as string,
        clientSecret: GITHUB_CLIENT_SECRET as string,
        callbackURL: api.url + '/sessions/github/callback'
      },
      async function (
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: any
      ) {
        try {
          const user = await User.findOne({ email: profile._json?.email })

          if (user === null) {
            const addnewUser = {
              firstName: profile._json.name,
              lastName: '',
              email: profile._json?.email,
              password: '',
              role: 'user'
            }
            const newUser = await User.create(addnewUser)
            const { token, expiresIn, email } = await generateToken(newUser)
            done(null, { token, expiresIn, email })
          } else {
            const { token, expiresIn, email } = await generateToken(user)
            done(null, { token, expiresIn, email })
          }
        } catch (error: any) {
          logger.error(
            `Ocurrió un error en passport: ${error?.message as string} `
          )
          return done(error)
        }
      }
    )
  )
}

export default initializePassport
