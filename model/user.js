
const mongoose = require("mongoose")
const Schema=mongoose.Schema;
require('dotenv').config()

const userSchema = Schema({
  email:{
    type:String,
    required:true,

  },
  picture:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
  
  },
  firstName:{
    type:String,
  },
  status:{
    type:String,
    default:'free'
  },
  refCode:{
    type:String,
  },
  myRef:{
    type:Array,
  },
  lang:{
    type:String,
    default:'English'
  },
  promptStyle:{
    type:String
    
  },
  credit:{
    type:Number,
    
  },
},{timestamps:true})
userSchema.method.toJSON=function(){
  const obj = this._doc;
  delete obj;__v;
  return obj;
};
const User = mongoose.model('User',userSchema)
module.exports=User
