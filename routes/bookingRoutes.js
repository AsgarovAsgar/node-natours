const express = require('express')
const bookingController = require('./../controllers/bookingController')
const { protect } = require('./../controllers/authController')

const router = express.Router()

router.get(
  '/checkout-session/:tourId',
  protect, 
  bookingController.getCheckoutSession
)

module.exports = router