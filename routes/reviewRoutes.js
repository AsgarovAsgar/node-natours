const express = require('express')
const router = express.Router({ mergeParams: true });
const reviewController = require('./../controllers/reviewController')
const { protect, restrictTo }  = require('./../controllers/authController')

router.use(protect)

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(restrictTo('user'), reviewController.setTourUserIds, reviewController.createReview)

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(restrictTo('user', 'admin'), reviewController.updateReview)
  .delete(restrictTo('user', 'admin'), reviewController.deleteReview)


module.exports = router