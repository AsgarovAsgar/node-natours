const fs = require("fs");


const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

const checkID = (req, res, next, val) => {
  let id = val
  const tour = tours.find((t) => t.id === +id);
  console.log(`Tour id is ${val}`);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }
  next()
}

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
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === +id);

  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

const createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: "success",
        data: newTour,
      });
    }
  );
};

const updateTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === +id);

  res.status(200).json({
    status: "success",
    data: { tour: "Updated tour here" },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === +id);

  res.status(204).json({
    status: "success",
    data: null,
  });
};

module.exports = { checkID, checkBody, getAllTours, getTour, createTour, updateTour, deleteTour }