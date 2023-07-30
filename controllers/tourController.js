const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')


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