const express = require("express")
const mongoose =require("mongoose")
const bodyParser = require("body-parser");
const cors=require("cors")
const app=express()
const indexRoutes = require('./routes/index');
const { MongoClient } = require('mongodb');
const cron = require('node-cron');
const User =require('./model/user')
require("dotenv").config()
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use('/zs',indexRoutes)



const mongoURI = process.env.LOCAL_DB_ADDRESS;

mongoose
  .connect(mongoURI)
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log("DB connection fail", err));

//--------------------------------------------------
cron.schedule('0 24 * * *',async () => {
  console.log('크론 작업이 실행되었습니다.');
  console.log(new Date().toString());
  try{
    const user = User.find({status:'free'})
    if(user){
      await user.updateMany({},{$set:{credit:10}});
      console.log('모든 사용자의 크레딧이 성공적으로 업데이트되었습니다.');
      console.log(user,'user')
      console.log(new Date().toString());
    }else{
      console.log(user,'all status')
    }
   

  }catch(error){
    console.error('크레딧 업데이트 중 에러가 발생했습니다:', error);
  }
},{
  scheduled: true,
  timezone: "America/New_York" 
});
//------------------------------------------






  app.listen(process.env.PORT || 5000,()=>{
    console.log('server on');
  })


