const express = require('express')

const router = express.Router()
const { dataSource } = require('../db/data-source')
// const AppDataSource = require('../db')
const logger = require('../utils/logger')('Skill')
const appError = require('../utils/appError')
const { isNotValidInteger, isNotValidSting, isUndefined } = require('../utils/validUtils')
router.get('/', async (req, res, next) => {
    try {
        const skills = await dataSource.getRepository("Skill").find({
          select: ["id", "name"]
        })
        res.status(200).json({
            status: "success",
            data: skills
        })
      } catch (error) {
        next(error)
      }
})

router.post('/', async (req, res, next) => {
    try {
        const { name } = req.body;
        if (isUndefined(name) || isNotValidSting(name)) {
            // res.status(400).json({
            //     status: "failed",
            //     message: "欄位未填寫正確"
            // })
            next(appError(400, '欄位未填寫正確'));
            return
        }
        const skillRepo = await dataSource.getRepository("Skill")
        const existPackage = await skillRepo.find({
          where: {
            name: name
          }
        })
        if (existPackage.length > 0) {
            // res.status(409).json({
            //     status: "failed",
            //     message: "資料重複"
            // })
            next(appError(409, '資料重複'));
            return
        }
        const newSkill = await skillRepo.create({
          name: name
        })
        const result = await skillRepo.save(newSkill)
        res.status(200).json({
            status: "success",
            data: result
        })
        return
      } catch (error) {
        next(error)
      }
})

router.delete('/:skillId', async (req, res, next) => {
    try {
        const { skillId } = req.params
        if (isUndefined(skillId) || isNotValidSting(skillId)) {
            // res.status(400).json({
            //     status: "failed",
            //     message: "ID錯誤"
            // })
            next(appError(400, 'ID錯誤'));
            return
        }
        const result = await dataSource.getRepository("Skill").delete(skillId)
        if (result.affected === 0) {
            // res.status(400).json({
            //     status: "failed",
            //     message: "ID錯誤"
            // })
            next(appError(400, 'ID錯誤'));
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