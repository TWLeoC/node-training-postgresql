const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Coaches')

const { isNotValidInteger, isNotValidSting, isUndefined, isValidPassword, isValidName} = require('../utils/validUtils')
const appError = require('../utils/appError')
const User = require('../entities/User')
const handleErrorAsync = require('../utils/handleErrorAsync')
const coachesController = require('../controllers/coaches')

router.get('/', handleErrorAsync(coachesController.getCoachesList))

router.get('/:coachId', handleErrorAsync(coachesController.getCoach))

module.exports = router
