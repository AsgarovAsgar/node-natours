const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')


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



const getAllTours = catchAsync(async (req, res, next) => {
  // EXECUTE QUERY
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate()

  const tours = await features.query

  // const query = Tour.find()
  //   .where('duration')
  //   .equals(5)
  //   .where('difficulty')
  //   .equals('easy')

  //SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
})

const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id)

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
})


const createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: "success",
    data: {tour: newTour},
  });
})

const updateTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(200).json({
    status: "success",
    data: { tour },
  });
})

const deleteTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findByIdAndDelete(req.params.id)

  if(!tour) {
    return next(new AppError('No tour found with that ID', 404))
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
})

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