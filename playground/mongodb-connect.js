//const MongoClient = require('mongodb').MongoClient;
//object destructuring es6
const {MongoClient,ObjectID} = require('mongodb');

// var obj = new ObjectID();
// console.log(obj);

// var user = {name:'andrew',age:25}
// var {name} = user;
// console.log(name);

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log("Unable to connect to Mongodb server");
    }
    console.log("Connected to Mongodb server");
    // todo will have two collections one for Todos and one for user
    // db.collection('Todos').insertOne({
    //     text:"Something to do",
    //     completed:false
    // },(err,result)=>{
    //     if(err){
    //         return console.log("Unable to insert todo");
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2))
    // })
    // db.collection('User').insertOne({
    //     name:"Harsh",
    //     age:26,
    //     location:"Mountain View"
    // },(err,res)=>{
    //     if(err)
    //         return console.log("Unable to insert into user collection");
    //     console.log(JSON.stringify(res.ops,undefined,2));
    //     console.log(res.ops[0]._id.getTimestamp());
    // })
    db.close();
});