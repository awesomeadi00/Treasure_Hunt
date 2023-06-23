#include <Servo.h>. 

//PINS: 
const int Radar_ServoPin = 10;   

const int echoPin = 9;    
const int trigPin = 8;

const int w_switch = A3;
const int g_switch = A2;
const int y_switch = A1;

const int w_led = 4;
const int g_led = 5;
const int y_led = 6;    

const int pressurePin = A0;
const int pressureLED = 2;

//Global Variables: 
int w_switchVal;
int g_switchVal;
int y_switchVal;
int pressureVal;
unsigned long duration;
int distance;
int difficulty = 1;
int loseBool = 0;

//All game states below are exactly as shown in p5js
int gameState;
int menuState = 0;
int radarState = 1;
int winState = 2;
int loseState = 3;

//Servo object for controlling the servo motor
Servo RadarServo; 

//====================================================================================================================================
void setup() {
  //Begin the serial monitor to p5js at 9600 baud
  Serial.begin(9600);

  //Setting the pinmodes for the ultrasonic sensor
  pinMode(trigPin, OUTPUT);  
  pinMode(echoPin, INPUT);   
  
  //Seting the pinmodes for the arcade switch pins
  pinMode(w_switch, INPUT);
  pinMode(g_switch, INPUT);
  pinMode(y_switch, INPUT);
  
  //Setting the pinmodes for the LEDs in the arcade buttons
  pinMode(w_led, OUTPUT);
  pinMode(g_led, OUTPUT);
  pinMode(y_led, OUTPUT);

  //Output mode for the pressureLED, this will check whether the pressure sensor is active or not.
  pinMode(pressureLED, OUTPUT);

  //Attaching the servos to arduino 
  RadarServo.attach(Radar_ServoPin);  
  RadarServo.write(0);

  //Setup for the game, sets the easy difficulty on by default (difficulty = 1) and sets up the menu screen.
  digitalWrite(w_led, HIGH);
  gameState = 1;

  // Blinks the pressureLED in case the Serial Connection between p5js and Arduino has not been made (debugging)
  while (Serial.available() <= 0) {
    digitalWrite(pressureLED, HIGH);
    Serial.println("0,0"); 
    delay(300);     
    digitalWrite(pressureLED, LOW);
    delay(50);
  }
}

//====================================================================================================================================
void loop() {
  // This checks while the serial connection is available from p5js, then it will parse the gamestate from p5js to arduino. 
  while(Serial.available()) {
    int p5js_gameState = Serial.parseInt();
    if(Serial.read() == '\n') {
      gameState = p5js_gameState;
    }
  }

  //Based on the gamestate from p5js, it will map out exactly what to do on Arduino.
  if(gameState == menuState) {setDifficulty();}
  else if(gameState == radarState) {radarActivate();}
  Serial.println();
}

//====================================================================================================================================
//This functions is only called during the Main Menu. It checks which buttons are pressed to map the speed of the radar, hence setting the difficulty.
void setDifficulty() {
  //If the pressure is greater than 50, then it will switch on the pressureLED to indicate that the user still needs to find it. Else it will switch off indicating they won.
  pressureVal = analogRead(pressurePin);
  if(pressureVal > 200) {digitalWrite(pressureLED, HIGH); }
  else {digitalWrite(pressureLED, LOW); }

  //Reads all the values for all three buttons
  int y_sstate = digitalRead(y_switch);
  int g_sstate = digitalRead(g_switch);
  int w_sstate = digitalRead(w_switch);

  //If the yellow button is pressed, it will switch that on and set hard difficulty to 3
  if(y_sstate == HIGH) {
    digitalWrite(y_led, HIGH);
    digitalWrite(g_led, LOW);
    digitalWrite(w_led, LOW);
    difficulty = 3;
  }

  //If the green button is pressed, it will switch that on and set medium difficulty to 2
  else if(g_sstate == HIGH) {
    digitalWrite(y_led, LOW);
    digitalWrite(g_led, HIGH);
    digitalWrite(w_led, LOW);
    difficulty = 2;           
  }

  //If the white button is pressed, it will switch that on and set easy difficulty to 1
  else if(w_sstate == HIGH) {
    digitalWrite(y_led, LOW);
    digitalWrite(g_led, LOW);
    digitalWrite(w_led, HIGH);
    difficulty = 1;
  }
  Serial.println(difficulty);
}

//====================================================================================================================================
//This function will only be called if the game has started and thus the radar will become active. 
void radarActivate() {
  //Rotates the servo motor from 0 to 180 degrees
  for(int i = 0; i <= 180; i+=difficulty){ 
    pressureVal = analogRead(pressurePin);    //Reads the pressure value to determine if the user has won or not.
    if(pressureVal > 200) {digitalWrite(pressureLED, HIGH); }
    else {digitalWrite(pressureLED, LOW); }
    
    if(gameState == winState || gameState == loseState) {
      RadarServo.write(0); 
      break; 
    }

    RadarServo.write(i);                      
    delay(30);
    distance = calculateDistance();           //Calculates the distance measured by the ultrasonic sensor for each degree. 

    //Sending p5js the degree of rotation of the servo, the distance and the pressure value from the Arduino.
    Serial.print(i+difficulty);              //Sends the current degree to p5js
    Serial.print(",");                  //Sends comma character for indexing in p5js
    Serial.print(distance);             //Sends the distance value to p5js
    Serial.print(",");                  //Sends comma character for indexing in p5js
    Serial.println(pressureVal);          //Sends the pressure value to p5js
  }

  // Repeats the previous lines from 180 to 0 degrees (moving it backwards)
  for(int i = 180; i > 0; i-=difficulty){ 
    pressureVal = analogRead(pressurePin); 
    if(pressureVal > 200) {digitalWrite(pressureLED, HIGH); }
    else {digitalWrite(pressureLED, LOW); }

    if(gameState == winState || gameState == loseState) {
      RadarServo.write(0); 
      break; 
    }

    RadarServo.write(i);
    delay(30);
    distance = calculateDistance();

    Serial.print(i-difficulty);
    Serial.print(",");
    Serial.print(distance);
    Serial.print(",");
    Serial.println(pressureVal);
  }
  Serial.println();
}

//====================================================================================================================================
//Function for calculating the distance measured by the Ultrasonic sensor
//Issue with the sensor is that for objects extremely far away, it takes virtually 69ms to come back and translate to distance
//This is way too long hence, for each increment on the Radar Servo, it would take 69ms.
//Perhaps wrap some board 90cm away from the sensor around in 180˚ so it maps that out and nothing else that's far.
int calculateDistance(){ 
  //Sets the trigPin on LOW for 2 microseceonds.
  digitalWrite(trigPin, LOW); 
  delayMicroseconds(2);
  //Sends a signal from the triggering transducer for 10 microsends.
  digitalWrite(trigPin, HIGH); 
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);
  
  //Reads the echoPin and returns the sound wave travel time in microseconds. 
  duration = pulseIn(echoPin, HIGH); 

  //The distance will be calculated in cm, hence cm = (microseconds/2)/29
  distance = (duration/2)/29;
  return distance;
}