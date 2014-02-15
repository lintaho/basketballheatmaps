
/*
 * GET home page.
 */

exports.index = function(db){
	return function(req, res){
		res.render('index', { title: 'Basketball Heatmaps' });
	};
};

exports.about = function(req, res){
		res.render('about', {title: "About"})
};

// GET list of all players
exports.players = function(db){
	return function(req, res){
		var collection = db.get('player_names');
		var name = req.query.name
		var re = new RegExp(".*"+name+".*", "i")
		collection.find({"p":re}, ["p"], function(e, docs){
			res.json(docs.map(function(item){return item.p}));
		});
	};
}

// GET all shots for a player
exports.shots = function(db){
	return function(req, res){
		console.log(req);
		var collection = db.get('2013_shot_chart');
		
		//TODO: move this to upload/python script
		var date_map = db.get('gameId_dates_map')

		var name = req.params.name;
		console.log(name);
		collection.find({"p":name}, function(e, docs){
			// console.log(name, docs);
			date_map.find({"gameId": {$in: docs.map(function(game){ return game.gameId;} ) }}, ["gameId", "date"], function(e, dates){
				for(var d in docs){
					//for every shot
					//match the gameId to a date
					for(var e in dates){
						if(dates[e]['gameId'] == docs[d]['gameId'] ){
							docs[d]['date'] = dates[e]['date'];
							break;
						}
					}
				}
				res.contentType('json');
				res.json(docs);
			})
		});
	};
}

