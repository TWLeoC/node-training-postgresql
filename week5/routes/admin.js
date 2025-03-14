const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
// const AppDataSource = require('../db')
const logger = require('../utils/logger')('Admin')
const appError = require('../utils/appError')
const { isNotValidInteger, isNotValidSting, isUndefined } = require('../utils/validUtils')
const isAuth = require('../middlewares/isAuth')
const isCoach = require('../middlewares/isCoach')
const handleErrorAsync = require('../utils/handleErrorAsync')
const adminController = require('../controllers/admin')

router.post('/coaches/courses', isAuth, isCoach, handleErrorAsync(adminController.postCourse))

router.put('/coaches/courses/:courseId', isAuth, isCoach, handleErrorAsync(adminController.putCourse))

router.post('/coaches/:userId', handleErrorAsync(adminController.postCoach))



module.exports = router