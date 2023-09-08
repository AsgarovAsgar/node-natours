const express = require('express')

const router = express.Router()
const viewsController = require('./../controllers/viewsController')
const { protect, isLoggedIn } = require('./../controllers/authController')

router.get('/', isLoggedIn, viewsController.getOverview)
router.get('/tour/:slug', isLoggedIn, viewsController.getTour)
router.get('/login', isLoggedIn, viewsController.getLoginForm)
router.get('/me', protect, viewsController.getAccount)
router.post('/submit-user-data', protect, viewsController.updateUserData)

module.exports = router