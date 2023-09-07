const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')
const sendEmail = require('./../utils/email')


const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    // secure: true,
    httpOnly: true
  }

  if(process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  // remove password from output
  user.password = undefined

  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
}

const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  })

  createSendToken(newUser, 201, res)
})

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  // 1) if email and password actually exists
  if(!email || !password) {
    return next(new AppError('Please, provide email and password', 400))
  }
  // 2)check if the user exists && password is correct
  const user = await User.findOne({ email }).select('+password')
  // const correct = await user.correctPassword(password, user.password)

  if(!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401))
  }

  // 3) if everythin is ok, send toke to client
  createSendToken(user, 200, res)
})

const protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check it is there
  let token
  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if(req.cookies.jwt) {
    token = req.cookies.jwt
  }

  console.log(token);

  if(!token) {
    return next(new AppError('You are not logged in! Please, log in to get access.', 401))
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if(!currentUser) return next(new AppError('The user belonging to this token does no longer exist', 401))

  // 4) Check if user changed password after the token was issued
  if(currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password. Please log in again', 401))
  }


  // GRANT ACCESS TO PROTECTED ROUTES
  req.user = currentUser
  next()
})

// Only for rendered pages and there will be no errors
const isLoggedIn = catchAsync(async (req, res, next) => {
  if(!req.cookies.jwt) return next()
  console.log('cookie set');
  const token = req.cookies.jwt

  // 1) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 2) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if(!currentUser) return next()

  // 4) Check if user changed password after the token was issued
  if(currentUser.changedPasswordAfter(decoded.iat)) {
    return next()
  }

  // THERE IS A LOGGED IN USER
  res.locals.user = currentUser // to pass user to pug templates
  next()
})

const restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']
    if(!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403))
    }

    next()
  }
}

const forgotPassword = catchAsync(async(req, res, next) => {
  // 1) Get user based on posted email
  const user = await User.findOne({email: req.body.email})

  if(!user) {
    return next(new AppError('There is no user', 404))
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3) send it to user's email
  const resetURL = `${req.protocol}://${req.get('host')}/ap1/v1/users/resetPassword/${resetToken}`

  const message =  `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n
  If you did not forget your password, please ignore this email`

  try {
    await sendEmail({
      email: user.email,
      subject: `Your password reset token. (valid for 10 min)`,
      message
    })
  
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    })
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false })

    return next(new AppError('There was an error sending the email. Try again later!', 500))
  }
  

})

const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({ 
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  })

  // 2) If token has not expired, and there is user, set the new password
  if(!user) {
    return next(new AppError('Token is invalid or has expired', 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save()

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res)
})

const updatePassword = catchAsync(async (req, res, next) => {
  // 1) get user from collection
  const user = await User.findById(req.user.id).select('+password')

  // 2) check if posted current password is correct
  if(!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong', 401))
  }

  // 3) if so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()

  // 4) log user in, send JWT
  createSendToken(user, 200, res)
})

module.exports = { signup, login, protect, isLoggedIn, restrictTo, forgotPassword, resetPassword, updatePassword }