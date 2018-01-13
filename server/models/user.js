const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

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

UserSchema.methods.removeToken= function(token){
    var user = this;
    return user.update({
        $pull:{
            tokens:{
                token:token
            }
        }
    })
}

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
    return User.findOne({
        '_id':decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
}

UserSchema.statics.findByCredentials = function(email,password){
    var User = this;

    return User.findOne({email}).then((user)=>{
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve,reject)=>{
            bcrypt.compare(password,user.password,(err,res)=>{
                if(res){
                    resolve(user);
                } else{
                    reject();
                }
            })
        })
    })
};
UserSchema.pre('save',function(next){
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(user.password,salt,(err,hash)=>{
                user.password = hash;
                next();
            })
        });
    } else {
        next();
    }
});

var User = mongoose.model('User',UserSchema);

module.exports = {User};