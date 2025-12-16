function sendSuccess(res, data, {status = 200, meta} = {}) {
  const payload = {data};
  if (meta) payload.meta = meta;
  return res.status(status).json(payload);
}

function sendError(
    res,
    {status = 500,
     message = 'Server error',
     code = 'SERVER_ERROR',
     details} = {}) {
  const error = {message, code};
  if (details) error.details = details;
  return res.status(status).json({error});
}

function validationFailed(res, errors) {
  return sendError(res, {
    status: 400,
    message: 'Validation failed',
    code: 'VALIDATION_ERROR',
    details: errors
  });
}

module.exports = {
  sendSuccess,
  sendError,
  validationFailed
};
