import { Router } from 'express'
import passport from 'passport'
import {
  current,
  login,
  logout,
  recoveryPassword,
  register,
  resetPassword
} from '../dao/controllers/session.controller'
import { authorization } from '../middlewares/authorization'
import { validatorExpressError } from '../middlewares/validatorError'
import { verifyCart } from '../middlewares/verifyCart'
import { validateLoginBody, validateRegisterBody } from '../utils/validations'

const router = Router()

router.post('/register', validateRegisterBody, validatorExpressError, register)
router.post(
  '/login',
  validateLoginBody,
  validatorExpressError,
  verifyCart,
  login
)
router.get('/current', authorization(['admin', 'user', 'premium']), current)
router.post('/logout', logout)
router.post('/recoveryPassword', authorization(['admin']), recoveryPassword)
router.post('/resetPassword', resetPassword)

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
