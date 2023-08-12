const User = require('../models/userModel')
// const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

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