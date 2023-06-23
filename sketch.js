//Global Variables:
let VolSlider;
let Range;
let Ard_Angle, Ard_Distance, Ard_Pressure, Ard_Difficulty;
let mainTimer = 20;
let detectionTime = 1.00;
let detectTimer = 1.00;
let connectionState = 0;
let fromArduino;

//Game states:
let gameState;
let Menu = 0;
let Radar = 1;
let Win = 2;
let Lose = 3;

//==========================================================================================
function preload() {
  soundFormats("mp3");
  Main_Track = loadSound("Music/Main_Music.mp3");
  Hooray = loadSound("Music/Hooray.mp3");
  Fail = loadSound("Music/Fail.mp3");
  Time = loadSound("Music/Time.mp3");
  
  
  //Loading the Images:
  Game_Title = loadImage("Images/Game_Title.png");
  Menu_BG = loadImage("Images/Menu_BG.png");
  Start_Command = loadImage("Images/Start_Command.png");
  Read_Instructions = loadImage("Images/Read_Instructions.png");
  Won = loadImage("Images/Won.png");
  Lost = loadImage("Images/Lost.png");
}

//==========================================================================================
function setup() {
  //gameState is 0 in the setup which would be the menu screen.
  gameState = 0;
  createCanvas(1920, 1080);
  Menu_BG.resize(1920, 1080);
  
  //Volume Settings
  Main_Track.setVolume(0.3);
  Hooray.setVolume(1.0);
  Time.setVolume(1.0);
  Fail.setVolume(1.0);
  Main_Track.play();   
  Main_Track.loop();
}

//==========================================================================================
function draw() {
  // console.log(Ard_Distance);
  if (gameState == Menu) {menuScreen(); } 
  else if (gameState == Radar) {radarActivate(); } 
  else if (gameState == Win) {winScreen(); } 
  else if (gameState == Lose) {loseScreen(); }
}

//==========================================================================================
//Sets up the serial connection
function keyPressed() {
  //Press ENTER to start the Serial connection between p5js and Arduino
  if (keyCode === ENTER) {
    setUpSerial();
    connectionState = 1; //Sets the bool flag that the connection has been made.
  }
}

//==========================================================================================
// Function to read in serial data from Arduino
function readSerial(data) {
  if (data != null) {
    fromArduino = split(trim(data), ",");
    if (fromArduino.length == 3) {
      Ard_Angle = int(fromArduino[0]);
      Ard_Distance = int(fromArduino[1]);
      Ard_Pressure = int(fromArduino[2]);
    }

    if (fromArduino.length == 1) {
      Ard_Difficulty = int(fromArduino[0]);
    }

    let sendToArduino = gameState + "\n";
    writeSerial(sendToArduino);
  }
}
