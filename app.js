const express = require("express")
const mongoose =require("mongoose")
const bodyParser = require("body-parser");
const cors=require("cors")
const app=express()
const indexRoutes = require('./routes/index');
const cron = require('node-cron');
const User =require('./model/user')
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

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
cron.schedule('0 23 * * *',async () => {
  console.log('크론 작업이 실행되었습니다.');
  console.log(new Date().toString());
  try{
    const user = User.find({status:'free'})
    const allUsers = await User.find({}).toArray(); 
    if(user){
      await user.updateMany({},{$set:{credit:20}});
      console.log('모든 사용자의 크레딧이 성공적으로 업데이트되었습니다.');
      console.log(user,'user')
      console.log(new Date().toString());
    }else{
      console.log(user,'all status')
    }

  if(allUser){
    for (let user of allUsers) {
      if (user.myRef && user.myRef.length > 0) {
   
        await User.updateOne({ _id: user._id }, { $set: { credit: user.myRef.length * 10 } });
      }else{
        console.log(user,'something wrong for allUser')
      }
    }
  }
    //--------------------------------
  
    
    
   //----------------------------------

  }catch(error){
    console.error('크레딧 업데이트 중 에러가 발생했습니다:', error);
  }
},{
  scheduled: true,
  timezone: "America/New_York" 
});
//------------------------------------------






app.listen(5000, () => {
  console.log('Server is running on port 5000');
 
});

