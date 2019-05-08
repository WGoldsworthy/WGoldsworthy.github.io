var opacityFill = 0.3;
var samplingInterval = 12;
var c;
var canvas;
var sample;
var audiosource;
var numParticles;
var distanceRange;
var noise;
var velocity;
var colors;
var colorCycle = 1;
var backgroundColor = 'black';

var particle;

window.onload = function()
{
    // Initital Setup

    audiosource = new AudioSource();
    
    canvas = document.querySelector('canvas');
    
    c = canvas.getContext('2d');
    
    canvas.width = innerWidth;
    
    canvas.height = innerHeight;

    if (backgroundColor == 'white') {
        c.fillStyle = 'rgba(255, 255, 255, 1)';
    } else {
        c.fillStyle = 'rgba(0,0,0,1)';
    }
    c.fillRect(0,0,canvas.width, canvas.height);
    
    // Variables
    
    var mouse = 
    {
        x: innerWidth / 2,
        
        y: innerHeight / 2
    };

    
    samplingInterval = 12;
    var distanceOffset = 1.5;
    velocity = 0.01;
    var multiDirection = true;
    distanceRange = [1, 120];
    numParticles = 60;
    noise = 1;

    colors = [
        [
            '#ED3312',
            '#0E1428',
            '#7B9E89',
        ],
        [
            '#2660A4',
            '#F19953',
            '#56351E',
        ],
        [
            '#F75C03',
            '#04A777',
            '#D90368',
        ],
        [
            '#9C528B',
            '#1D1E2C',
            '#E534BC',
        ],
        [
            '#323031',
            '#FFC857',
            '#DB3A34'
        ],
        [
            '#4CA526',
            '#3C787E',
            '#FF7F11',
        ]
    ]
    
    
    addEventListener('resize', function()
    {
        canvas.width = innerWidth;
        
        canvas.height = innerHeight;
        
        particle(numParticles);
    });
    
    // Utility Functions
    
    function randomIntFromRange(min, max)
    {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    
    function randomColor(colors)
    {
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Objects
    
    function Particle(x, y, radius, color)
    {
        this.x = x;
        
        this.y = y;
        
        this.radius = radius;
        
        this.color = color;
        
        this.radians = Math.random() * Math.PI * 2;
        
        var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
        
        // this.velocity = 0.05;
        this.velocity = Math.random() * velocity * plusOrMinus;
        
        this.updateVelocity = function() {
            this.velocity = Math.random() * velocity * plusOrMinus;
        }

        this.initialDistance = randomIntFromRange(distanceRange[0], distanceRange[1]);
        
        this.lastMouse = {x: x, y: y};
        
        this.update = function(num)
        {
            const lastPoint = {x: this.x, y: this.y}; // Taking the last point before we re-draw.
            

            var dist = Array.prototype.slice.call(audiosource.streamData)[num];

            this.distanceFromCenter = this.initialDistance + (dist/noise);

            //Move points over time
            
            this.radians += this.velocity;
            
            // Drag Effect
            
            this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
            
            this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;
            
            // Circular Motion
            
            this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter;
            
            this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter;
            
            this.draw(lastPoint);
        };
        
        this.draw = function(lastPoint)
        {
            c.beginPath();

            let color = hexToRgbA(this.color);

            color = color.replace("1)", "" + opacityFill + ")");  
            
            c.strokeStyle = color;
            
            c.lineWidth = radius;
            
            c.moveTo(lastPoint.x, lastPoint.y);
            
            c.lineTo(this.x, this.y);
            
            c.stroke();
            
            c.closePath();
        };
    }
    
    // Implementation
    
    let particles;
    
    particle = function init(numParticles)
    {
        particles = [];
        
        for(let i = 0; i < numParticles; i++)
        {
            const radius = (Math.random() * 2) + 1;
            
            particles.push(new Particle(canvas.width / 2, canvas.height / 2, 1, randomColor(colors[colorCycle])));
        }
    }
    
    // Animation Loop
    
    function animate()
    {
        requestAnimationFrame(animate);
        
        var i = 0;
        particles.forEach(particle => 
        {
            particle.update(i);
            i++;
        });
    }
    
    // Object calls
    
    // Function calls
    
    particle(numParticles);
    
    animate();
};

var hexToRgbA = function(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

var AudioSource = function() {
    var self = this;
    var ctx = new AudioContext();
    var audio = document.getElementById('myAudio');

    audio.crossOrigin = "anonymous";

      var audioSrc = ctx.createMediaElementSource(audio);
      var analyser = ctx.createAnalyser();
      // we have to connect the MediaElementSource with the analyser 
      audioSrc.connect(analyser);
      audioSrc.connect(ctx.destination);
      // we could configure the analyser: e.g. analyser.fftSize (for further infos read the spec)
     
      // frequencyBinCount tells you how many values you'll receive from the analyser
      self.frequencyData = new Uint8Array(analyser.frequencyBinCount);

      this.volume = 0;

      this.streamData = new Uint8Array(100);

      this.sampleAudioStream = function() {
            analyser.getByteFrequencyData(self.streamData);
            // calculate an overall volume value
            var total = 0;
            for (var i = 0; i < 80; i++) { // get the volume from the first 80 bins, else it gets too loud with treble
                total += self.streamData[i];
            }
            self.volume = total;
      };
      sample = setInterval(this.sampleAudioStream, samplingInterval);
      // audio.play();
}

document.addEventListener("DOMContentLoaded", function() {
    
    document.getElementById('opacity_slider').oninput = function(){

        // c.clearRect(0, 0, canvas.width, canvas.height);
        opacityFill = this.value / 20
    }

     document.getElementById('sampling_slider').oninput = function(){

        samplingInterval = this.value
        clearInterval(sample);
        sample = setInterval(audiosource.sampleAudioStream, samplingInterval)
      }

      document.getElementById('particles_slider').oninput = function(){

        c.clearRect(0, 0, canvas.width, canvas.height);
        numParticles = this.value
        particle(numParticles);
      }

      document.getElementById('lowerDistance_slider').oninput = function(){

        c.clearRect(0, 0, canvas.width, canvas.height);
        distanceRange[0] = this.value
        particle(numParticles);
      }

      document.getElementById('higherDistance_slider').oninput = function(){

        c.clearRect(0, 0, canvas.width, canvas.height);
        distanceRange[1] = this.value
        particle(numParticles);
      }

      document.getElementById('noise_slider').oninput = function(){

        noise = this.value
      }

      document.getElementById('velocity_slider').oninput = function(){

        c.clearRect(0, 0, canvas.width, canvas.height);
        velocityNorm = this.value/400
        velocity = velocityNorm
        particle(numParticles);
      }

      document.getElementById('colors').addEventListener("click", function() {

        colorCycle += 1;

        // colorCycle = Math.floor(Math.random() * colors.length)

        if (colorCycle >= colors.length) {
            colorCycle = 0
        }

        particle(numParticles);
      });

      document.getElementById('background').addEventListener("click", function() {
        if (backgroundColor == 'black') {
            backgroundColor = 'white';
            c.fillStyle = 'rgba(255, 255, 255, 1)';
            c.fillRect(0,0,canvas.width, canvas.height);
            $('body').css('color', 'black');
        } else {
            backgroundColor = 'black';
            c.fillStyle = 'rgba(0, 0, 0, 1)';
            c.fillRect(0,0,canvas.width, canvas.height);
            $('body').css('color', 'white');
        }

      });

      document.getElementById('clear').addEventListener("click", function(){
        if(backgroundColor == 'white') {
            c.fillStyle = 'rgba(255, 255, 255, 1)';
            c.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            c.fillStyle = 'rgba(0,0,0,1)';
            c.fillRect(0, 0, canvas.width, canvas.height);
        }
      });


  });

