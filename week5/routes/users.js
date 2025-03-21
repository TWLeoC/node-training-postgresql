const express = require('express')


const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Users')

const { isNotValidInteger, isNotValidSting, isUndefined, isValidPassword, isValidName} = require('../utils/validUtils')
const appError = require('../utils/appError')
const { generateJWT, verifyJWT } = require('../utils/jwtUtils')
const isAuth = require('../middlewares/isAuth')
const handleErrorAsync = require('../utils/handleErrorAsync')
const usersController = require('../controllers/users')



router.post('/signup', handleErrorAsync(usersController.postUserSignup))

router.post('/login', handleErrorAsync(usersController.postUserLogin))

router.get('/profile', isAuth, handleErrorAsync(usersController.getProfile))

router.put('/profile', isAuth, handleErrorAsync(usersController.putProfile))

module.exports = router