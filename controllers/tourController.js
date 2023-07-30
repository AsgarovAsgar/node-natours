const Tour = require('../models/tourModel')


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

const getAllTours = async (req, res) => {
  try {
    // console.log(req.query)

    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach(el => delete queryObj[el])

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`)
    // console.log(JSON.parse(queryStr));
    
    
    // const query = Tour.find(queryObj)
    let query = Tour.find(JSON.parse(queryStr))

    // 2) Sorting
    if(req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ')
      query = query.sort(sortBy)
    } else {
      query = query.sort('-createdAt')
    }

    // 3) Field limiting
    if(req.query.fields) {
      const fields = req.query.fields.split(',').join(' ')
      query = query.select(fields)
    } else {
      query = query.select('-__v')
    }

    // 4) Pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit

    query = query.skip(skip).limit(limit)

    if(req.query.page) {
      const numTours = await Tour.countDocuments()
      if(skip >= numTours) throw new Error('This page does not exist')
    }

    // EXECUTE QUERY
    const tours = await query

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
  } catch(error) {
    res.status(404).json({
      status: 'fail',
      message: error
    })
  }
};

const getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)
    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch(error) {
    res.status(404).json({
      status: 'fail',
      message: error
    })
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body)

    res.status(201).json({
      status: "success",
      data: {tour: newTour},
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
};

const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    res.status(200).json({
      status: "success",
      data: { tour },
    });
  } catch(error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id)

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch(error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
};

module.exports = { aliasTopTours, getAllTours, getTour, createTour, updateTour, deleteTour }