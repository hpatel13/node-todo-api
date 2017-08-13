const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = "598ff3ab714176b01d458ffc";
var userid = "597d8a82225a901c3112eede"
// if(!ObjectID.isValid(id)){
//     console.log('Id not valid');
// }

Todo.find({
    _id:id
}).then((todos)=>{
    console.log('todos : ',todos);
})

Todo.findOne({
    _id:id
}).then((todo)=>{
    console.log('todo : ',todo);
})

Todo.findById(id).then((todo)=>{
    if(!todo)
        return console.log('Id not found');
    console.log('todo By Id : ',todo);
}).catch((e)=> console.log(e));

User.findById(userid).then((user)=>{
    if(!user)
        return console.log('User Id not found');
    console.log('User By Id : ',user);
},(e)=>{
    console.log(e);
}).catch((e)=> console.log(e));
//http://mongoosejs.com/docs/queries.html
// to learn more methods