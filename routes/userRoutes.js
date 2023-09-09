const express = require('express')
const userController = require('./../controllers/userController')
const { signup, login, logout, protect, restrictTo, forgotPassword, resetPassword, updatePassword } = require('./../controllers/authController');


const router = express.Router();

router.post('/signup', signup)
router.post('/login', login)
router.get('/logout', logout)

router.post('/forgotPassword', forgotPassword)
router.patch('/resetPassword/:token', resetPassword)

// Protect all routes after this middleware
router.use(protect)

router.patch('/updateMyPassword', updatePassword)
router.get('/me', userController.getMe, userController.getUser)
router.patch('/updateMe', userController.uploadUserPhoto, userController.updateMe)
router.delete('/deleteMe', userController.deleteMe)

router.use(restrictTo('admin'))

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router
