const {Todo} = require('./../../models/todo');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
const {User} = require('./../../models/user');

//make sure db is empty before test runs
const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id:userOneId,
    email:'userone@example.com',
    password:"userOnePass",
    tokens:[{
        access:'auth',
        token: jwt.sign({_id:userOneId,access:'auth'},'abc123').toString()
    }]
},{
    _id:userTwoId,
    email:'usertwo@example.com',
    password:'userTwoPass',
    tokens:[{
        access:'auth',
        token: jwt.sign({_id:userTwoId,access:'auth'},'abc123').toString()
    }]
}]

const populateUsers = (done) => {
    User.remove({}).then(()=>{
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();

        return Promise.all([user1,user2])

    }).then(() => done());
}

const todos = [{
    _id:new ObjectID(),
    text:'1st test todo',
    _creator:userOneId
},{
    _id:new ObjectID(),
    text:'2nd test todo',
    completed:true,
    completedAt:333,
    _creator:userTwoId
}];


const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        Todo.insertMany(todos);
    }).then(()=>{
        done();
    })
};

module.exports = {todos,populateTodos,populateUsers,users};