const express = require("express");
const fs = require("fs");
const morgan = require('morgan')

const app = express();

// 1) MIDDLEWARE
app.use(morgan('dev'))
app.use(express.json());

// place middleware before route functions
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next()
})

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString()
  next()
})

// app.get('/', (req, res) => {
//   res.status(200).json({message: 'Hello from server side', app: 'Natours'})
// })

// app.post('/', (req, res) => {
//   res.send('You can send ...')
// })

// 2) Route handlers
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

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

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

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

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(200).json({
    status: "success",
    data: { tour: "Updated tour here" },
  });
};

const deleteTour = (req, res) => {
  const { id } = req.params;
  const tour = tours.find((t) => t.id === +id);

  if (!tour) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID",
    });
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined yet!'
  })
}

// app.get('/api/v1/tours', getAllTours)
// app.get('/api/v1/tours/:id', getTour)
// app.post('/api/v1/tours', createTour)
// app.patch('/api/v1/tours/:id', updateTour)
// app.delete('/api/v1/tours/:id', deleteTour)


// 3) ROUTES
const tourRouter = express.Router()
const userRouter = express.Router()

tourRouter
  .route("/")
  .get(getAllTours)
  .post(createTour);

tourRouter
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

userRouter.route('/').get(getAllUsers).post(createUser)
userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

// mounting the routes
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// 4) START SERVER
const port = 8000;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
