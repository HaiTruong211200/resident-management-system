const express = require('express');
const jwt = require('jsonwebtoken');
const {body, validationResult} = require('express-validator');
const Account = require('../models/Account');

const router = express.Router();

function signToken(account) {
  return jwt.sign(
      {sub: account._id.toString(), role: account.role}, process.env.JWT_SECRET,
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
      if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

      const {name, email, password} = req.body;
      const exists = await Account.findOne({email});
      if (exists)
        return res.status(409).json({message: 'Email already in use'});

      try {
        // create account: map incoming fields to Account schema
        const account =
            await Account.create({user_name: name, email, pass: password});
        const token = signToken(account);
        return res.status(201).json({
          account: account.toJSON(),
          token,
          accessToken: token,
          expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });
      } catch (err) {
        if (err && err.code === 11000) {
          return res.status(409).json({message: 'Email already in use'});
        }
        throw err;
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
      if (!errors.isEmpty())
        return res.status(400).json({errors: errors.array()});

      const {email, password} = req.body;
      const account = await Account.findOne({email}).select('+pass');
      if (!account)
        return res.status(401).json({message: 'Invalid credentials'});

      const match = await account.comparePassword(password);
      if (!match) return res.status(401).json({message: 'Invalid credentials'});

      const token = signToken(account);
      return res.json({
        account: account.toJSON(),
        token,
        accessToken: token,
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      });
    });

module.exports = {router};