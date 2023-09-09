const Tour = require('../models/tourModel')
const catchAsync = require('../utils/catchAsync')
const factory = require('./handlerFactory')
const AppError = require('./../utils/appError')
const multer = require('multer')
const sharp = require('sharp')

const multerStorage = multer.memoryStorage()

const multerFilter = (req, file, cb) => {
  if(file.mimetype.startsWith('image')) {
    cb(null, true)
  } else {
    cb(new AppError('Not an image! Please, upload only images', 404), false)
  }
}
// const upload = multer({ dest: 'public/img/users' })
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
})

// here we are passing names of the tour model fields such as imageCover and images
const uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
])

const resizeTourImages = catchAsync(async (req, res, next) => {
  if(!req.files.imageCover || !req.files.images) return next()

  // 1) cover image
  const imageCoverFilename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`
  console.log({imageCoverFilename});
  await sharp(req.files.imageCover[0].buffer)
  .resize(2000, 1333)
  .toFormat('jpeg')
  .jpeg({quality: 90})
  .toFile(`public/img/tours/${imageCoverFilename}`)
  req.body.imageCover = imageCoverFilename

  // 2) Images
  req.body.images = []
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `tour-${req.params.id}-${Date.now()}-${i+1}.jpeg`
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({quality: 90})
        .toFile(`public/img/tours/${filename}`)
      req.body.images.push(filename)
    })
  )

  next()
})


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

// router.route('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin)

const getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params

  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  const [lat, lng] = latlng.split(',')
  if(!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400))
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng,lat], radius] } }
  })

  res.status(200).json({
    message: 'success',
    results: tours.length,
    data: { data: tours }
  })
})

const getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001


  const [lat, lng] = latlng.split(',')
  if(!lat || !lng) {
    next(new AppError('Please provide latitude and longitude in the format lat,lng.', 400))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    message: 'success',
    data: { data: distances }
  })
})

module.exports = { uploadTourImages, resizeTourImages, aliasTopTours, getAllTours, getTour, createTour, updateTour, deleteTour, getTourStats, getMonthlyPlan, getToursWithin, getDistances }