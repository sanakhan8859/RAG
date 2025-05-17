const mongoose = require("mongoose")
require('dotenv').config()

const NODE_ENV = process.env.NODE_ENV

const MONGODB_URI = process.env[`${NODE_ENV}_MONGODB_URI`]

mongoose.connect(MONGODB_URI).then(()=>{
    console.log(`Connected to ${NODE_ENV} MONGODB`)
}).catch((err)=>{
    console.log(`Error while connecting to ${NODE_ENV} MONGODB, with err - ${err}`)
})