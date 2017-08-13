const {ObjectID} = require('mongodb');
const _ = require('lodash');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// if(!ObjectID.isValid(id)){
//     console.log('Id not valid');
// }


//http://mongoosejs.com/docs/queries.html
// to learn more methods