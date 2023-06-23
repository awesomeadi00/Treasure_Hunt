let gameStart;

//====================================SCREEN STATES=========================================
//This function creates a clickable button for user interactivity throughout the menu
function button(title, button_color, x, y, w, h, rounding) {
  if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h) {
    
    //Set the hovering over button color;
    //#39FF13 is the regular button color
    button_color = "#2BC20E";
    
    //Depending on which button the user presses, it will change that screen which will
    //update due to the draw() function. 
    if(mouseIsPressed) {      
      if(title == "Restart" || title == "") {
        Main_Track.stop();
        Main_Track.play();
        detectTimer = detectionTime;
        mainTimer = 20;
        gameState = Radar; 
      }
      
      else if(title == "Menu") {
        Main_Track.stop();
        Main_Track.play();
        gameState = Menu; 
      }      
    }
  }
  
  //Drawing the button:
  strokeWeight(1);
  stroke("#2BC20E")
  fill(button_color);
  rect(x, y, w, h, rounding);
  
  //Button text:
  textAlign(CENTER);
  fill(0);
  textSize(40);
  text(title, (x+(x+w))/2, ((y+(y+h))+30)/2);
}


//==========================================================================================
//This functions draws out the main menu screen onto the canvas. 
function menuScreen() {    
    imageMode(CORNER);
    image(Menu_BG, 0, 0);
    imageMode(CENTER);
    image(Game_Title, width/2, height/4);
    image(Read_Instructions, width/2, height/2+150);
    button("", "black", width/2-200, 3*height/4-50, 400, 100, 4);
    image(Start_Command, width/2, 3*height/4);
}

//==========================================================================================
//This function draws the radar which is essentially the game state
function radarActivate() {    
    button("Menu", "#39FF13", 1700, 50, 150, 50, 4);
    drawRadar();
    drawText();
    
    //Simulating motion blur and slow fade using alpha value
    fill(0, 8); 
    rect(0, 0, width, 1010);
    
    textSize(50);
    if(Range == "In Range") {
      fill("red");
      text("DETECTED!",165, 175);
    }
    
    fill("#39FF13");
    text("Main Timer:", 150, 100);
    if (frameCount % 60 == 0 && mainTimer > 0) {
      if(mainTimer == 10) {
        Time.play();
      }  
      mainTimer--;
      
      if (mainTimer == 0) {
        Main_Track.stop();
        Fail.play();
        gameState = Lose; 
      }
    }
    text(mainTimer, 320, 100);
    
    drawLine();
    detectPressure(); 
}

//==========================================================================================
//This function draws the winning screen on the canvas
function winScreen() {
    imageMode(CORNER);
    image(Menu_BG, 0, 0);
    imageMode(CENTER);
    image(Won, width/2, height/2);
    button("Menu", "#39FF13", width/6, 3*height/4, 400, 100, 4);
    button("Restart", "#39FF13", width/2 + 200, 3*height/4, 400, 100, 4);
}

//==========================================================================================
//This function draws the losing screen on the canvas
function loseScreen() {
    imageMode(CORNER);
    image(Menu_BG, 0, 0);
    imageMode(CENTER);
    image(Lost, width/2, height/2);
    button("Menu", "#39FF13", width/6, 3*height/4, 400, 100, 4);
    button("Restart", "#39FF13", width/2 + 200, 3*height/4, 400, 100, 4);
}