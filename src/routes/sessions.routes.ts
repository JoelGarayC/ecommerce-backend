import { Router } from 'express'
import passport from 'passport'
import {
  current,
  login,
  logout,
  register
} from '../dao/controllers/session.controller'
import { authorization } from '../middlewares/authorization'
import { verifyCart } from '../middlewares/verifyCart'
import { validateLoginBody, validateRegisterBody } from '../utils/validations'
import { validatorExpressError } from './validatorError'

const router = Router()

router.post('/register', validateRegisterBody, validatorExpressError, register)
router.post(
  '/login',
  validateLoginBody,
  validatorExpressError,
  verifyCart,
  login
)
router.get('/current', authorization(['admin', 'user']), current)
router.post('/logout', logout)

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'], session: false }),
  function (req, res) {}
)
router.get(
  '/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login',
    session: false
  }),
  verifyCart,
  function (req: any, res) {
    const { token, expiresIn } = req.user
    res
      .cookie('token', token, { httpOnly: true, maxAge: expiresIn })
      .redirect('/profile')
  }
)

export default router
