$(window).ready(function () {
	var canvas = $('<canvas>').attr({
		width : 500,
		height : 500
	}).appendTo(document.body);



$('#submit').click(function(){

	$.ajax({
		url: "/shots",
		type: "POST",
		dataType: "json",
		data: {
			name: $('#inputPlayerName').val()
		},
        success: function(data) {
          showData(data);
        },
        error: function(e) {
            console.log("error");
        }
	});


});


function showData(data){
	var shots = "";
	for(var k in data){
		console.log(data[k]['d']);
		shots += data[k]['d'] + "<br>";
	}
	$('#container').html(shots);
}
// var heat = heatmap(canvas.get(0));
    
//     for (var i = 0; i < 5000; i++) {
//         var rho = Math.random() * 2 * Math.PI;
//         var z = Math.pow(Math.random(), 2) * 250;
        
//         var x = 250 + Math.cos(rho) * z;
//         var y = 250 + Math.sin(rho) * z;
        
//         heat.addPoint(x, y);
//     }
    
//     heat.draw();



});