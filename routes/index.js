const express = require("express")
const router = express.Router()
const userApi=require('./user.api')
const historyApi=require('./history.api')

router.use('/user',userApi)
router.use('/history',historyApi)






module.exports=router;