var express = require('express');
var router = express.Router();
var db_url = require('../database');
var db_connect = require('../database/connection.js');
var jwt = require('jsonwebtoken');
var validate = require('express-jsonschema').validate;
var authSchema = require('../schema/auth');
var bcrypt = require('bcrypt-nodejs');

function isLoggedin(req, res, next) {
    if (req.headers.auth_token) {
      var query = {"auth_token": req.headers.auth_token};
        db_connect.db_connect('users',query,'authenticate',res,next);
        //next()
    }
    else {
        res.status(500).send({ message: "Unauthorized user" });
    }
}

router.post('/login', validate({body: authSchema[0].loginSchema}), function (req, res,next) {
var query = req.body;
console.log(query);
var db_call = db_connect.db_connect('users',query,'login',res,next);
//console.log(db_call);
})

router.post('/signup', validate({body: authSchema[1].signupSchema}), function (req, res,next) {
var query = req.body;
var password_hash = bcrypt.hashSync(req.body.password.trim());
query.password = password_hash;
query.auth_token = ""; 
query.menu = ""; 
var db_call = db_connect.db_connect('users',query,'signup',res,next);
//console.log(db_call);
})

router.get('/user/:id', isLoggedin, function (req, res,next) {
var query = {"id": req.params.id};
console.log(query);
var db_call = db_connect.db_connect('users',query,'getuser',res,next);
// //console.log(db_call);
})

module.exports = router;