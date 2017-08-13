var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
const {ObjectID} = require('mongodb');

var app = express();

const port = process.env.PORT || 3000;

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

app.listen(port,()=>{
    console.log("started server on port ",port);
});


module.exports = {app};