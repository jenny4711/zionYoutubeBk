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
console.log(process.env.OPENAI_API_KEY1,'env')
//google ai2 :AIzaSyBNttB6_g1eWPoTgM2P4MwA86jjvk9rfwI

const mongoURI = process.env.LOCAL_DB_ADDRESS;
console.log(mongoURI,'mongouri')
mongoose
  .connect(mongoURI, {  useUnifiedTopology: true })
  .then(() => console.log("mongoose connected"))
  .catch((err) => console.log("DB connection fail", err));

  app.listen(process.env.PORT || 5000,()=>{
    console.log('server on');
  })

//   # GOOGLE_API_KEY="AIzaSyBPMxXnFVWTUjTj6scSo-oG2H2iLWJS2CY"
// # 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