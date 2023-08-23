const express = require('express')
const router = express.Router({ mergeParams: true });

const reviewController = require('./../controllers/reviewController')
const { protect, restrictTo }  = require('./../controllers/authController')

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(protect, restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview)

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview)


module.exports = router