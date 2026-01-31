const User = require('../models/user.model');

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.userId).select('-passwordHash');
  res.json(user);
};

exports.getAll = async (req, res) => {
  const users = await User.find().select('-passwordHash');
  res.json(users);
};
