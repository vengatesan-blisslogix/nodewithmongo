var MongoClient = require('mongodb').MongoClient;
var db_url = require('../database');
var bcrypt = require('bcrypt-nodejs');
var mongo = require('mongodb');
function err_resp(res,err)
{
res.status(400).send({ status:false,ResponseObject: err });	
}
function success_resp(res,result)
{
res.status(200).send({status:true,ResponseObject: result });	
}

function login(db,email_q,query,collection_name,res) {
		db.collection(collection_name).findOne(email_q, function(err_mail, result) {
		if (err_mail){
		err_resp(res,err);
		}
		else
		{
		//password check
		if(result!=undefined){
		bcrypt.compare(query.password, result.password, function(err_pass, res_pass) {

		if (res_pass == true){				
		//update auth token
		var authtoken_login = bcrypt.hashSync(query.password.trim());
		var newvalues = { $set: { auth_token: authtoken_login } };
		db.collection(collection_name).updateOne(email_q, newvalues, function(err_auth, result_auth) {
		if (err_auth){
		err_resp(res,err_auth);
		}
		else{
		// send user data 
		var select ={ password: 0 };
		db.collection(collection_name).findOne(email_q,select, function(err_send, result_send) {
		if (err_send){
		err_resp(res,err_send);
		}
		else
		{
		success_resp(res,result_send);
		}
		});
		// send user data 				    
		}  
		});
		//update auth token
		}
		else{
		err_resp(res,"Invalid Password!");
		}
		});
		}
		else
		{
		err_resp(res,"Invalid Email!");
		}
		//password check		
		}     
		});
}//function login(db,email_q,query,collection_name,res) {

function signup(db,email_q,query,collection_name,res) {
		db.collection(collection_name).findOne(email_q, function(err_mail, result_mail) {
		if (err_mail){
		err_resp(res,err);
		}
		else
		{
		//console.log(result_mail);
		if(result_mail==undefined && result_mail==null){
		//signup
		db.collection(collection_name).insertOne(query, function(err, result) {
		if (err){
		err_resp(res,err);
		}
		else
		{
		//update auth token
		var authtoken_login = bcrypt.hashSync(query.password.trim());
		var newvalues = { $set: { auth_token: authtoken_login } };
		db.collection(collection_name).updateOne(email_q, newvalues, function(err_auth, result_auth) {
		if (err_auth){
		err_resp(res,err_auth);
		}
		else{
		// send user data 
		var select ={ password: 0 };
		db.collection(collection_name).findOne(email_q,select, function(err_send, result_send) {
		if (err_send){
		err_resp(res,err_send);
		}
		else
		{
		success_resp(res,result_send);
		}
		});
		// send user data 				    
		}  
		});
		//update auth token		
		}     
		});
		//signup
		}     
		else{
		err_resp(res,"Email already present. Please try with other Email!");
		}
		}
		});

}//function signup(db,email_q,query,collection_name,res) {

function getuser(db,query,collection_name,res) {
// send user data 
		var select ={ password: 0 ,auth_token:0};
		db.collection(collection_name).findOne(query,select, function(err_send, result_send) {
		if (err_send){
		err_resp(res,err_send);
		}
		else
		{
		success_resp(res,result_send);
		}
		});
// send user data
}//function getuser(db,query,collection_name,res) {

function authenticate(db,query,collection_name,res,next) {
	// send user data 
		var select ={ password: 0 ,auth_token:0};
		db.collection(collection_name).findOne(query,select, function(err_send, result_send) {
		if (err_send){
		
		}
		else
		{
			if(result_send!=undefined && result_send!=null)
			{
			next()	
			}
			else{
			res.status(500).send({ message: "Unauthorized user" });
			}
	     
		}
		});
// send user data
}//function authendicate(db,query,collection_name,next) {

exports.db_connect = function(collection_name,query,action,res,next) {

MongoClient.connect(db_url, function(err, db) {
	var error =0;
	if (err){
	error =1;
	}
	else
	{
//db queries start
	if(action=="login")
	{	
		var email_q = {"email":query.email};
		login(db,email_q,query,collection_name,res)
	}
	if(action=="signup"){
		var email_q = {"email":query.email};
		signup(db,email_q,query,collection_name,res)
	}
	if(action=="getuser"){
		var ObjectId = new mongo.ObjectID(query.id);
		var query1 = {"_id": ObjectId};
		getuser(db,query1,collection_name,res)
	}
	if(action=="authenticate"){
		authenticate(db,query,collection_name,res,next)
	}
//db queries end
	}
});//MongoClient.connect(db_url, function(err, db) {

};//exports.db_connect = function(collection_name,query,action,res) {

