var basketballHeatmaps = angular.module('basketballHeatmaps', ['ui.bootstrap']);

basketballHeatmaps.directive("loading", function(){

	return {
		restrict: "E",
		template: "<img src='images/ajax-loader.gif' alt='loading'></image>"
	}
});

function mainController($scope, $http){
	
	var config = {
		element: document.getElementById("heat"),
		radius: 20,
		opacity: 70
	};
	$scope.heatmap = h337.create(config);

	//default checkboxes
	$scope.selection = ['Made', '1', '2', '3', '4'];

	$scope.queryShots = function($item, $model, $label){
		$scope.player = $item;

		$scope.loadingShots = true;
		$http.post('/shots', { name: $item })
			.success(function(data){
				$scope.shots = data;
				$scope.loadingShots = false;
				$scope.showData(data);
			})
			.error(function(data){
				console.log("Error!");
				$scope.loadingShots = false;
			});
	}

	$scope.updateShots = function(option){

		var idx = $scope.selection.indexOf(option);
	    if (idx > -1) {
		    $scope.selection.splice(idx, 1);
	    }else {
		    $scope.selection.push(option);
	    }
	    $scope.showData($scope.shots)
	}


	$scope.showData = function(data){
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
		console.log(made, qtr);
		for(var k in data){
			shot = data[k]
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
					// made: $("#madebox").prop('checked'),
					// missed: $("#missedbox").prop('checked'),
					// qtr: [$("#onebox").prop('checked'), $("#twobox").prop('checked'), $("#threebox").prop('checked'),
					// $("#fourbox").prop('checked'), $("#OTbox").prop('checked')],
					// startdate: $("#slider").dateRangeSlider("values").min.toISOString(),
					// enddate: $("#slider").dateRangeSlider("values").max.toISOString()
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

$(window).ready(function () {

	$("#slider").dateRangeSlider({

		arrows:false,
		bounds:{
			min: new Date(2012, 10, 30), 
			max: new Date(2013, 6, 20)
		},
		defaultValues:{
			min: new Date(2012, 10, 30),
			max: new Date(2013, 4, 17)
		}

	});

	var config = {
		element: document.getElementById("heat"),
		radius: 20,
		opacity: 70
	};

	var heatmap = h337.create(config);

	function ajaxReq(){
		$.ajax({
			url: "/shots",
			type: "POST",
			dataType: "json",
			data: {
				name: $('#inputPlayer').val(),
				made: $("#madebox").prop('checked'),
				missed: $("#missedbox").prop('checked'),
				qtr: [$("#onebox").prop('checked'), $("#twobox").prop('checked'), $("#threebox").prop('checked'),
					$("#fourbox").prop('checked'), $("#OTbox").prop('checked')],
				startdate: $("#slider").dateRangeSlider("values").min.toISOString(),
				enddate: $("#slider").dateRangeSlider("values").max.toISOString()
			},
		    success: function(data) {
		      showData(data);
		    },
		    error: function(e) {
		        console.log("error");
		    }
		});
	}

	function showData(data){
		coords = [];
		var shots = "";
		for(var k in data){
			coords.push({x:data[k]['x']*6, y:data[k]['y']*6, count:1})
			shots += data[k]['x'] + "<br>";
		}
		var heatpoints = {
			max: 3,
			data: coords		
		};	
		heatmap.store.setDataSet(heatpoints);
	}


	$("#slider").on("valuesChanged", function(e, res){
		ajaxReq();
	});

	// $('#madebox').change(function() {
	//     ajaxReq();
	// }); 

	// $('#missedbox').change(function() {
	//     ajaxReq();
	// }); 

	// $("#qtrs_boxes :checkbox").change(function(e){
	// 	ajaxReq();
	// });

	// $('#inputPlayer').autocomplete({
	// 	source: "/players",
	// 	minLength: 2,
	// 	select: function(event, ui){
	// 		$.ajax({
	// 			url: "/shots",
	// 			type: "POST",
	// 			dataType: "json",
	// 			data: {
	// 				name: ui['item']['value'],
	// 				made: $("#madebox").prop('checked'),
	// 				missed: $("#missedbox").prop('checked'),
	// 				qtr: [$("#onebox").prop('checked'), $("#twobox").prop('checked'), $("#threebox").prop('checked'),
	// 				$("#fourbox").prop('checked'), $("#OTbox").prop('checked')],
	// 				startdate: $("#slider").dateRangeSlider("values").min.toISOString(),
	// 				enddate: $("#slider").dateRangeSlider("values").max.toISOString()
	// 			},
	// 		    success: function(data) {
	// 		      showData(data);
	// 		    },
	// 		    error: function(e) {
	// 		        console.log(e);
	// 		    }
	// 		});
	// 	}, 
	// 	 messages: {
	//         noResults: '',
	//         results: function() {}
	//     }
	// });

});