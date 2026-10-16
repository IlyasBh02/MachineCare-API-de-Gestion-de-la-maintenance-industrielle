const AppError = require('../utils/AppError');

module.exports = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });
  if (error) {
    return next(new AppError('Données invalides', 422, error.details.map((d) => d.message)));
  }
  req.body = value;
  next();
};