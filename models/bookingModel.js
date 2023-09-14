const mongooes = require('mongoose')

const bookingSchema = new mongooes.Schema({
  tour: {
    type: mongooes.Schema.Types.ObjectId,
    ref: 'Tour',
    required: [true, 'Booking must belong to a Tour!']
  },
  user: {
    type: mongooes.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a User!']
  },
  price: {
    type: Number,
    required: [true, 'Booking must have a price']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
})

// for populating QUERT MIDDLEWARE is used
bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  })
})


const Booking = mongooes.model('Booking', bookingSchema)

module.exports = Booking