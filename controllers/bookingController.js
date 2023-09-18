const Tour = require('../models/tourModel')
const Booking = require('../models/bookingModel')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('../utils/appError')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get currently booked tour
  const tour = await Tour.findById(req.params.tourId)

  // 2) Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    // success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    success_url: `${req.protocol}://${req.get('host')}/my-tours`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,

    line_items: [
      { 
        price_data: { 
          currency: "usd", 
          product_data: { 
            name: `${tour.name} Tour`, 
            description: tour.summary,
            images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`],
          }, 
          unit_amount: tour.price * 100, 
        }, 
        quantity: 1,
      },
      // {
      //   name: `${tour.name} Tour`,
      //   description: tour.summary,
      //   images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
      //   amount: tour.price * 100,
      //   currency: 'usd',
      //   quantity: 1
      // }
    ]
  })

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session
  })
})

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only temporary, because it is UNSECURE: everyone can make bookings without paying
//   const { tour, user, price } = req.query

//   if(!tour && !user && !price) return next()
//   await Booking.create({ tour, user, price })

//   // for removing tour, user, price from the url after booking checkout
//   res.redirect(req.originalUrl.split('?')[0])
// })

const createBookingCheckout = async session => {
  const tour = session.client_reference_id
  const user = (await User.findOne({email: session.customer_email})).tourId
  const price = session.line_items[0].price_data.unit_amount / 100

  await Booking.create({ tour, user, price })
}

exports.webhookCheckout = (req, res, next) => {
  const signature = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    res.status(400).send(`Webhook error: ${err.message}`)
  }

  if(event === 'checkout.session.completed') {
    createBookingCheckout(event.data.object)

    res.status(200).json({
      received: true
    })
  }
}

exports.createBooking = factory.createOne(Booking)
exports.getBooking = factory.getOne(Booking)
exports.getAllBookings = factory.getAll(Booking)
exports.updateBooking = factory.updateOne(Booking)
exports.deleteBooking = factory.deleteOne(Booking)