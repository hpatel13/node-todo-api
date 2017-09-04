const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id:10
};

var token = jwt.sign(data,'123abc');
console.log(token);

var decoded = jwt.verify(token,'123abc')
console.log("decoded: ",decoded)
// this can be done use a library jason web token, crpyto-js was used only in playground folder

// var message = " I am user3";
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}, Hash: ${hash}`);

// var data = {
//     id:4
// };

// var token = {
//     data:data,
//     hash:SHA256(JSON.stringify(data)+'somesecret').toString()
// }

// token.data.id= 6
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(data)+'somesecret').toString();

// if(resultHash === token.hash){
//     console.log('Data was not changed');
// } else{
//     console.log('Data was changed. Do not trust');
// }
