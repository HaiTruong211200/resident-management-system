const express = require('express');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const {createAccount, findByEmail, comparePassword} =
    require('../models/Account');
const {sendSuccess, sendError, validationFailed} = require('../utils/response');

const router = express.Router();

function signToken(account) {
  return jwt.sign(
      {sub: account.id, role: account.role}, process.env.JWT_SECRET,
      {expiresIn: process.env.JWT_EXPIRES_IN || '7d'});
}

router.post(
    '/register',
    [
      body('name').trim().isLength({min: 2}).withMessage('Name is required'),
      body('email')
          .isEmail()
          .withMessage('Valid email required')
          .normalizeEmail(),
      body('password')
          .isLength({min: 8})
          .withMessage('Password min length is 8')
          .matches(/[A-Z]/)
          .withMessage('Must include uppercase')
          .matches(/[a-z]/)
          .withMessage('Must include lowercase')
          .matches(/[0-9]/)
          .withMessage('Must include digit'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return validationFailed(res, errors.array());

      const {name, email, password} = req.body;
      try {
        const exists = await findByEmail(email);
        if (exists)
          return sendError(res, {
            status: 409,
            message: 'Email already in use',
            code: 'EMAIL_IN_USE'
          });

        const account =
            await createAccount({user_name: name, email, pass: password});
        const token = signToken(account);
        return sendSuccess(
            res, {
              account,
              token,
              accessToken: token,
              expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            },
            {status: 201});
      } catch (err) {
        if (err && err.code === '23505') {
          return sendError(res, {
            status: 409,
            message: 'Email or username already in use',
            code: 'UNIQUE_CONSTRAINT'
          });
        }
        console.error(err);
        return sendError(res);
      }
    });

router.post(
    '/login',
    [
      body('email')
          .isEmail()
          .withMessage('Valid email required')
          .normalizeEmail(),
      body('password')
          .isString()
          .notEmpty()
          .withMessage('Password is required'),
    ],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) return validationFailed(res, errors.array());

      const {email, password} = req.body;
      try {
        const account = await findByEmail(email, true);
        if (!account)
          return sendError(res, {
            status: 401,
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS'
          });

        const match = await comparePassword(password, account.pass);
        if (!match)
          return sendError(res, {
            status: 401,
            message: 'Invalid credentials',
            code: 'INVALID_CREDENTIALS'
          });

        delete account.pass;
        const token = signToken(account);
        return sendSuccess(res, {
          account,
          token,
          accessToken: token,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        });
      } catch (err) {
        console.error(err);
        return sendError(res);
      }
    });

module.exports = {router};