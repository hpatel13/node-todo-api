require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

//for Heroku u can set scret key JWT_SCERET of config.json by running following command in cmd
//heroku config:set JWT_SECRET=abc123

var app = express();

const port = process.env.PORT;

app.use(bodyParser.json())

app.post('/todos',authenticate,(req,res)=>{
     // console.log(req.body);
     var todo = new Todo({
        text:req.body.text,
        _creator:req.user._id
    });
     todo.save().then((doc)=>{
        res.send(doc);
     },(e)=>{
        res.status(400).send(e);
     });
})

app.get('/todos',authenticate,(req,res)=>{

    Todo.find({
        _creator:req.user._id
    }).then((todos)=>{
        res.send({todos})
    },(e)=>{
        res.status(400).send(e);
    })
});

app.get('/todos/:id',authenticate,(req,res)=>{
    var id=req.params.id;
    if(!ObjectID.isValid(id))
        return res.status(404).send("Not a valid Id");
    //res.send(req.params);

    Todo.findOne({_id:id,_creator:req.user._id}).then((todo)=>{
        if(!todo){
           return res.status(404).send("No todo found");
        }
        res.send({todo})
    },(e)=>{
        res.status(400).send(e);
    })
});

app.delete('/todos/:id',authenticate,(req,res)=>{
    var id = req.params.id

    if(!ObjectID.isValid(id))
        return res.status(404).send("Invalid ID");

    Todo.findOneAndRemove({_id:id,_creator:req.user._id}).then((todo)=>{
        if(!todo)
            return res.status(404).send("No doc exists with given ID");

        res.send({todo});
    },(e)=>{
        res.status(400).send("");
    })
});

app.patch('/todos/:id',authenticate,(req,res)=>{
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
    Todo.findOneAndUpdate({_id:id,_creator:req.user._id}, {$set:body},{new:true}).then((todo)=>{
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


//private route
app.get('/users/me',authenticate,function(req,res){
    // var token = req.header('x-auth');
    // console.log(token);
    // User.findByToken(token).then((user)=>{
    //     if(!user){
    //         return Promise.reject();
    //     }
    //     console.log('user is : ',user)
    //     res.send(user);
    // }).catch((e)=>{
    //     res.status(401).send();
    // });
    res.send(req.user);
})

//Post /users/login {email,password}
app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body,['email','password']);

    User.findByCredentials(body.email,body.password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth',token).send(user);
        })
    }).catch((e)=>{
        res.status(400).send();
    });
})
app.listen(port,()=>{
    console.log("started server on port ",port);
});

app.delete('/users/me/token',authenticate,(req,res) =>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    },()=>{
        res.status(400).send();
    })
})
module.exports = {app};