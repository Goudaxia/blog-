const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/blog6";
const ObjectId = require('objectid');

class Category{

	constructor(title,order,id){
		this.title = title;
		this.order = order;
		this._id = ObjectId(id);
	}

	add(callback){
		MongoClient.connect(url,(err,db) => {
			if(err){
				return callback(err);
			}
			let category = db.collection('category');
			category.insert({title:this.title,order:this.order},(err,result) => {
				return callback(err,result);
			});
		});
	}

	edit(callback){
		MongoClient.connect(url,(err,db) => {
			if(err){
				return callback(err);
			}
			let category = db.collection('category');
			category.findOne({_id:this._id},(err,result) => {
				return callback(err,result);
			});
		});
	}

	update(callback){
		MongoClient.connect(url,(err,db) => {
			if(err){
					return callback(err);
			}
			let category = db.collection('category');
			category.update({_id:this._id},{title:this.title,order:this.order},(err,result) => {
				return callback(err,result);
			});
		});
	}
}
Category.getCats = function(callback){
	MongoClient.connect(url,(err,db) => {
		if(err) {
			return callback(err);
		}
		let category = db.collection('category');
		category.find({},{}).sort({order:-1}).toArray((err,result) => {
			return callback(err,result);
		});
	});
}

module.exports = Category;