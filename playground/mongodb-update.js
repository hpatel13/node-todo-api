//const MongoClient = require('mongodb').MongoClient;
//object destructuring es6
const {MongoClient,ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
    if(err){
        return console.log("Unable to connect to Mongodb server");
    }
    console.log("Connected to Mongodb server");

    //Update find one and update in todos table
    db.collection('Todos').findOneAndUpdate({
        _id:new ObjectID('597cd3d4b22bac83b2446065')
    },{
        $set:{
            completed:true
        }
    },{
        returnOriginal:false
    }).then((res)=>{
        console.log(res);
    })

    //Update find one and update in Users table
    db.collection('User').findOneAndUpdate({
        _id: new ObjectID('597bd180ea9d6d3634d036d8')
    },{
        $set:{
            name:"Harsh",
            location:"Boston,MA"
        },
        // $inc:{
        //     age:1,
        // }
    },{
        returnOriginal:false
    }).then((res)=>{
        console.log(res);
    })

    //Update find one and increment age by 1 in Users table
    db.collection('User').findOneAndUpdate({
        _id: new ObjectID('597bd180ea9d6d3634d036d8')
    },{
        $inc:{
            age:+1,
        }
    },{
        returnOriginal:false
    }).then((res)=>{
        console.log(res);
    })
    //db.close();
});