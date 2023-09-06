const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) Get tour data from collection
  const tours = await Tour.find()

  // 2) Build template

  // 3) Render that template using tour data
  res.status(200).render('overview', {
    title: 'All tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res) => {
  const { slug } = req.params
  const tour = await Tour.findOne({ slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  })
  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  })
})