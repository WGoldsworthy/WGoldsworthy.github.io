/*
	- Particle Experiment
	- William Goldsworthy
	- 5.3.2017
*/

  
var tau = Math.PI * 2;
var width, height;
var scene, camera, renderer, pointCloud, geometry;
var time;
var audio, audioSrc, analyser;
var audiosource;
var meteor;
var ambLight;


window.onload = function() {
	initialize();

	startParticles();
	startMeteor();

	render();
}

var startMeteor = function(){
	var meteorGeometry = new THREE.DodecahedronGeometry(50,0);
	var material = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		reflectivity: 100,
		wireframe: true,
		specular: 0xffffff,
		shininess: 100
	});

	meteor = new THREE.Mesh(meteorGeometry, material);
	scene.add(meteor);

	ambLight = new THREE.AmbientLight(0x990000, 0);
	scene.add(ambLight);
};

var startParticles = function(){

	time = 0;

	var material = new THREE.PointsMaterial({
		size: 5,
		vertexColors: THREE.VertexColors
	});

	geometry = new THREE.Geometry();
	var x, y, z;
	_.times(1500, function(n){
		x = (Math.random() * 800) - 400;
		y = (Math.random() * 800) - 400;
		z = (Math.random() * 800) - 400;


		geometry.vertices.push(new THREE.Vector3(x, y, z));
		geometry.colors.push(new THREE.Color(Math.random(), Math.random(), Math.random()));
	});

	var pointCloud = new THREE.Points(geometry, material);
	scene.add(pointCloud);
}

var render = function(){
	window.requestAnimationFrame(render);
	moveParticles();
	moveMeteor();
	renderer.render(scene, camera);
}

var moveParticles = function(){
	_.forEach(geometry.vertices, function(particle, index){
		var dX, dY, dZ;
		if (audiosource.bass){
			dZ = Math.sin(particle.z) * (audiosource.bassVolume/1000);
			dX = Math.sin(particle.x) * (audiosource.bassVolume/1000);
			dY = Math.sin(particle.y) * (audiosource.bassVolume/1000);
		} else {
			dZ = Math.random() * 2 -1;
			dX = Math.random() * 2 -1;
			dY = Math.random() * 2 -1;
		}

		particle.add( new THREE.Vector3(dX, dY, dZ) );

		if (particle.x > 800 || particle.x < -800) {
			particle.x = 0;
		}
		if (particle.y > 800 || particle.y < -800) {
			particle.y = 0;
		}
		if (particle.z > 800 || particle.z < -800) {
			particle.z = 0;
		}
		geometry.colors[index] = new THREE.Color(Math.random(), Math.random(), Math.random());
	});
	geometry.verticesNeedUpdate = true;
	geometry.colorsNeedUpdate = true;

	camera.position.x = Math.sin(time) * 150;
	camera.position.z = Math.cos(time) * ( -150);

	camera.lookAt(meteor.position);
	time += 0.005;
};

var moveMeteor = function(){
	meteor.rotation.x += 0.01;
	meteor.rotation.y += 0.01;
	meteor.rotation.z += 0.01;

	meteor.scale.x = audiosource.volume/8000;
	meteor.scale.y = audiosource.volume/8000;
	meteor.scale.z = audiosource.volume/8000;

	ambLight.intensity = audiosource.bassVolume/1000;
};

var initialize = function(){
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(120, 16 / 9, 1, 1000);
    renderer = new THREE.WebGLRenderer();

    audiosource = new AudioSource();
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
    onWindowResize();
}

var onWindowResize =   function(){
    width = window.innerWidth;
    height = window.innerHeight;
    updateRendererSize();
} 

var updateRendererSize = function (){
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

var AudioSource = function() {
  var self = this;
  var ctx = new AudioContext();
  audio = document.getElementById('myAudio');

  audio.crossOrigin = "anonymous"

  audioSrc = ctx.createMediaElementSource(audio);
  analyser = ctx.createAnalyser();
  lowAnalyser = ctx.createAnalyser();
  analyser.fftSize = 256;
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);

  self.bassAvgArray = [];
  self.bass = true;

  self.frequencyData = new Uint8Array(analyser.frequencyBinCount);
  
  this.volume = 0;

  this.streamData = new Uint8Array(189);

  // Creating a low-pass filter to help distinguish bass notes/Drum beats
  var lowPassFilter = function(){
	filter = ctx.createBiquadFilter();
	filter.type = "lowpass";
	audioSrc.connect(filter);
	// filter.frequency.value = 200;
	// var gain = ctx.createGain();
	// filter.connect(gain);
	// gain.connect(ctx.destination);
	// gain.gain.value = 3;
	
  	filter.connect(lowAnalyser);
  	filter.frequencyData = new Uint8Array(lowAnalyser.frequencyBinCount);
	filter.streamData = new Uint8Array(189);

	// To play the low Pass filter, Uncomment line below and disconnect audioSrc from destination
	// filter.connect(ctx.destination);

	return filter;
  };

  self.lowPass = lowPassFilter();


  var sampleAudioStream = function() {
    analyser.getByteFrequencyData(self.streamData);
    lowAnalyser.getByteFrequencyData(self.lowPass.streamData);

    getBass();
    // calculate an overall volume value
    var total = 0;
    var i = 0;
    while (i < 80) {
    	total += self.streamData[i];
    	i++;
    }

    self.volume = total;
  };

  var getBass = function(){
  	var data = self.lowPass.streamData;
  	var i = 0;
  	var total = 0;
  	while (i < 40) {
  		total += data[i];
  		i++;
  	}

  	self.bassVolume = total;

  	if (self.bassAvgArray.length > 50) {
  		self.bassAvgArray.splice(0,1);
  	}
  	self.bassAvgArray.push(total);
  	
  	i=0;

  	var bassAvg = 0;
  	while(i < self.bassAvgArray.length){
  		bassAvg = bassAvg + self.bassAvgArray[i];
  		i++;
  	}

  	bassAvg = bassAvg/50;

  	if (total > bassAvg){
  		self.bass = true;
  	} else {
  		self.bass = false;
  	};
  };


  var isPeak = function(data, threshold){
  	var peaksArray = [];
  	var length = data.length;
  	var i = 0;
  	while (i < length){
  		if (data[i] > threshold) {
  			peaksArray.push(i);
  			i += 10000;
  		}
  		i++;
  	}
  	return peaksArray;
  };

  var arrayMin = function(arr) {
	var len = arr.length,
	min = Infinity;
	while (len--) {
	if (arr[len] < min) {
	  min = arr[len];
	}
	}
	return min;
  }

  var arrayMax = function(arr) {
	var len = arr.length,
	max = -Infinity;
	while (len--) {
	if (arr[len] > max) {
	  max = arr[len];
	}
	}
	return max;
  }

  setInterval(sampleAudioStream, 20);
  audio.play();
}