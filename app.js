const express = require("express")
const mongoose =require("mongoose")
const bodyParser = require("body-parser");
const cors=require("cors")
const app=express()
const indexRoutes = require('./routes/index');
require("dotenv").config()
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use('/zs',indexRoutes)



const mongoURI = process.env.LOCAL_DB_ADDRESS;
console.log(mongoURI,'mongouri')
mongoose
  .connect(mongoURI, {  useUnifiedTopology: true })
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log("DB connection fail", err));

  app.listen(process.env.PORT || 5000,()=>{
    console.log('server on');
  })