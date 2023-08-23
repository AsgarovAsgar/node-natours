const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')


const aliasTopTours = (req, res, next) => {
  req.query.limit = '5'
  req.query.sort = '-ratingsAverage,price'
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
  next()
}

// const checkBody = ((req, res, next) => {
//   if(!(req.body.hasOwnProperty('name') && req.body.hasOwnProperty('price'))) {
//     return res.status(400).json({
//       status: "fail",
//       message: 'Name and price are missing'
//     });
//   }
//   next()
// })



const getAllTours = factory.getAll(Tour)
const getTour = factory.getOne(Tour, { path: 'reviews' })
const createTour = factory.createOne(Tour)
const updateTour = factory.updateOne(Tour)
const deleteTour = factory.deleteOne(Tour)

// const deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id)

//   if(!tour) {
//     return next(new AppError('No tour found with that ID', 404))
//   }

//   res.status(204).json({
//     status: "success",
//     data: null,
//   });
// })

const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: {$gte: 4.5} }
    },
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ])

  res.status(200).json({
    status: "success",
    data: { stats },
  })
})

const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: { numTourStarts: -1 }
    }
  ])

  res.status(200).json({
    status: "success",
    data: { plan },
  });
})

//test

module.exports = { aliasTopTours, getAllTours, getTour, createTour, updateTour, deleteTour, getTourStats, getMonthlyPlan }