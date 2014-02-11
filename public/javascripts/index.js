var basketballHeatmaps = angular.module('basketballHeatmaps', ['ui.bootstrap']);

basketballHeatmaps.directive("loading", function(){

	return {
		restrict: "E",
		template: "<img src='images/ajax-loader.gif' alt='loading'></image>"
	}
});

basketballHeatmaps.directive("slider", function(){

	return{
		restrict: "A",
		scope:{
			update: '&updateShots',
			dates: '&setDates'
		},
		link: function(scope, element, attrs){ 
			var	params = scope.$eval(attrs.slider);
			if(params.bounds != undefined){
				params.bounds.max = new Date(params.bounds.max);
				params.bounds.min = new Date(params.bounds.min);
			}
			if(params.defaultValues != undefined){
				params.defaultValues.max = new Date(params.defaultValues.max);
				params.defaultValues.min = new Date(params.defaultValues.min);
			}
			$(element).dateRangeSlider(params);
			scope.dates({ arg1: params.defaultValues });
			$(element).on('valuesChanging', function(e, res){
				scope.update({arg1: res.values});
			});
		}
	}

});

function mainController($scope, $http){
	
	var config = {
		element: document.getElementById("heat"),
		radius: 20,
		opacity: 70
	};
	$scope.heatmap = h337.create(config);
	$scope.dates = []; //min, max

	$scope.setDates = function(dates){
		$scope.dates.push(dates.min);
		$scope.dates.push(dates.max);
	}
	//default checkboxes
	$scope.selection = ['Made', '1', '2', '3', '4'];
	$scope.queryShots = function($item, $model, $label){
		$scope.player = $item;

		$scope.loadingShots = true;
		$http.post('/shots', { name: $item })
			.success(function(data){
				$scope.shots = data;
				$scope.loadingShots = false;
				$scope.showData(data, $scope.dates);
			})
			.error(function(data){
				console.log("Error!");
				$scope.loadingShots = false;
			});
	}

	$scope.updateShots = function(option){
		//Dates
		if(typeof(option) == 'object'){
			$scope.dates[0] = option.min;
			$scope.dates[1] = option.max;
		}
		//Checkboxes
		else{

			var idx = $scope.selection.indexOf(option);
		    if (idx > -1) {
			    $scope.selection.splice(idx, 1);
		    }else {
			    $scope.selection.push(option);
		    }
		}
	    $scope.showData($scope.shots, $scope.dates);
	}


	$scope.showData = function(data, dates){
		coords = [];
		made = [];
		qtr = [];
		for(var i in $scope.selection){
			var opt = $scope.selection[i]
			if(opt == "Made" || opt == "Missed"){
				made.push(opt);
			}else{
				if(opt == 'Overtime')
					qtr.push('5');
				else
				qtr.push(opt);	
			}
		}
		for(var k in data){
			shot = data[k]
			date = new Date(shot.date)
			if(date >= dates[0] && date <= dates[1]){
				if(qtr.indexOf(shot['qtr']) != -1){
					//correct quarter
					if(made.indexOf('Made') != -1 && made.indexOf('Missed') != -1){
						coords.push({x:shot['x']*6, y:shot['y']*6, count:1})
					}else if(made.indexOf('Made') != -1){
						if(shot['made'] == 'true')
							coords.push({x:shot['x']*6, y:shot['y']*6, count:1})
					}else if(made.indexOf('Missed') != -1){
						if(shot['made'] == 'false')
							coords.push({x:shot['x']*6, y:shot['y']*6, count:1})
					}
				}
			}

		}
		var heatpoints = {
			max: 3,
			data: coords		
		};	
		$scope.heatmap.store.setDataSet(heatpoints);
	}

	$scope.getPlayers = function(val){
		return $http.get('/players', {
			params: {
					name: val
			}
		}).then(function(res){
			var players = [];
			angular.forEach(res.data, function(player){
				players.push(player);
			});
			return players;
		});
	}

}