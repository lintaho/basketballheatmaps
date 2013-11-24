
/*
 * GET home page.
 */

exports.index = function(db){

	return function(req, res){
		res.render('index', { title: 'NBA Heatmaps' });
	};
};

exports.players = function(db){
	return function(req, res){
		var collection = db.get('player_names');
		// console.log(req.body.startdate)
		var name = req.query.term
		var re = new RegExp(".*"+name+".*", "i")
		collection.find({"p":re}, ["p"], function(e, docs){
			res.json(docs.map(function(item){return item.p}));
			// console.log(e)
			res.render('index',  {title: "tETST"})
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
		
		var name = req.body.name

		var made = req.body.made  //true, show made shots
		var missed = req.body.missed //true show missed shots

		var show_shots = []
		if (made === "true" && missed ==="true"){
			show_shots.push("true");
			show_shots.push("false");
		}else if (made === "true" && missed === "false"){
			show_shots.push("true")
		}else if (made === "false" && missed === "true"){
			show_shots.push("false")
		}
		
		var qtrs = []
		var q = req.body.qtr
		for(var i = 1; i < q.length+1; i++){
			if(q[i-1] === 'true' )
				qtrs.push(i.toString());
		}
		date_map.find({"date": {$gte: new Date(req.body.startdate), $lt: new Date(req.body.enddate)}},
					["gameId"], 
					function(e, docs){
				collection.find({"p": name, "qtr": {$in: qtrs }, "made": {$in: show_shots},
				 "gameId": {$in: docs.map(function(game) {return game.gameId;})}},
					["p", "x", "y"],
				 function(e, docs){
				res.contentType('json');
				res.json(docs);	
			});

		});

	};
}