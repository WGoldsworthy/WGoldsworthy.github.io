/*
	Audio Setup
	William Goldsworthy
	09.03.2017
*/

$(document).ready(function(){
	// $.ajax({
	// 	type: "GET",
	// 	url: "php/audioSetup.php",
	// 	success: function(data){
 //            data = JSON.parse(data);

	// 		data.forEach(function(song){
	// 			length = song.length;
	// 			name = song.substring(9, length);
	// 			$("#audioSelect").append("<option value="+name+">"+name+"</option>");
	// 		});
	// 	}
	// });

	var songNames = $.getJSON("audio/songNames.json", function(songName){
		console.log(songName);
		songName.forEach(function(name) {
			$("#audioSelect").append("<option value="+name+">"+name+"</option>");
		});
	});
});

$(".changeSong").click(function(){
	var song = $("#audioSelect").val();
	var audio = document.getElementById("myAudio");
	var source = document.getElementById("mp3source");
	source.src = "../audio/"+song;
	audio.load();
	audio.play();
});

$("#play").click(function(){
	var audio = document.getElementById("myAudio");
	if (audio.paused) {
		audio.play();
		$(".playbutton").attr("src", "css/pause-button.png");
	} else {
		audio.pause();
		$(".playbutton").attr("src", "css/play-button.png");
	}
});

$(".menuToggle").click(function(){
	if ($(".menuLeft").hasClass("menuIn") ) {
		$(".menuLeft").addClass("leftMenuOut");
		$(".menuLabel").addClass("noVis");
		$(".menu").addClass("menuControls");
		$(".menuLeft").removeClass("menuIn");
	} else {
		$(".menuLeft").removeClass("leftMenuOut");
		$(".menuLabel").removeClass("noVis");
		$(".menu").removeClass("menuControls");
		$(".menuLeft").addClass("menuIn").delay(2000);
	}
});

