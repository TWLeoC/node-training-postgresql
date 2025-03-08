const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
// const AppDataSource = require('../db')
const logger = require('../utils/logger')('CreditPackage')
const { isNotValidInteger, isNotValidSting, isUndefined } = require('../utils/validUtils')
const appError = require('../utils/appError')

router.get('/', async (req, res, next) => {
    try {
        const packages = await dataSource.getRepository("CreditPackage").find({
          select: ["id", "name", "credit_amount", "price"]
        })
        // res.writeHead(200, headers)
        // res.write(JSON.stringify({
        //   status: "success",
        //   data: packages
        // }))
        // res.end()
        res.status(200).json({
            status: "success",
            data: packages
        })
      } catch (error) {
        next(error)
      }
})

router.post('/', async (req, res, next) => {
    try {
        const { name, credit_amount, price } = req.body;
        if (isUndefined(name) || isNotValidSting(name) ||
                isUndefined(credit_amount) || isNotValidInteger(credit_amount) ||
                isUndefined(price) || isNotValidInteger(price)) {
            // res.status(400).json({
            //     status: "failed",
            //     message: "欄位未填寫正確"
            // })
            next(appError(400, "欄位未填寫正確"));
            return
        }
        const creditPackageRepo = await dataSource.getRepository("CreditPackage")
        const existPackage = await creditPackageRepo.find({
          where: {
            name: name
          }
        })
        if (existPackage.length > 0) {
            // res.status(409).json({
            //     status: "failed",
            //     message: "資料重複"
            // })
            next(appError(400, "資料重複"));
            return
        }
        const newPackage = await creditPackageRepo.create({
          name: name,
          credit_amount: credit_amount,
          price: price
        })
        const result = await creditPackageRepo.save(newPackage)
        res.status(200).json({
            status: "success",
            data: result
        })
        return
      } catch (error) {
        next(error)
      }
})

router.delete('/:creditPackageId', async (req, res, next) => {
    try {
        const { creditPackageId } = req.params
        if (isUndefined(creditPackageId) || isNotValidSting(creditPackageId)) {
            res.status(400).json({
                status: "failed",
                message: "ID錯誤"
            })
            return
        }
        const result = await dataSource.getRepository("CreditPackage").delete(creditPackageId)
        if (result.affected === 0) {
            res.status(400).json({
                status: "failed",
                message: "ID錯誤"
            })
            return
        }
        res.status(200).json({
            status: "success"
        })
    } catch (error) {
        next(error)
    }
})

module.exports = router
