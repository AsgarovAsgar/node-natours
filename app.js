const express = require("express");
const morgan = require('morgan')

const app = express();

const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const tourRouter = require(`${__dirname}/routes/tourRoutes`)
const userRouter = require(`${__dirname}/routes/userRoutes`)

// 1) MIDDLEWARE

if(process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`))

// place middleware before route functions
// app.use((req, res, next) => {
//   console.log('Hello from middleware');
//   next()
// })

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

app.get('/', (req, res) => {
  res.status(200).json({message: 'Hello from server side', app: 'Natours'})
})

// app.post('/', (req, res) => {
//   res.send('You can send ...')
// })

// 2) Route handlers

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)

// 3) ROUTES

// mounting the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

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
