const express = require('express')

const router = express.Router()
const viewsController = require('./../controllers/viewsController')
// const bookingController = require('./../controllers/bookingController')
const { protect, isLoggedIn } = require('./../controllers/authController')

router.get('/',
  // bookingController.createBookingCheckout, 
  isLoggedIn, 
  viewsController.getOverview
)
router.get('/tour/:slug', isLoggedIn, viewsController.getTour)
router.get('/login', isLoggedIn, viewsController.getLoginForm)
router.get('/me', protect, viewsController.getAccount)
router.get('/my-tours', protect, viewsController.getMyTours)
router.post('/submit-user-data', protect, viewsController.updateUserData)

module.exports = router