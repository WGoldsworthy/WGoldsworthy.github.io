<?php

	$files = [];
	foreach(glob('../audio/*.mp3') as $file){
		array_push($files, $file);
	}
	echo json_encode($files);
	
?>