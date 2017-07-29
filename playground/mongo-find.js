//const MongoClient = require('mongodb').MongoClient;
//object destructuring es6
const {MongoClient,ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log("Unable to connect to Mongodb server");
    }
    console.log("Connected to Mongodb server");

    // To fetch all data from the mongodb record
    // db.collection('Todos').find().toArray().then(function(docs){
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log('Unable to fetch todos',err)
    // });

    //To fetch all data from the mongodb record that as completed:false
    // db.collection('Todos').find({completed:false}).toArray().then(function(docs){
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log('Unable to fetch todos',err)
    // });

    //To fetch data from the mongodb record by specific id
    // db.collection('Todos').find({
    //     _id:new ObjectID('597bce0728efcd0be0d5ece4')
    // }).toArray().then(function(docs){
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs,undefined,2));
    // },(err)=>{
    //     console.log('Unable to fetch todos',err)
    // });

    // To count the data from Todos collection
    // db.collection('Todos').find().count().then(function(count){
    //     console.log('Todos');
    //     console.log('Todos count',count);
    // },(err)=>{
    //     console.log('Unable to fetch todos',err)
    // });

    // find user by name
    db.collection('User').find({name:'Harsh'}).toArray().then((res)=>{
        console.log("selected user is : ",JSON.stringify(res,undefined,2));
    },(err)=>{
        console.log("Unable to reach the server");
    })
    //db.close();
});