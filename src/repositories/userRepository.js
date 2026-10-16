const User = require('../models/User');

const create = (data, session) => new User(data).save({ session });

module.exports = { create };
