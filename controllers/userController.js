const User = require('../models/userModel')
// const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const AppError = require('./../utils/appError')

const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
})

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

const updateMe = (req, res, next) => {
  // 1) Create error if user POSTs password data
  if(req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use /updateMyPassword', 400))
  }

  // 2) Update user document
  res.status(200).json({
    status: 'success',
    message: 'update'
  })
}

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

module.exports = { getAllUsers, createUser, getUser, updateUser, deleteUser }