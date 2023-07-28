const fs = require("fs");


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

const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    // results: tours.length,
    // data: { tours },
  });
};

const getTour = (req, res) => {

  res.status(200).json({
    status: "success",
    // data: { tour },
  });
};

const createTour = (req, res) => {
  res.status(201).json({
    status: "success",
    // data: newTour,
  });
};

const updateTour = (req, res) => {
  res.status(200).json({
    status: "success",
    // data: { tour: "Updated tour here" },
  });
};

const deleteTour = (req, res) => {
  // const { id } = req.params;
  // const tour = tours.find((t) => t.id === +id);

  res.status(204).json({
    status: "success",
    // data: null,
  });
};

module.exports = { checkBody, getAllTours, getTour, createTour, updateTour, deleteTour }