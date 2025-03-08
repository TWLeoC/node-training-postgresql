const express = require('express')
const bcrypt = require('bcrypt')

const router = express.Router()
const { dataSource } = require('../db/data-source')
const logger = require('../utils/logger')('Users')

const { isNotValidInteger, isNotValidSting, isUndefined, isValidPassword, isValidName} = require('../utils/validUtils')
const appError = require('../utils/appError')
const { generateJWT, verifyJWT } = require('../utils/jwtUtils');
const isAuth = require('../middlewares/isAuth')

const saltRounds = 10

router.post('/signup', async (req, res, next) => {
    try {
        const { name, email, password } = req.body
        if (isUndefined(name) || isNotValidSting(name) ||
        isUndefined(email) || isNotValidSting(email) ||
        isUndefined(password) || isNotValidSting(password)) {
            // res.status(400).json({
            //     status: "failed",
            //     data: '欄位未填寫正確'
            // })
            next(appError(400, '欄位未填寫正確'));
            return
        }
        if (!isValidPassword(password)) {
            // res.status(400).json({
            //     status: "failed",
            //     data: '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'
            // })
            next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'));
            return
        }
        const userRepo = await dataSource.getRepository("User")
        const findUser = await userRepo.findOne({
            where: {
                email
            }
        })
        if (findUser) {
            // res.status(409).json({
            //     status: "failed",
            //     data: 'Email已被使用'
            // })
            next(appError(409, 'Email已被使用'))
            return
        }
        const hashPassword = await bcrypt.hash(password, saltRounds)
        const newUser = await userRepo.create({
            name,
            password: hashPassword,
            email,
            role: 'USER'
          })
          const result = await userRepo.save(newUser)
        res.status(200).json({
            status: "success",
            data: {
                user: {
                    id: result.id,
                    name: result.name
                }
            }
        })
        return
      } catch (error) {
        next(error)
      }
})

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (isNotValidSting(email) || isNotValidSting(password) || isUndefined(email) || isUndefined(password)) {
            next(appError(400, '欄位未填寫正確'))
            return
        }
        if (!isValidPassword(password)) {
            next(appError(400, '密碼不符合規則，需要包含英文數字大小寫，最短8個字，最長16個字'))
            return
        }
        // 使用者不存在或密碼輸入錯誤
        const userRepo = dataSource.getRepository('User')
        const findUser = await userRepo.findOne({
            select: ['id', 'name', 'password'],
            where: {
                email
            }
        })
        if (!findUser) {
            next(appError(400, '使用者不存在或密碼輸入錯誤'))
            return
        }

        const isMath = await bcrypt.compare(password, findUser.password)
        if (!isMath) {
            next(appError(400, '使用者不存在或密碼輸入錯誤'))
            return
        }

        // TODO JWT
        const token = generateJWT({
            id: findUser.id,
            role: findUser.role
        })

        res.status(201).json({
            status: 'success',
            data: {
                token,
                user: {
                    name: findUser.name
                }
            }
        })
    } catch (error) {
        next(error)
    }
})

router.get('/profile', isAuth, async (req, res, next) => {
    try {
      const { id } = req.user

      if (isUndefined(id) || isNotValidSting(id)) {
        next(appError(400, '欄位未填寫正確'))
        return
      }
      
    // 要進資料庫，要記得等待～～
      const findUser = await dataSource.getRepository('User').findOne({
        where: { id }
      })
    //   {
    //     "status": "success",
    //     "data": {}
    //   }

      res.status(200).json({
        status: 'success',
        data: {
          email: findUser.email,
          name: findUser.name
        }
      })
    } catch (error) {
      logger.error('取得使用者資料錯誤:', error)
      next(error)
    }
  })

router.put('/profile', isAuth, async (req, res, next) => {
    try {
        const { id } = req.user
        const { name } = req.body
        if (isUndefined(name) || isNotValidSting(name) || !isValidName(name)) {
            next(appError('400', '欄位未填寫正確'))
            return
        }
        const userRepo = dataSource.getRepository('User')
        
        // TODO 檢查使用者名稱未變更
        const findUser = await userRepo.findOne({
            where: {
                id
            }
        })
        if (findUser.name === name) {
            next(appError('400', '使用者名稱未變更'))
            return
        }

        const updateUser = await userRepo.update({
            id
        }, {
            name
        })

        if (updateUser.affected === 0) {
            next(appError('400', '更新使用者失敗'))
            return
        }

      
        res.status(200).json({
            status: 'success',
        })
      
        } catch (error) {
        logger.error('取得使用者資料錯誤:', error)
        next(error)
    }
})

module.exports = router