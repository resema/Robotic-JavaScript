  
var keypress = require('keypress');
var five = require("johnny-five");

var EtherPortClient = require("etherport-client").EtherPortClient;
var board = new five.Board({
port: new EtherPortClient({
host: "192.168.0.143",
port: 3030
}),
timeout: 1e5,
repl: false
});

var fwSpeed = 1500;
var leSpeed = 1500;
var riSpeed = 1500;

board.on("ready", function() {
console.log("READY!");  

  var leftWheel= new five.Motor({
    pins: {
      pwm: 15,
      dir: 13
    }
  });


  var rightWheel = new five.Motor({
    pins: {
      pwm: 14,
      dir: 12
    }
  });

  
  var matrix = new five.Led.Matrix({
    addresses: [0x70],
    controller: "HT16K33",
    rotation: 3,
  });
  
  
  var accelerometer = new five.Accelerometer({
  controller: "LIS3DH",
  sensitivity: 1,
  });

  accelerometer.on("data", function() {
    console.log("accelerometer");
    console.log("-> x: ", this.x);
    console.log("-> z: ", this.z);
    console.log("-> y: ", this.y);
  });
  
  var heart = [
    "01100110",
    "10011001",
    "10000001",
    "10000001",
    "01000010",
    "00100100",
    "00011000",
    "00000000"
  ];
  
  matrix.clear();
  matrix.draw(heart);
  
  leftWheel.setPWM(15,0);
  leftWheel.setPin(13,0);

  rightWheel.setPWM(14,0);
  rightWheel.setPin(12,0);

  keypress(process.stdin);
  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.setRawMode(true);
  console.log("press a key");
  process.stdin.on('keypress', function (ch, key) {

  if ( !key ) { return; }

    if ( key.name === 'q' ) {

      console.log('Quitting');
      process.exit();

    } else if ( key.name === 'up' ) {
        
      fwSpeed += 250;
      if (fwSpeed > 2048) {
        fwSpeed = 2048;
      }
      
      console.log('Forward');
      leftWheel.setPWM(15, fwSpeed);
      leftWheel.setPin(13,0);

      rightWheel.setPWM(14, fwSpeed);
      rightWheel.setPin(12,0);

    } else if ( key.name === 'down' ) {

      fwSpeed = 1500;
      console.log('Backward');
      leftWheel.setPWM(15,0);
      leftWheel.setPin(13,1)

      rightWheel.setPWM(14,0);
      rightWheel.setPin(12,1);
      
    } else if ( key.name === 'left' ) {

      riSpeed = 1500;
      leSpeed += 250;
      if (leSpeed > 2048) {
        leSpeed = 2048;
      }

      console.log('Left');
      leftWheel.setPWM(15,1500);
      leftWheel.setPin(13,0)

      rightWheel.setPWM(14,leSpeed);
      rightWheel.setPin(12,0);
    
    } else if ( key.name === 'right' ) {

      leSpeed = 1500;
      riSpeed += 250;
      if (riSpeed > 2048) {
        riSpeed = 2048;
      }
    
      console.log('Right');
      leftWheel.setPWM(15,riSpeed);
      leftWheel.setPin(13,0)

      rightWheel.setPWM(14,1500);
      rightWheel.setPin(12,0);

   } else if ( key.name === 'space' ) {

      console.log('Stopping');
      leftWheel.setPin(13,0);
      leftWheel.setPWM(15,0);

      rightWheel.setPin(12,0);
      rightWheel.setPWM(14,0);      
    }

  });



});