const mongoose = require('mongoose');
const Schema = mongoose.Schema

const taskSchema= new Schema({
    title:{
        type:String,
        default:"New Task",
    },
    description:{
        type: String,
        default:"New task kaa kaam",
    },
    priority: {
    type: String,
    enum: ['Low', 'Medium', 'Urgent'],
    required: true
  },
  
})



module.exports=mongoose.model('Task',taskSchema)