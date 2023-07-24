const express = require('express')
const fs = require('fs')

const app = express()

app.use(express.json())

// app.get('/', (req, res) => {
//   res.status(200).json({message: 'Hello from server side', app: 'Natours'})
// })

// app.post('/', (req, res) => {
//   res.send('You can send ...')
// })

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`))

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours: tours }
  })
})

app.get('/api/v1/tours/:id', (req, res) => {
  console.log(req.params);
  const { id } = req.params
  const tour = tours.find(t => t.id  === +id)

  if(!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID'
    })
  }

  res.status(200).json({
    status: 'success',
    data: { tour }
  })
})

app.post('/api/v1/tours', (req, res) => {
  console.log(req.body);
  
  console.log('tours[tours.length - 1]', tours[tours.length - 1]);
  const newId = tours[tours.length - 1].id + 1
  const newTour = Object.assign({id: newId}, req.body)
  tours.push(newTour)
  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
    res.status(201).json({
      status: 'success',
      data: newTour
    })
  })
})

const port = 8000
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
})