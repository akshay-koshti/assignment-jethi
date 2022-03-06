const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');

exports.getMe = catchAsync(async (req, res, next) => {
  const userDoc = await User.findOne({ _id: req.user._id });

  res.status(200).json({
    status: 'success',
    data: userDoc
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.confirmPassword) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword.', 400)
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: updatedUser
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { isActive: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
