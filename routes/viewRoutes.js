const express = require('express')

const router = express.Router()
const viewsController = require('./../controllers/viewsController')
const { isLoggedIn } = require('./../controllers/authController')

router.use(isLoggedIn)

router.get('/', viewsController.getOverview)
router.get('/tour/:slug', isLoggedIn, viewsController.getTour)
router.get('/login', viewsController.getLoginForm)

module.exports = router