const { dataSource } = require('../db/data-source')
const appError = require('../utils/appError')
const logger = require('../utils/logger')('CoachesController')
const { isNotValidInteger, isNotValidSting, isUndefined, isValidPassword, isValidName } = require('../utils/validUtils')

const coachesController = {
    async getCoachesList (req, res, next) {
        const { per, page } = req.query
        if(isNotValidSting(per) || isNotValidSting(page)) {
            next(appError(400, '欄位未填寫正確'))
            return
        }

        // per & page 轉成數字
        const take = parseInt(per)
        const currentPage = parseInt(page)
        const skip = (currentPage - 1) * take
        // 取得教練列表
        const showCoaches = await dataSource.getRepository('Coach').find({
            select: {
                id: true,
                User:{
                    id: true,
                    name: true
                }
            },
            relations: {
                User: true
            },
            take,
            skip,
        })
        // console.log(showCoaches)

        const result = showCoaches.map(coach => {
            return {
            id: coach.User.id,
            name: coach.User.name
            };
        });

        res.status(200).json(
            {
                "status" : "success",
                "data": result
            })
        },

    async getCoach (req, res, next) {
            const { coachId } = req.params
            if(isNotValidSting(coachId) || isUndefined(coachId)) {
                next(appError(400, '欄位未填寫正確'))
                return
            }
            const getCoach = await dataSource.getRepository('Coach').findOne({
                where: { id:coachId },
                select: {
                    User:{
                        id: true,
                        name: true,
                        role: true
                    },
                    id: true,
                    user_id: true,
                    experience_years: true,
                    description: true,
                    profile_image_url: true,
                    created_at: true,
                    updated_at: true
                },
                relations: {
                    User: true
                }
            })
            if (!getCoach) {
                next(appError(400, '找不到該教練'))
                rerurn
            }

            res.status(200).json({
                status: 'success',
                data: {
                    user: {
                        name: getCoach.User.name,
                        role: getCoach.User.role
                    },
                    coach: {
                        id: getCoach.id,
                        user_id: getCoach.user_id,
                        experience_years: getCoach.experience_years,
                        description: getCoach.description,
                        profile_image_url: getCoach.profile_image_url,
                        created_at: getCoach.created_at,
                        updated_at: getCoach.updated_at
                    }
                }
            })
        }
}

module.exports = coachesController