const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


//Todo.remove({}) remove everything
// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

//Todo.findOneAndRemove() remove the 1st matching doc
Todo.findOneAndRemove({_id:"5990a727395d8f11810fa8e5"}).then((result)=>{
    console.log(result);
})


//Todo.findByIDAndRemove()
Todo.findByIdAndRemove("5990a727395d8f11810fa8e5").then((result)=>{
    console.log(result);
})
//http://mongoosejs.com/docs/queries.html
// to learn more methods