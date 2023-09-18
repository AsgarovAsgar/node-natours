const mongoose = require('mongoose')
const dotenv = require('dotenv')

process.on('uncaughtException', err => {
  console.log('Uncaught Exception:', err);
  process.exit(1)
})

dotenv.config({path: './config.env'})

const app = require('./app')

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

mongoose.connect(DB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => console.log('connected database successfully') )

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('Error:', err);
  console.log('UNHANDLED REJECTION! Shutting down...');
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  console.log('✅ SIGTERM RECEIVED. Shutting down gracefully.');
  server.close(() => {
    console.log('Process terminated 🫡');
  })
})