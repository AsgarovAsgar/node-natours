const fs = require("fs");
const Tour = require('../models/tourModel')


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkBody = ((req, res, next) => {
  if(!(req.body.hasOwnProperty('name') && req.body.hasOwnProperty('price'))) {
    return res.status(400).json({
      status: "fail",
      message: 'Name and price are missing'
    });
  }
  next()
})

const getAllTours = async (req, res) => {
  try {

    const tours = await Tour.find()
    
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

module.exports = { checkBody, getAllTours, getTour, createTour, updateTour, deleteTour }