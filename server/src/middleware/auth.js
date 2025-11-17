const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token)
      return res.status(401).json({message: 'Unauthorized'});

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const account = await Account.findById(payload.sub).select('-pass');
    if (!account) return res.status(401).json({message: 'Unauthorized'});

    req.account = account;
    next();
  } catch {
    return res.status(401).json({message: 'Unauthorized'});
  }
}

module.exports = {auth};