const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const logger = require('../utils/logger')('SkillController')
const { isNotValidInteger, isNotValidSting, isUndefined } = require('../utils/validUtils')

const skillController = {
  async getSkills (req, res, next)  {
    const skills = await dataSource.getRepository("Skill").find({
        select: ["id", "name"]
      })
      res.status(200).json({
          status: "success",
          data: skills
      })
  },

  async postSkill (req, res, next)  {
    const { name } = req.body;
    if (isUndefined(name) || isNotValidSting(name)) {
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
  },

  async deleteSkill (req, res, next)  {
    const { skillId } = req.params
    if (isUndefined(skillId) || isNotValidSting(skillId)) {
        next(appError(400, 'ID錯誤'));
        return
    }
    const result = await dataSource.getRepository("Skill").delete(skillId)
    if (result.affected === 0) {
        next(appError(400, 'ID錯誤'));
        return
    }
    res.status(200).json({
        status: "success"
    })
  }
}

module.exports = skillController