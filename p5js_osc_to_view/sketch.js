let canvas;
let canvasWidth = 1000;
let canvasHeight = 500;

var x,y,z;

function setup() {
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.position(windowWidth/2 - canvasWidth/2, 20);
  setupOsc(12000,3334);
  background(0);
  textSize(40);
}

function draw() {
	if(z<= 50){
		fill(255);
		rect(0,0,200,50);
		fill(0);
		text("Stop", 10, 40);
	}else{
		fill(255);
		rect(0,0,200,40);
		fill(0);
		text("running",10,40);

		noStroke();
		fill(map(z,50,500,0,255), 255, map(z,50,300,0,255));
		ellipse(x, y, 15, 15);

	}
	//fill(0);
	//text("I'm p5.js", x-25, y);

}

function receiveOsc(address, value) {
	console.log("received OSC: " + address + ", " + value);

	if (address == '/test') {
		x = value[0];
		y = 500 - (value[1]*5);
		z = value[2];
	}
}


function sendOsc(address, value) {
	socket.emit('message', [address].concat(value));
}

function setupOsc(oscPortIn, oscPortOut) {
	var socket = io.connect('http://127.0.0.1:8081', { port: 8081, rememberTransport: false });
	socket.on('connect', function() {
		socket.emit('config', {
			server: { port: oscPortIn,  host: '127.0.0.1'},
			client: { port: oscPortOut, host: '127.0.0.1'}
		});
	});
	socket.on('message', function(msg) {
		if (msg[0] == '#bundle') {
			for (var i=2; i<msg.length; i++) {
				receiveOsc(msg[i][0], msg[i].splice(1));
			}
		} else {
			receiveOsc(msg[0], msg.splice(1));
		}
	});
}


