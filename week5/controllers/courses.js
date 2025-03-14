const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const logger = require('../utils/logger')('UsersController')
const { isNotValidInteger, isNotValidSting, isUndefined, isValidPassword, isValidName } = require('../utils/validUtils')

const coursesController = {
    async getCourse (req, res, next) {
        const getCourse = await dataSource.getRepository('Course').find({
            select: {
                User: {
                    id: true,
                    name: true
                },
                Skill: {
                    id: true,
                    name: true
                },
                id: true,
                name: true,
                description: true,
                start_at: true,
                end_at: true,
                max_participants: true
              },
              relations: {
                User: true,
                Skill: true
            }
        })
        
        const result = getCourse.map(course=> {
            return {
                id: course.id,
                coach_name: course.User.name || '',
                skill_name: course.Skill.name || '',
                name: course.name,
                description: course.description,
                start_at: course.start_at,
                end_at: course.end_at,
                max_participants: course.max_participants
            }
        })
        res.status(200).json({
            status: "success",
            data: result
        })
    }
}

module.exports = coursesController