require('dotenv').config()
const express = require('express');
const cors = require('cors')
const path = require('path')
const app = express();
const creditPackageRouter = require('./routes/creditPackage')
const skillRouter = require('./routes/skill')
const usersRouter = require('./routes/users')
const datasource = require('./db')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended : false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/api/credit-package', creditPackageRouter)
app.use('/api/coaches/skill', skillRouter)
app.use('/api/users', usersRouter)

//監聽 port
const port = process.env.PORT || 3000;
app.listen(port, async () => {
    try {
        await datasource.initialize()
        console.log('資料庫連線成功')
        console.log(`伺服器運作中. port: ${port}`)
    } catch (error) {
        console.log(`資料庫連線失敗: ${error.message}`)
        process.exit(1)        
    }
})
