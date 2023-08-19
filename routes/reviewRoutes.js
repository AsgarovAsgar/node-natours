const express = require('express')
const router = express.Router();

const reviewController = require('./../controllers/reviewController')
const { protect, restrictTo }  = require('./../controllers/authController')

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(protect, restrictTo('user'), reviewController.createReview)


module.exports = router