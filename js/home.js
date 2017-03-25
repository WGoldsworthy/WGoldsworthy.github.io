/*
	- Particle Experiment
	- William Goldsworthy
	- 5.3.2017
*/


var tau = Math.PI * 2;
var width, height;
var scene, camera, renderer, geometryLow, geometryMid, geometryHigh;
var audio, audioSrc, analyser;
var audiosource;
var spotLight;
var time;
var box;
var boxes;
var atom, atomPivot, outerAtomGeometry;
var invisBox;

window.onload = function() {
	initialize();
	time = 0;
	startLinesLow(0xff0000);
	startLinesMid(0x00ff00);
	startLinesHigh(0x0000ff);

	render();
}

var initAtom = function(){
	// audio.pause(); // for sake of sanity

	// For creation to see what happening
	var ambientLight = new THREE.AmbientLight(0xffffff);
	scene.add(ambientLight);

	var mainAtomMat = new THREE.MeshPhongMaterial({
		color: 0xffffff,
		wireframe: true
	});

	var mainAtomGeometry = new THREE.DodecahedronGeometry(50,0);

	atom = new THREE.Mesh(mainAtomGeometry, mainAtomMat);
	atom.position.z = -250;
	atom.position.x = -250;
	atom.position.y = 150;
	scene.add(atom);

	var outerAtom1Mat = new THREE.MeshPhongMaterial({
		color: 0xff0000,
		wireframe: true
	});

	var outerAtom2Mat = new THREE.MeshPhongMaterial({
		color: 0x00ff00,
		wireframe: true
	});

	var outerAtom3Mat = new THREE.MeshPhongMaterial({
		color: 0x0000ff,
		wireframe: true
	});

	outerAtomGeometry = new THREE.DodecahedronGeometry(10,0);

	var outerAtom1 = new THREE.Mesh(outerAtomGeometry, outerAtom1Mat);
	outerAtom1.position.x = 0;
	outerAtom1.position.y = 60;
	outerAtom1.position.z = 0;

	var outerAtom2 = new THREE.Mesh(outerAtomGeometry, outerAtom2Mat);
	outerAtom2.position.x = 60;
	outerAtom2.position.y = 0;
	outerAtom2.position.z = 0;

	var outerAtom3 = new THREE.Mesh(outerAtomGeometry, outerAtom3Mat);
	outerAtom3.position.x = 0;
	outerAtom3.position.y = 0;
	outerAtom3.position.z = 60;

	atomPivot1 = new THREE.Object3D();
	atomPivot2 = new THREE.Object3D();
	atomPivot3 = new THREE.Object3D();
	atom.add(atomPivot1);
	atom.add(atomPivot2);
	atom.add(atomPivot3);
	atomPivot1.add(outerAtom1);
	atomPivot2.add(outerAtom2);
	atomPivot3.add(outerAtom3);

}

var moveAtom = function(){
	atom.rotation.x += 0.01;
	atom.rotation.y += 0.01;
	atom.rotation.z += 0.01;

	atomPivot1.rotation.x += -0.01;
	atomPivot1.rotation.y += -0.01;
	atomPivot1.rotation.z += -0.01;

	atomPivot2.rotation.x += 0.01;
	atomPivot2.rotation.y += -0.01;
	atomPivot2.rotation.z += 0.01;

	atomPivot3.rotation.x += -0.01;
	atomPivot3.rotation.y += 0.01;
	atomPivot3.rotation.z += -0.01;

	atom.position.x += 2.5 * Math.sin(time*2);
}

var initSpotLight = function(){

	spotLight = new THREE.SpotLight( 0xffffff ); //WHITE

	spotLight.position.z = -50;
	spotLight.position.y = 150;
	spotLight.target = box;
	scene.add(spotLight);
}

var initBoxes = function(){
	var boxMat = new THREE.MeshPhongMaterial({
		color: 0xff0000, //RED
		wireframe: true
	});

	var boxMat1 = new THREE.MeshPhongMaterial({
		color: 0x00ff00,
		wireframe: true
	});

	var boxMat2 = new THREE.MeshPhongMaterial({
		color: 0x0000ff,
		wireframe: true
	});

	var boxGeometry = new THREE.DodecahedronGeometry(50, 0);

	box = new THREE.Mesh(boxGeometry, boxMat);
	box.position.z = -250;
	box.position.y = 270;
	scene.add(box);


	box1 = new THREE.Mesh(boxGeometry, boxMat1);
	box1.position.z = -250;
	box1.position.y = 270;
	box1.position.x = -20;
	scene.add(box1);


	box2 = new THREE.Mesh(boxGeometry, boxMat2);
	box2.position.z = -250;
	box2.position.y = 270;
	box2.position.x = 20;
	scene.add(box2);

	boxes = [];
	boxes.push(box);
	boxes.push(box1);
	boxes.push(box2);
}

var startLinesLow = function(linecolor){

	var material = new THREE.LineBasicMaterial({
		color: linecolor,
		linewidth: 0.2,
		linejoin: "round"
	});

	geometryLow = new THREE.Geometry();
	var x, y, z;

	_.times(90, function(n){
		x = ((window.width/2)*(-1)) + (window.width/90)*n;
		z = 0;
		y = 1;

		geometryLow.vertices.push( new THREE.Vector3(x, y, z));
	});

	var line = new THREE.Line(geometryLow, material);
	line.position.z = -250;
	scene.add(line);
}

var startLinesMid = function(linecolor){

	var material = new THREE.LineBasicMaterial({
		color: linecolor,
		linewidth: 0.2,
		linejoin: "round"
	});

	geometryMid = new THREE.Geometry();
	var x, y, z;

	_.times(45, function(n){

		x = ((window.width/2)*(-1)) + (window.width/45)*n;
		z = 0;
		y = 1;

		geometryMid.vertices.push( new THREE.Vector3(x, y, z));
	});

	var line = new THREE.Line(geometryMid, material);
	line.position.z = -250;
	scene.add(line);
}

var startLinesHigh = function(linecolor){

	var material = new THREE.LineBasicMaterial({
		color: linecolor,
		linewidth: 0.2,
		linejoin: "round"
	});

	geometryHigh = new THREE.Geometry();
	var x, y, z;

	_.times(45, function(n){

		x = ((window.width/2)*(-1)) + (window.width/45)*n;
		z = 0;
		y = 1;

		geometryHigh.vertices.push( new THREE.Vector3(x, y, z));
	});

	var line = new THREE.Line(geometryHigh, material);
	line.position.z = -250;
	scene.add(line);
}

var render = function(){
	window.requestAnimationFrame(render);
	moveLinesLow();
	moveLinesMid();
	moveLinesHigh();
	moveLight();
	moveBox();
	moveAtom();
	renderer.render(scene, camera);
}

var moveLight = function(){
	spotLight.position.x = Math.sin(time) * 100;
	time += 0.005;
}

var moveBox = function(){

	_.forEach(boxes, function(box) {
		box.rotation.x += 0.01;
		box.rotation.y += 0.01;
		box.rotation.z += 0.01;
	});
}

var moveLinesLow = function(){
	var i = 0;
	_.forEach(geometryLow.vertices, function(particle, index){
		var dY;
		dY = 1 * (audiosource.lowPass.streamData[i]) - 250;
		particle.y = dY;
		i++;
	});
	geometryLow.verticesNeedUpdate = true;

};

var moveLinesMid = function(){
	var i = 0;
	_.forEach(geometryMid.vertices, function(particle, index){
		var dY;
		dY = 1 * (audiosource.streamData[i]) - 250;
		particle.y = dY;
		i++;
	});
	geometryMid.verticesNeedUpdate = true;

};

var moveLinesHigh = function(){
	var i = 41;
	_.forEach(geometryHigh.vertices, function(particle, index){
		var dY;
		dY = 1 * (audiosource.streamData[i]) - 250;
		particle.y = dY;
		i++;
	});
	geometryHigh.verticesNeedUpdate = true;

};

var initialize = function(){
    scene = new THREE.Scene();
    // camera = new THREE.PerspectiveCamera(120, window.width / window.height, 1, 1000);    
    renderer = new THREE.WebGLRenderer();

    camera = new THREE.OrthographicCamera(window.innerWidth/-2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 1000 )

    renderer.setClearColor(0x0d0d0d, 1);
    // renderer.setClearColor(0xffffff, 1); // For a whote background
    audiosource = new AudioSource();
    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize);
    onWindowResize();

	initBoxes();
    initSpotLight();
    initAtom();
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
  midAnalyser = ctx.createAnalyser();
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

  setInterval(sampleAudioStream, 20);
  audio.play();
}
