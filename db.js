const mongoose = require('mongoose');
require('dotenv').config()
const mongoUri = process.env.DB_URL
const connectToMongo = async()=>{
    mongoose.connect(mongoUri,()=>{
        console.log('Connected To Mongo Db Successfully')
    })
}

module.exports = connectToMongo