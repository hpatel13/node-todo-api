var mongoose = require('mongoose');

var Todo  = mongoose.model('Todo',{
    text:{
        type:String,
        required:true,
        minlength:2, //min length
        trim:true //remove the extra or trading white spaces
    },
    completed:{
        type:Boolean,
        default:false
    },
    completedAt:{
        type:Number,
        default:null
    },
    _creator:{
        require:true,
        type:mongoose.Schema.Types.ObjectId,
    }
});

module.exports = {Todo};