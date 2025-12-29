const jwt = require('jsonwebtoken');
const {findById} = require('../models/Account');
const {sendError} = require('../utils/response');

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return sendError(
          res, {status: 401, message: 'Unauthorized', code: 'UNAUTHORIZED'});
    }

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return sendError(
          res, {status: 401, message: 'Invalid token', code: 'INVALID_TOKEN'});
    }

    const account = await findById(payload.sub);
    if (!account) {
      return sendError(
          res, {status: 401, message: 'Unauthorized', code: 'UNAUTHORIZED'});
    }

    req.account = account;

    // Log user access information
    console.log(`User "${account.username}" (${account.email}) with role "${
        account.role}" accessing ${req.method} ${req.path}`);

    return next();
  } catch (err) {
    console.error('Auth middleware error', err);
    return sendError(
        res,
        {status: 500, message: 'Auth processing failed', code: 'AUTH_ERROR'});
  }
}

function adminOnly(req, res, next) {
  if (!req.account) {
    return sendError(
        res, {status: 401, message: 'Unauthorized', code: 'UNAUTHORIZED'});
  }

  if (req.account.role !== 'admin') {
    console.log(`Forbidden: User "${req.account.username}" (role: ${
        req.account.role}) attempted to access admin-only route ${req.method} ${
        req.path}`);
    return sendError(res, {
      status: 403,
      message: 'Forbidden - Admin access required',
      code: 'FORBIDDEN'
    });
  }

  console.log(`Granted: User "${req.account.username}" (role: ${
      req.account.role}) accessing admin route ${req.method} ${req.path}`);
  return next();
}

module.exports = {
  auth,
  adminOnly
};