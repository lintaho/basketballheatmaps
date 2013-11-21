
/*
 * GET home page.
 */

exports.index = function(db, heatmap){
		return function(req, res){

	 	var	string = "test";
		// var heat = heatmap(canvas.get(0));
		// heat.draw();

		// collection.find({},{}, function(e, docs){
			res.render('index', { title: 'tes' });
			// });
  		res.send(string);	
	};


};

exports.shots = function(db){
	return function(req, res){
		var collection = db.get('2013_shot_chart');
		var name = req.body.name
		collection.find({"p": name }, function(e, docs){

			res.contentType('json');
			res.json(docs);	
		});


	};
}

exports.helloworld = function(req, res){
  res.render('helloworld', { title: 'Hello, World!' });
}