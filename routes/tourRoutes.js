const express = require('express')
const { checkBody, getAllTours, getTour, createTour, updateTour, deleteTour } = require('./../controllers/tourController')

const router = express.Router()

// router.param('id')

router
  .route("/")
  .get(getAllTours)
  .post(checkBody, createTour);

router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router