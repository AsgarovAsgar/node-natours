const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack
  })
}

const sendErrorProd = (err, res) => {
  // operational, trusted error: send message to client
  if(err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })

  // Programming ot other unknown error: dont leak error details
  } else {
    // 1) log error
    console.log('ERROR :O', err);

    // 2) send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    })
  }
}

module.exports = (err, req, res, next) => {
  // console.log(err.stack); // shows where error happened
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'

  if(process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if(process.env.NODE_ENV === 'production') {
    sendErrorProd(err, res)
  }
}