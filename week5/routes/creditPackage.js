const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
// const AppDataSource = require('../db')
const logger = require('../utils/logger')('CreditPackage')
const { isNotValidInteger, isNotValidSting, isUndefined } = require('../utils/validUtils')
const appError = require('../utils/appError')
const handleErrorAsync = require('../utils/handleErrorAsync')
const creditPackageController = require('../controllers/creditPackage')

router.get('/', handleErrorAsync(creditPackageController.getPackage))

router.post('/', handleErrorAsync(creditPackageController.postPackage))

router.delete('/:creditPackageId', handleErrorAsync(creditPackageController.deletePackage))

module.exports = router
