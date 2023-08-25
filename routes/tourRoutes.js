const express = require('express')
const { aliasTopTours, getAllTours, getTour, createTour, updateTour, deleteTour, getTourStats, getMonthlyPlan } = require('./../controllers/tourController')
const { protect, restrictTo } = require('./../controllers/authController')
const reviewRouter = require('./reviewRoutes')

const router = express.Router()

// router.param('id')

router.use('/:tourId/reviews', reviewRouter)

router.route('/top-5-cheap').get(aliasTopTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin', 'lead-guide', 'guide'), getMonthlyPlan)

router
  .route("/")
  .get(protect, getAllTours)
  // .post(checkBody, createTour);
  .post(protect, restrictTo('admin', 'lead-guide'), createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo('admin', 'lead-guide'), updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
  // .delete(deleteTour);

// router
//   .route('/:tourId/reviews')
//   .post(protect, restrictTo('user'), reviewController.createReview)


module.exports = router