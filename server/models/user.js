const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

var UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        unique:true,
        validate:{
            validator:(value)=>{
                return validator.isEmail(value);
            },
            message:'{VALUE} is not a valid email'
        }
    },
    password:{
        type:String,
        require:true,
        minlength:6
    },
    tokens:[{
        access:{
            type:String,
            required:true
        },
        token:{
            type:String,
            required:true
        }
    }]
});

//modify the user object to return just id and email and leaving out the token and password
UserSchema.methods.toJSON = function(){
    var user =  this;
    var userObject = user.toObject();
    return _.pick(userObject,['_id','email']);
};



//arrow function doesnot bind a this key and that the reason we have use a regular function
UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();

    user.tokens.push({
        access,token
    });

    return user.save().then(()=>{
        return token;
    })
};

//find by token(statics is more like a model method)
UserSchema.statics.findByToken = function(token){
    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token,'abc123');
    }catch(e){
        // return new Promise((resolve,reject)=>{
        //     reject();
        // })
        return Promise.reject();
    }
    console.log("decoded: ",decoded)
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}

var User = mongoose.model('User',UserSchema);

module.exports = {User};