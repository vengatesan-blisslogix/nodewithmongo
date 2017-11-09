var express = require('express');
var router = express.Router();
var db_url = require('../database');
var db_connect = require('../database/connection.js');
var jwt = require('jsonwebtoken');


function isLoggedin(req, res, next) {
    if (req.headers.auth) {
      var decode = jwt.decode(req.headers.auth);
        next();
    }
    else {
        res.status(500).send({ message: "Unauthorized" });
    }
}

router.post('/login', function (req, res) {
var query = { username: req.body.username, password:req.body.password };
var db_call = db_connect.db_connect('users',query,res);
//console.log(db_call);
})


module.exports = router;