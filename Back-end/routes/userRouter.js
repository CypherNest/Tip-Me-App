const express = require('express')
const authController = require('../controller/authController')



const router = express.Router()




router.post('/signUp', authController.signUp)
router.post('/login', authController.login)
router.get('/getallUsers', authController.getAllUser)


module.exports = router 