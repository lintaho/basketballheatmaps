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

$("#slider").on("valuesChanging", function(e, data){
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
});

var config = {
	element: document.getElementById("heat"),
	radius: 20,
	opacity: 70
};

var heatmap = h337.create(config);

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


$('#inputPlayer').autocomplete({
	source: "/players",
	minLength: 2,
	select: function(event, ui){


		$.ajax({
			url: "/shots",
			type: "POST",
			dataType: "json",
			data: {
				name: ui['item']['value'],
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
		        console.log(e);
		    }
		});


	}, 
	 messages: {
        noResults: '',
        results: function() {}
    }

});


$('#madebox').change(function() {
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
}); 

$('#missedbox').change(function() {
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
}); 


$("#qtrs_boxes :checkbox").change(function(e){

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

});




});