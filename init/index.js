const mongoose= require('mongoose')
const taskModel = require('../models/taskModel.js')
const { data } = require('./taskData.js')

const MONGO_URL= "mongodb://127.0.0.1:27017/dropIn"

main().then(()=>{
    console.log("Mongodb connected")
}).catch(err=>{
 console.log(err)
})

async function main(){
    await mongoose.connect(MONGO_URL)

}

const initDB = async () => {
    
    await taskModel.insertMany(data);
    console.log("Data Saved");
};


initDB()
