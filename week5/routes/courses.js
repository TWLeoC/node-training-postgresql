const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const User = require('../entities/User')
const Skill = require('../entities/Skill')
const logger = require('../utils/logger')('Course')

const { isNotValidInteger, isNotValidSting, isUndefined, isValidPassword, isValidName} = require('../utils/validUtils')
const appError = require('../utils/appError')
const { generateJWT, verifyJWT } = require('../utils/jwtUtils')
const isAuth = require('../middlewares/isAuth')
const handleErrorAsync = require('../utils/handleErrorAsync')
const coursesController = require('../controllers/courses')

router.get('/', handleErrorAsync(coursesController.getCourse))


module.exports = router