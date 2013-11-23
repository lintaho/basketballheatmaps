
/*
 * GET home page.
 */

exports.index = function(db, heatmap){

	return function(req, res){
	 	var	string = "test";

		res.render('index', { title: 'NBA Heatmaps' });
  		res.send(string);	
	};
};

exports.players = function(db){
	return function(req, res){
		var collection = db.get('player_names');
		// console.log(req.body.startdate)
		var name = req.query.term
		console.log(name)
		var re = new RegExp(".*"+name+".*", "i")
		collection.find({"p":re}, ["p"], function(e, docs){
			console.log(docs);
			res.json(docs.map(function(item){return item.p}));
			// console.log(e)
		});
		// date_map.find({"date": {$gte: new Date(req.body.startdate), $lt: new Date(req.body.enddate)}},
		// 			{"gameId":1}, 
		// 			function(e, docs){
		// 		collection.find({"p": name, "gameId": {$in: docs.map(function(game) {return game.gameId;})}}, function(e, docs){
		// 		res.contentType('json');	
		// 		res.json(docs);	
		// 	});

		// });

	};
}


exports.shots = function(db){
	return function(req, res){
		var collection = db.get('2013_shot_chart');
		var date_map = db.get('gameId_dates_map')
		// console.log(req.body.startdate)
		var name = req.body.name
		date_map.find({"date": {$gte: new Date(req.body.startdate), $lt: new Date(req.body.enddate)}},
					{"gameId":1}, 
					function(e, docs){
				collection.find({"p": name, "gameId": {$in: docs.map(function(game) {return game.gameId;})}}, function(e, docs){
				res.contentType('json');
				res.json(docs);	
			});

		});

	};
}