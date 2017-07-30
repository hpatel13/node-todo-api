//const MongoClient = require('mongodb').MongoClient;
//object destructuring es6
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log("Unable to connect to Mongodb server");
    }
    console.log("Connected to Mongodb server");

    //delete many
    // db.collection('Todos').deleteMany({text:'eat lunch'}).then((res)=>{
    //     console.log(res);
    // })

    //delete one
    // db.collection('Todos').deleteOne({text:'eat lunch'}).then((res)=>{
    //     console.log(res);
    // })

    //find and delete
    // db.collection('Todos').findOneAndDelete({text:'eat lunch'}).then((res)=>{
    //     console.log(res);
    // })

    //Users collection delete duplicates
    // db.collection('User').deleteMany({name:'Harsh'}).then((res)=>{
    //     console.log(res);
    // })

    //Users collection delete by id
    db.collection('User').findOneAndDelete({_id:new ObjectID('597c362bb22bac83b2445f89')}).then((res)=>{
       console.log(res)
    })
    //db.close();
});