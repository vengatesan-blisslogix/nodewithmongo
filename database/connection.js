var MongoClient = require('mongodb').MongoClient;
var db_url = require('../database');


exports.db_connect = function(collection_name,query,res) {
MongoClient.connect(db_url, function(err, db) {
	if (err){
	res.status(400).send({ response: err });
	}
	else
	{
		db.collection(collection_name).find(query).toArray(function(err, result) {
			if (err){
			res.status(400).send({ response: err });
			}
			else
			{
			res.status(200).send({ response: result });
			}     
		});
	}
});

};