const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const logger = require('../utils/logger')('CreditPackageController')
const { isNotValidInteger, isNotValidSting, isUndefined, isValidPassword, isValidName } = require('../utils/validUtils')

const creditPackageController = {
    async getPackage (req, res, next) {
        const packages = await dataSource.getRepository("CreditPackage").find({
            select: ["id", "name", "credit_amount", "price"]
          })
          
          res.status(200).json({
              status: "success",
              data: packages
          })
    },

    async postPackage (req, res, next) {
        const { name, credit_amount, price } = req.body;
        if (isUndefined(name) || isNotValidSting(name) ||
                isUndefined(credit_amount) || isNotValidInteger(credit_amount) ||
                isUndefined(price) || isNotValidInteger(price)) {
            
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
    },

    async deletePackage (req, res, next) {
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
    }
}


module.exports = creditPackageController