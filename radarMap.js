let itemPickup;
let winGate;
//==========================================================================================
//This function draws the layout of the radar. 
function drawRadar() {
  push();
  translate(width/2, 1000);    //Origin is now at the center of the radar 
  noFill();
  strokeWeight(5);
  stroke(98,245,31);
  
  //Draws the arc lines
  arc(0,0,1800,1800,PI,TWO_PI);
  arc(0,0,1400,1400,PI,TWO_PI);
  arc(0,0,1000,1000,PI,TWO_PI);
  arc(0,0,600,600,PI,TWO_PI);
  
  //Draws the angle lines using trigonometry (in rad)
  line(-960,0,960,0);                                            //Base Line
  line(0,0,-960*cos(radians(30)),-960*sin(radians(30)));         //30˚ Line
  line(0,0,-960*cos(radians(60)),-960*sin(radians(60)));         //60˚ Line
  line(0,0,-960*cos(radians(90)),-960*sin(radians(90)));         //90˚ Line
  line(0,0,-960*cos(radians(120)),-960*sin(radians(120)));       //120˚ Line
  line(0,0,-960*cos(radians(150)),-960*sin(radians(150)));       //150˚ Line
  pop();
}

//==========================================================================================
//This function draws the text (distance and angles) on the screen.
function drawText() {   
  noStroke();
  fill(0, 255);
  rect(0, 1010, width, 1080);
  fill(98,245,31);
  
  //Checks if the object is out of the range of the radar or not
  push();
  //If the distance is greater than 40cm, it is out of range, else it will be in range of the radar
  if(Ard_Distance > 35) {Range = "Out of Range"; }
  else {Range = "In Range"; }
  pop();
    
  //Printing out the distances in cm from the center
  textSize(30);
  text("10cm",1205,990);
  text("20cm",1405,990);
  text("30cm",1605,990);
  text("40cm",1805,990);
  
  push();
  //Printing out the Object, Angle and Distance
  textSize(35);
  text("Object: " + Range, 240, 1050);
  text("Angle: " + Ard_Angle +" °", 1200, 1050);
  text("Distance: " + Ard_Distance + " cm", 1600, 1050);
  pop();
  
  //Printing out the angles:  
  textSize(25);
  //30˚ Text
  push();
  translate(975+960*cos(radians(30)),998-960*sin(radians(30)));
  rotate(-radians(-60));
  text("30°",0,0);
  pop();
  
  //60˚ Text
  push();
  translate(973+960*cos(radians(60)),990-960*sin(radians(60)));
  rotate(-radians(-30));
  text("60°",0,0);
  pop();
  
  //90˚ Text
  push();
  translate(965+960*cos(radians(90)),990-960*sin(radians(90)));
  rotate(radians(0));
  text("90°",0,0);
  pop();
  
  //120˚ Text
  push();
  translate(952+960*cos(radians(120)),990-960*sin(radians(120)));
  rotate(radians(-30));
  text("120°",0,0);
  pop();
  
  //150˚ Text
  push();
  translate(950+960*cos(radians(150)),995-960*sin(radians(150)));
  rotate(radians(-60));
  text("150°",0,0);
  pop();
}

//==========================================================================================
//The following function draws the detection line which shifts back and forth to detect the user.
function drawLine() {
  strokeWeight(11);
  stroke(30,250,60);
  translate(960,1000);     //Moves to the center of the radar.
  
  if(Range == "In Range" && connectionState == 1) {
    if (frameCount % 60 == 0 && detectTimer > 0) {
      detectTimer--;
    }
        
    if (detectTimer == 0 ) {
      Main_Track.stop();
      Fail.play();
      gameState = Lose; 
    }
    stroke(255, 10, 10);
  }
  
  else {
    detectTimer = detectionTime;
  }
    
  //Draws the detection line according to the angle brought from Arduino which constantly changes.
  line(0,0,950*cos(radians(Ard_Angle)),-950*sin(radians(Ard_Angle))); 
}

//==========================================================================================
//This function guages the pressure and if the pressure is less than 200, then the object is found and you win
function detectPressure() {
  if(Ard_Pressure < 200 && connectionState == 1 && winGate == 1) {
    itemPickup = millis();
    winGate = 0; 
  }
  
  else if(Ard_Pressure > 200) {
    winGate = 1;
  }
  
  if(millis() - itemPickup < 1200 && millis() - itemPickup > 1000) {
    Main_Track.stop();
    Hooray.play(); 
    gameState = Win; 
  }
}