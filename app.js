const path = require('path')
const express = require("express");
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const cors = require('cors')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cookieParser = require('cookie-parser')

// start express app
const app = express();

app.enable('trust proxy')

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'))

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require(`${__dirname}/routes/tourRoutes`)
const userRouter = require(`${__dirname}/routes/userRoutes`)
const reviewRouter = require(`${__dirname}/routes/reviewRoutes`)
const bookingRouter = require(`${__dirname}/routes/bookingRoutes`)
const bookingController = require(`${__dirname}/controllers/bookingController`)
const viewRouter = require(`${__dirname}/routes/viewRoutes`)

// 1) GLOBAL MIDDLEWARES
// implement CORS
app.use(cors())
app.options('*', cors())

//serving static files
app.use(express.static(path.join(__dirname, 'public')))

// Set security HTTP covers
app.use(helmet())

// Development logging
if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 660 * 60 * 1000,
  message: 'Too may requests from this IP. Please try again in an hour'
})
app.use('/api', limiter)

app.post('/webhook-checkout', express.raw({ type: "*/*" }), bookingController.webhookCheckout)

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser())

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS
app.use(xss())

// Prevent parameter pollution
app.use(hpp({
  whitelist: [ 'duration', 'ratingsQuantity', 'ratingsAverage', 'maxGroupSize', 'difficulty', 'price' ]
}))

// Serving static files
// app.use(express.static(`${__dirname}/public`))

// place middleware before route functions
// app.use((req, res, next) => {
//   console.log('Hello from middleware');
//   next()
// })

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  // console.log(req.cookies);
  next()
})

// app.get('/', (req, res) => {
//   res.status(200).json({message: 'Hello from server side', app: 'Natours'})
// })


// 3) ROUTES

// mounting the routes
app.use('/', viewRouter)
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/reviews', reviewRouter)
app.use('/api/v1/bookings', bookingRouter)

app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // })

  // const err  = new Error(`Can't find ${req.originalUrl} on this server`)
  // err.status = 'fail'
  // err.statusCode = 404

  // next(err) // always can pass err as the first argument
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404)) // always can pass err as the first argument
})

app.use(globalErrorHandler)

// 4) START SERVER
module.exports = app
