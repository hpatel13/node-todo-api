require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {ObjectID} = require('mongodb');

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json())

app.post('/todos',(req,res)=>{
     // console.log(req.body);
     var todo = new Todo(req.body);
     todo.save().then((doc)=>{
        res.send(doc);
     },(e)=>{
        res.status(400).send(e);
     });
})

app.get('/todos',(req,res)=>{

    Todo.find().then((todos)=>{
        res.send({todos})
    },(e)=>{
        res.status(400).send(e);
    })
});

app.get('/todos/:id',(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send("Not a valid Id");
    //res.send(req.params);

    Todo.findById(id).then((todo)=>{
        if(!todo){
           return res.status(404).send("No todo found");
        }
        res.send({todo})
    },(e)=>{
        res.status(400).send(e);
    })
});

app.delete('/todos/:id',(req,res)=>{
    var id = req.params.id

    if(!ObjectID.isValid(id))
        return res.status(404).send("Invalid ID");

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo)
            return res.status(404).send("No doc exists with given ID");

        res.send({todo});
    },(e)=>{
        res.status(400).send("");
    })
});

app.patch('/todos/:id',(req,res)=>{
    var id = req.params.id;
    // we want user to update only 2 field in db which can be done by following
    var body = _.pick(req.body,['text','completed']);

    if(!ObjectID.isValid(id))
        return res.status(404).send("Invalid ID");

    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    } else{
        body.completed = false;
        body.completedAt = null;
    }

    //refer mongoose-update
    Todo.findByIdAndUpdate(id, {$set:body},{new:true}).then((todo)=>{
        if(!todo)
            return res.status(404).send("Invalid ID");

        res.send({todo})
    }).catch((e)=> res.status(400).send())
})

//signing up a new user.
app.post('/users',(req,res)=>{
    var body = _.pick(req.body,['email','password'])
     var user = new User(body);

     //model method
     //User.findByToken()
     //instance method
     //user.generateAuthToken()

     user.save().then(()=>{
        return user.generateAuthToken();
        //res.send(doc);
     }).then((token) => {
        res.header('x-auth',token).send(user);
     }).catch((e)=>{
        res.status(400).send(e);
     });
});

app.listen(port,()=>{
    console.log("started server on port ",port);
});


module.exports = {app};