/*
	Audio Visualiser
	-- William Goldsworthy
	-- 4.11.16
	-- Version 1.0
*/

var controls;

var AudioSource = function() {
  var self = this;
  var ctx = new AudioContext();
  var audio = document.getElementById('myAudio');

  audio.crossOrigin = "anonymous"

  var audioSrc = ctx.createMediaElementSource(audio);
  var analyser = ctx.createAnalyser();

  // lowAnalyser = ctx.createAnalyser();
  // we have to connect the MediaElementSource with the analyser 
  audioSrc.connect(analyser);
  audioSrc.connect(ctx.destination);
  // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
  
  self.bassAvgArray = [];
  self.bass = true;

  // frequencyBinCount tells you how many values you'll receive from the analyser
  self.frequencyData = new Uint8Array(analyser.frequencyBinCount);
  
  this.volume = 0;

  this.streamData = new Uint8Array(189);

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

  // self.lowPass = lowPassFilter();

  var sampleAudioStream = function() {
        analyser.getByteFrequencyData(self.streamData);
        // calculate an overall volume value

        getBass();

        var total = 0;
        for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
            total += self.streamData[i];
        }
        self.volume = total;
  };

  var getBass = function(){
    var data = self.streamData;
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

window.onload = function() {

  var audiosource = new AudioSource();

  //MountainRange(audiosource);
  // cubeRotation(audiosource);

  var visualiser = new Visualiser();

  visualiser.init({
    containerId: 'visualiser',
    audioSource: audiosource,
  });
};

var MountainRange = function(audio){

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff, 1 );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.OctahedronGeometry( 1, 0);
    var material = new THREE.MeshPhongMaterial( { color: 0xB8860B , shininess: 10} );
    var mountain = new THREE.Mesh( geometry, material );
    scene.add( mountain );

    var mountain2 = new THREE.Mesh( geometry, material );
    mountain2.position.x = 4;
    mountain2.position.y = 0;
    mountain2.scale = 0.5
    scene.add( mountain2 );

    var mountain3 = new THREE.Mesh( geometry, material );
    mountain3.position.x = -4;
    mountain3.position.y = 0;
    scene.add( mountain3 );

    camera.position.x = 5;
    camera.position.y = 5;
    camera.position.z = 10;

    //controls = new THREE.OrbitControls( camera );

    camera.lookAt(new THREE.Vector3(0,0,0));

    var planegeometry = new THREE.PlaneGeometry( 800, 800);
    var material = new THREE.MeshBasicMaterial( {color: 0xffffff, side: THREE.DoubleSide} );
    var plane = new THREE.Mesh( planegeometry, material );
    plane.rotation.z= Math.PI/2;
    plane.rotation.x = Math.PI/2;
    scene.add( plane );

    var light = new THREE.DirectionalLight( 0xffffff, 1);
    light.position.set(0,5,0);
    scene.add(light);

    var render = function () {
      requestAnimationFrame( render );
      volume = audio.volume/1000;
      var data = audio.streamData;

      var r = Date.now() * 0.0005;
      camera.position.x = 10 * Math.sin( 1 * r );
      camera.position.z = -10 * Math.cos( 1 * r);
      //camera.position.z = 15* Math.sin( 0.5 * r );
      // camera.far = mountain.position.length();
      // camera.updateProjectionMatrix();
      camera.lookAt(mountain.position);

      averageTotal = getBass(data);

      // cube.rotation.x += 0.01;
      // cube.rotation.y += 0.01;
      // cube.rotation.z -= 0.01;
      mountain.scale.x = volume * 0.2;
      mountain.scale.y = volume * 0.2;
      mountain.scale.z = volume * 0.2;

      mountain2.scale.x = 0.5 + averageTotal * 0.02;
      mountain2.scale.y = 0.5 + averageTotal * 0.02;
      mountain2.scale.z = 0.5 + averageTotal * 0.02;

      mountain3.scale.x = data[45] * 0.02;
      mountain3.scale.y = data[45] * 0.02;
      mountain3.scale.z = data[45] * 0.02;

      renderer.render(scene, camera);
    };

    var getBass = function(data) {
      i=0;
      total = 0
      for (i=0; i < 5; i++){
        total = total + data[i];
      }
      
      if(!this.totals){
        this.totals = [];
      }
      if (this.totals.length > 5){
        this.totals.splice(0,1);
      }
      total = total / 5;
      this.totals.push(total);

      i = 0
      averageTotal = 0
      for (i=0; i<5; i++){
        averageTotal = averageTotal + this.totals[i]
      }

      averageTotal = averageTotal/5;

      if (total > averageTotal) {
        return total;
      } else {
        return averageTotal;
      }
    }

    render();
};

var cubeRotation = function(audio){

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    var material = new THREE.MeshPhongMaterial( { color: 0xffffff , shininess: 30} );
    var cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    var light = new THREE.DirectionalLight( 0xffffff, 1);
    light.position.set(0, 1 ,0);
    light.target = cube;

    scene.add(light);
    scene.add(light.target);

    time = 0;

    var render = function () {
      requestAnimationFrame( render );
      volume = audio.volume/1000;

      r = Math.cos(time) * 255;
      g = Math.sin(time) * 255;
      b = 0;
      time += 0.005;

      if (r < 0) {
        r = r * (-1);
      }
      if (g < 0) {
        g = g * (-1);
      }

      material.color.setRGB(r , g, b);

      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.rotation.z -= 0.01;
      cube.scale.x = volume * 0.3;
      cube.scale.y = volume * 0.3;
      cube.scale.z = volume * 0.3;

      renderer.render(scene, camera);
    };

    render();
};

var Visualiser = function() {

  var audioSource;
  var fgCanvas;
  var fgCtx;
  var bgCanvas;
  var bgCtx;
  var sample;

  var constant = 0;

  var drawBg = function() {
        bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
        var r, g, b, a;
        var val = audioSource.volume/1000;
        
        // TURQUOISE BACKGROUND
        r = 20 + (Math.sin(val) + 1) * 28;
        g = val * 20;
        b = val * 15;

        // r = 0
        // g = 0
        // b = 0

        constant += 1;

        // r = Math.sin(val) * 255;
        // g = Math.cos(constant) * 255;
        // b = Math.tan(constant) * 255;

        //console.log(r);
        //console.log(g);
        
        //RED BACKGROUND
        // r = 240;
        // g = 0; 
        // b = 0;
        
        a = Math.sin(val+3*Math.PI/2) + 1;
        bgCtx.beginPath();
        bgCtx.rect(0, 0, bgCanvas.width, bgCanvas.height);
        // create radial gradient
        var grd = bgCtx.createRadialGradient(bgCanvas.width/2, bgCanvas.height/2, val, bgCanvas.width/2, bgCanvas.height/2, bgCanvas.width-Math.min(Math.pow(val, 2.7), bgCanvas.width - 20));
        
        grd.addColorStop(0, 'black');
        //grd.addColorStop(0, 'rgba(0,0,0,0)');// centre is transparent black
        //WHITE COLORSTOP
        grd.addColorStop(0.8, "rgba(" +
            Math.round(r) + ", " +
            Math.round(g) + ", " +
            Math.round(b) + ", 1)");

        bgCtx.fillStyle = grd;
        bgCtx.fill();
    };

    var drawFg = function() {
      fgCtx.clearRect(0,0,fgCanvas.width, fgCanvas.height);
      //drawRectangle();
      //drawLine();
      //circlePump(30);
      verticalDots();
      //frequencyDots();
      // frequencyLines();
      //eye();
      //trippyTurn();
      spiral();
      // face();
      // baseCheck();
    }

  /* Function to find where the bass is
     Takes the lowest five frequencies, and averages them to find the total for this tick
     Then takes five tick averages and if current is greater than average of last five, then it is base
  */
  var baseCheck = function() {
    var data = audioSource.streamData;
    i=0;
    total = 0
    for (i=0; i < 5; i++){
      total = total + data[i];
    }
    
    if(!this.totals){
      this.totals = [];
    }
    if (this.totals.length > 5){
      this.totals.splice(0,1);
    }


    total = total / 5;
    this.totals.push(total);

    i = 0
    averageTotal = 0
    for (i=0; i<5; i++){
      averageTotal = averageTotal + this.totals[i]
    }

    averageTotal = averageTotal/5;


    if (total > averageTotal) {
      var val = audioSource.volume/1000;
      r = 0
      g = 200
      b = 100
      fgCtx.beginPath();
      var gradient = fgCtx.createRadialGradient(20, fgCanvas.height/2, 20, 400, 80, 700);
      gradient.addColorStop(0, "rgba(" +
            Math.round(r) + ", " +
            Math.round(g) + ", " +
            Math.round(b) + ",  0)");

      gradient.addColorStop(1, "rgba(" +
            Math.round(b) + ", " +
            Math.round(r) + ", " +
            Math.round(g) + ", 1)");
      fgCtx.arc(fgCanvas.width/2, fgCanvas.height/2, 300, 0, 2*Math.PI);
      fgCtx.fillStyle = gradient;
      fgCtx.fill();
      fgCtx.stroke();
      fgCtx.fillText("BASE", 10,200);
      return true;
    }
  }

  var frequencyLines = function() {
    var size = audioSource.streamData.length;
    var data = Array.prototype.slice.call(audioSource.streamData);
    i=0;
    var dataArray = [];
    data.forEach( function(val){
      dataArray.push(val);
    });
    fgCtx.moveTo(300, 400-dataArray[0]);
    fgCtx.strokeStyle='blue';
    for (i=0; i < size; i++) {
      fgCtx.lineTo(300+(i*4), 400-dataArray[i]);
      fgCtx.stroke();
      i++;
    };
  };

  var frequencyDots = function() {
    //var val = audioSource.volume/1000;
    var size = audioSource.streamData.length;
    var data = Array.prototype.slice.call(audioSource.streamData);
    var third = size/3;
    i=0;
    data.forEach( function(val){
      if (i < third) {
        fgCtx.fillStyle='blue';
        fgCtx.fillRect( (500+(i*4)), (600 - val), 2, 2 );
      } else if (i < (third*2)) {
        fgCtx.fillStyle = 'red';
        fgCtx.fillRect( (500+(i*4) - (252)), (450 - val), 2, 2 );
      } else {
        fgCtx.fillStyle = 'green';
        fgCtx.fillRect( (500+(i*4)) - (504), (300 - (val)), 2, 2 );
      }
      i++;
    });
  };

  var verticalDots = function() {
    var val = audioSource.volume/100;

    var rand = Math.random()* 2;

    i = 0;
    for (i = 0; i < Math.round(val/12); i++ ) {
      fgCtx.beginPath();
      fgCtx.arc(20, 500 - (i*20), 3, 0, Math.PI*2);
      fgCtx.fillStyle='blue';
      fgCtx.fill();
    }
  }

  var circlePump = function(radius) {
    var radius = radius;
    var r,g,b,a;
    var size = 128;
    var val = audioSource.volume/1000;

    var r = 200;
    var g = val*30;
    var b = Math.sin(val) * 12;

    if (val > 1) {
      fgCtx.beginPath();
      var gradient = fgCtx.createRadialGradient(20, fgCanvas.height/2, 20, 400, 80, 700);
      gradient.addColorStop(0, "rgba(" +
            Math.round(r) + ", " +
            Math.round(g) + ", " +
            Math.round(b) + ",  0)");

      gradient.addColorStop(1, "rgba(" +
            Math.round(b) + ", " +
            Math.round(r) + ", " +
            Math.round(g) + ", 1)");
      fgCtx.arc(fgCanvas.width/2, fgCanvas.height/2, radius*val, 0, 2*Math.PI);
      fgCtx.fillStyle = gradient;
      fgCtx.fill();
      fgCtx.stroke();
    }
  }

  var drawRectangle = function() {
      var r, g, b, a;
      var data = audioSource.streamData;
      var val = audioSource.volume/1000;
      var rand = Math.random(10);
      var gradient = fgCtx.createLinearGradient(25,25,(rand*10),(30 + (rand*100) ));//(rand*20*val));
      gradient.addColorStop(0, 'rgba(100, 200, 0, 0)');
      gradient.addColorStop(1, 'blue');
      fgCtx.fillStyle=gradient;
      fgCtx.fillRect(300-(val*10), 300-(val*10), (val)*20, (val)*20);
  }

  var drawLine = function() {
    var size = audioSource.streamData.length;
    var data = Array.prototype.slice.call(audioSource.streamData);
    i=0;
    data.forEach( function(val){
      fgCtx.fillStyle='blue';
      fgCtx.fillRect( (400+(i*4)), (400 - val), 2, 2 );
      fgCtx.fillStyle = 'red';
      fgCtx.fillRect( (400+(i*4)), (500 - ((2*val) /3)), 2, 2 );
      i++;
    });
  }

  var rotation = 0;

  var eye = function() {
    var val = audioSource.volume/1000;
    var eyeImg = document.getElementById("eye");
    var tripEye = document.getElementById("tripEye");
    fgCtx.save();
    fgCtx.translate(fgCanvas.width/2, fgCanvas.height/2);
    if (val > 9) {
      fgCtx.rotate(val+ rotation * to_radians);
    } else {
      fgCtx.rotate(rotation * to_radians);
    }
    rotation +=7;
    fgCtx.drawImage(tripEye, -(280), -162, tripEye.width/8 , tripEye.height/8);
    fgCtx.restore();
    fgCtx.drawImage(eyeImg, fgCanvas.width/2 - 266, fgCanvas.height/2 - 164, eyeImg.width/9,eyeImg.height/9);
  }

  var trippyTurn = function() {
    var val = audioSource.volume/1000;
    var tripEye = document.getElementById('tripEye');
    fgCtx.save()
    fgCtx.translate(fgCanvas.width/2, fgCanvas.height/2);
    if (val > 10) {
      fgCtx.rotate(val + rotation * to_radians);
    } else {
      fgCtx.rotate(rotation * to_radians);
    }
    rotation +=3;
    fgCtx.drawImage(tripEye, -(540), -328, tripEye.width/4 , tripEye.height/4);
    fgCtx.restore();
  }

  var spiral = function() {
    var val = audioSource.volume/1000;
    var spiral = document.getElementById('spiral');
    fgCtx.save();
    fgCtx.translate(fgCanvas.width/2, fgCanvas.height/2);
    fgCtx.rotate(rotation * to_radians);
    rotation += -7
    fgCtx.drawImage(spiral, -(spiral.width),-(spiral.height), spiral.width*2, spiral.height*2);
    var imgData = fgCtx.getImageData(0,0,fgCanvas.width, fgCanvas.height);


    for (var i=0;i<imgData.data.length;i+=4)
    {
      imgData.data[i]= Math.cos(imgData.data[i]) * 25 * val/2;
      if (audioSource.bass) {
        imgData.data[i+1]= Math.sin(imgData.data[i+1] * val/2) * 255;
      } else {
        imgData.data[i+1] = imgData.data[i+1]
      }
      imgData.data[i+2]= Math.sin(imgData.data[i+1] * val/2) * 255;//255-imgData.data[i+2];
      imgData.data[i+3]= 255;
    };
    fgCtx.putImageData(imgData, 0,0);
    fgCtx.restore();
  }

  var face = function() {
    var val = audioSource.volume/1000;
    var spiral = document.getElementById('face');
    fgCtx.save();
    fgCtx.translate(fgCanvas.width/2, fgCanvas.height/2);
    fgCtx.drawImage(spiral, -(spiral.width),-(spiral.height), spiral.width*2, spiral.height*2);
    var imgData = fgCtx.getImageData(0,0,fgCanvas.width, fgCanvas.height);
    for (var i=0;i<imgData.data.length;i+=4)
    {
      imgData.data[i]= Math.cos(imgData.data[i]) * 25 * val/2;
      imgData.data[i+1]= Math.sin(imgData.data[i+1] * val) * 255;
      imgData.data[i+2]= imgData.data[i+2]//Math.sin(imgData.data[i+1] * val/2) * 255;//255-imgData.data[i+2];
      imgData.data[i+3]= 255;
    };
    fgCtx.putImageData(imgData, 0,0);
    fgCtx.restore();
  }

  var to_radians = Math.PI/180;

  this.resizeCanvas = function() {
        if (fgCanvas) {
            // resize the foreground canvas
            fgCanvas.width = window.innerWidth;
            fgCanvas.height = window.innerHeight;
            //fgCtx.translate(fgCanvas.width/2,fgCanvas.height/2);

            bgCanvas.width = window.innerWidth;
            bgCanvas.height = window.innerHeight;

            drawBg();
         }
    };

  var draw = function() {
    fgCtx.clearRect(-fgCanvas.width, -fgCanvas.height, fgCanvas.width*2, fgCanvas.height *2);

    requestAnimationFrame(draw);
  }

  this.init = function(options) {
    audioSource = options.audioSource;
    var container = document.getElementById(options.containerId);

    fgCanvas = document.createElement('canvas');
    fgCanvas.setAttribute('style', 'position: absolute; z-index: 10');
    fgCtx = fgCanvas.getContext("2d");
    container.appendChild(fgCanvas);

    bgCanvas = document.createElement('canvas');
    bgCtx = bgCanvas.getContext("2d");
    container.appendChild(bgCanvas);

    this.resizeCanvas();

    // setInterval(drawBg, 100);
    setInterval(drawFg, 20);
  };
}