var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp');

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
    }
});

var User = mongoose.model('User',{
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:2
    }
});

var newUser = new User({
    email:"harsh3230@gmail.com"
})

newUser.save().then((res)=>{
    console.log(res)
})
// var newData = new Todo({
//     text:"cook Breakfast",
//     completed:false
// })

// var newData2 = new Todo({
//     text:"cook Lunch",
//     completed:false,
//     completedAt:2
// })

// var newData2 = new Todo({
//     text:"feed dog      ",
// })

// newData2.save().then((res)=>{
//     console.log(res)
// })