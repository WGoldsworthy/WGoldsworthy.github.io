/*
	Audio Setup
	William Goldsworthy
	09.03.2017
*/

var currentSong = 21;
var playing = true;

document.addEventListener("DOMContentLoaded", function(){

	var audio = document.getElementById("myAudio");
	var source = document.getElementById("mp3source");
	source.src = "../audio/"+songNames[currentSong];
	audio.load();
	audio.play();

	$('.songName').text(stripMp3(songNames[currentSong]));
});

var stripMp3 = function(songname) {
	return songname.slice(0, songname.length - 4);
}

$('.selectLeft').click(function() {

	currentSong -= 1;

	if (currentSong < 0) {
		currentSong = songNames.length - 1;
	}

	var audio = document.getElementById("myAudio");
	var source = document.getElementById("mp3source");
	source.src = "../audio/"+songNames[currentSong];
	audio.load();
	audio.play();

	$('.songName').text(stripMp3(songNames[currentSong]));
});

$('.selectRight').click(function() {

	currentSong += 1;

	if (currentSong >= songNames.length) {
		currentSong = 0;
	}

	var audio = document.getElementById("myAudio");
	var source = document.getElementById("mp3source");
	source.src = "../audio/"+songNames[currentSong];
	audio.load();
	audio.play();

	$('.songName').text(stripMp3(songNames[currentSong]));
});

var audio = document.getElementById("myAudio");
var source = document.getElementById("mp3source");

$('.jumpForward').click(function() {
	audio.currentTime += 30;
});

$('.jumpBack').click(function() {
	if (audio.currentTime < 30) {
		audio.currentTime = 0;
	} else {
		audio.currentTime -= 30;
	}
});

$('.songName').hover(function(){
		if (playing) {
			$('.songName').text('Pause');
		} else {
			$('.songName').text("Play");
		}
	}, function() {
		$('.songName').text(stripMp3(songNames[currentSong]));
	}
);

$('.songName').click(function(){
	if (playing) {
		playing = false;
		audio.pause();
	} else {
		playing = true;
		audio.play();
	}
});
