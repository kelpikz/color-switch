var canvas = document.getElementById("canvas");
canvas.style.background = "rgba(45, 41, 45, 0.7)";
var context = canvas.getContext("2d");
var ctx = canvas.getContext("2d");
var difficulty = 0;  // increases every time an obstrucle is re initialized
document.body.style.backgroundImage = 'url("f4oxj8q9q5v41.jpg")';
document.body.style.backgroundSize = 'cover';
var point = new Audio("star.mp3");
var rad = Math.PI / 180;
var colors = ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'];
var obs = [];
var lag =0;
var collisonDetectionBottom = 0, collisonDetectionTop = 0;
var smallBalls =[];
var score = 0;
var resume = true;
var dead = false;
var clickX = 0, clickY =0;
if(localStorage.getItem('twoplayers') == null){
  localStorage.setItem("twoplayers", '1');
}


var colorball = false;
var colorBallTimer = 0;
var colorBallTimerReset;

var speedball = false;
var speedBallTimer = 0;
var speedballReset = 0;
var speedBallTimerReset;

var click = 0;
//TOKENS
reviveToken = 0;
ballColorToken = 0;
ballSpeedToken = 0;

function newObstrucle( ) {
  var obstrucleSelector =  {
    obs1 : circle,              //
    obs2 : rotatingLines,       //
    obs3 : square,              //
    obs4 : rotatingCircles,     //
    obs5 : diamond,             //
    obs6 : threeCircles,        //
    obs7 : twoCircles,          //
    obs8 : triangles            //
  }
  var x;
  var obstrucleValueTag = ['obs1', 'obs2', 'obs3', 'obs4', 'obs5', 'obs6', 'obs7', 'obs8'];
  var obstrucleTag = Math.floor(Math.random() * 8);   //generates a number from 0 to 7
  x = Object.assign( {} , obstrucleSelector[obstrucleValueTag[obstrucleTag]] );
  // if(x.colorDependant) {x.color = '#13d2fc';}
  return x;
}

function hit() {
  if(ball.color == '#13d2fc') {
    ball.colorCode = 210;
  }
  if(ball.color == '#ffb100') {
    ball.colorCode = 177;
  }
  if(ball.color == '#9254f4') {
    ball.colorCode = 84;
  }
  if(ball.color == '#ff3c85') {
    ball.colorCode = 60;
  }
}

function initialObstrucles() {
  for(var i =0; i< 4; i++)  {
    obs[i] = newObstrucle();
    obs[i].yPosition -= ((i-1) * 500);
    if(obs[i].colorDependant){
      // console.log(obs[i]);
      obs[i].colorCreator();
    }
  };  
  console.log(ball.color + "        " + "ball");
}

function obstrucleReinitializer() {
  
  for(var i =0; i < 4; i++) {
    if(obs[i].yPosition >= 1600) {
      difficulty += 0.1;
      obs[i] = newObstrucle();
      // console.log("%c obs " + (i + 1) + " has been reset", 'background: red; color: white');
      if(obs[i].colorDependant){
        obs[i].colorCreator();
      }
    }
  }
};

function star(xPosition, yPosition, x) {  
  if(x) {
    if(ball.y - yPosition < 10 ){
      point.play();
      var y = localStorage.getItem('star_count');
      y = Number(y);
      if( y == 'null') {
      localStorage.setItem('star_count', 1);
      }
      else {
        localStorage.setItem('star_count', (y+1).toString());
      }
    return false;
    }
    context.beginPath();
    context.moveTo(xPosition + 9 * Math.cos( rad * 18), yPosition + 9 * Math.sin(rad * 18));
    for( var i = 54; i <  360; i += 72)  {
    context.lineTo(xPosition + 15 * Math.cos( rad * i), yPosition + 15 * Math.sin(rad * i));
    context.lineTo(xPosition + 8.25 * Math.cos( rad * (i + 36)), yPosition + 8.25 * Math.sin(rad * (i + 36)));
    }
    context.fillStyle='rgb(244, 244, 244)';
    context.fill();
    return true;   
  }
};

function colorBox(xPosition, yPosition, rotator) {    //creates rotating color changing wheel
  for(var i =0; i<360; i += 90, rotator += 0.35) {
      context.beginPath();
      context.moveTo(xPosition, yPosition);
      context.arc(xPosition, yPosition, 15, rad * (i+ rotator), rad * (i + 90 + rotator));
      context.closePath();
      context.fillStyle = colors[i / 90];
      context.fill();  
  }
  return rotator;
};

function colorChange(obstrucle) {                     //change colour when you meet color wheel
  if(ball.y - (obstrucle.yPosition + 250) < 38 && obstrucle.wheel == true)   {
      if(obstrucle.colorDependant) {
          ball.color = obstrucle.color;
          return false;
      }   else    {
          ball.color = newColor();
          return false;
      } 
  }
  return true;
};

function ballBurst() {
  var x = ball.x;
  var y = ball.y;
  for(var i=0; i< 12; i ++){
    smallBalls[i] = Object.assign({ }, littleBall );
    smallBalls[i].color = newColor();
    if(i<2) {
      smallBalls[i].x =  Math.floor(Math.random() * 20) + (x+20);
      smallBalls[i].vx = 5.5 + (smallBalls[i].x / 50);
      smallBalls[i].y =  Math.floor(Math.random() * 20) + (y-20);
      smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
    }
    else if(i<4) {
      smallBalls[i].x =  Math.floor(Math.random() * 20) + (x+20);
      smallBalls[i].vx = 5.5 + (smallBalls[i].x / 50);
      smallBalls[i].y =  Math.floor(Math.random() * 20) + (y);
      smallBalls[i].vy = - (smallBalls[i].y / 50);
    }
    else if(i<6) {
      smallBalls[i].x =  Math.floor(Math.random() * 20) + (x+20);
      smallBalls[i].vx = 5.5 + (smallBalls[i].x / 50);
      smallBalls[i].y =  Math.floor(Math.random() * 20) + (y+20);
      smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
    }
    else if(i<8) {
      smallBalls[i].x =  Math.floor(Math.random() * 20) + (x-20);
      smallBalls[i].vx = -5.5 - (smallBalls[i].x / 50);
      smallBalls[i].y =  Math.floor(Math.random() * 20) + (y+20);
      smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
    }
    else if(i<10) {
      smallBalls[i].x =  Math.floor(Math.random() * 20) + (x-20);
      smallBalls[i].vx = -5.5 - (smallBalls[i].x / 50);
      smallBalls[i].y =  Math.floor(Math.random() * 20) + (y);
      smallBalls[i].vy = (smallBalls[i].y / 50);
    }
    else if(i<12) {
      smallBalls[i].x =  Math.floor(Math.random() * 20) + (x-20);
      smallBalls[i].vx = -5.5 - (smallBalls[i].x / 50);
      smallBalls[i].y =  Math.floor(Math.random() * 20) + (y-20);
      smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
    }
  }
  ball.burst = true;
  // smallBallMovement();
}

function smallBallMovement() {
  for(var i =0; i<12; i++){
    smallBalls[i].movement();
    if(smallBalls[i].x > 400){
      smallBalls[i].vx = -smallBalls[i].vx;
    }
    if(smallBalls[i].x < 0){
      smallBalls[i].vx = -smallBalls[i].vx;
    }
    smallBalls[i].y += smallBalls[i].vy;
    smallBalls[i].vy += 0.35;
    smallBalls[i].x += smallBalls[i].vx;
  }
  var k = 0;
  for(i=0;i<12;i++){
    if(smallBalls[i].y < 700) {
      k =1;
    }
  }
  if(k == 0) {
    debugger;
    dead = true;
    //bring  end game bar
  }
}

function ballDraw() {  
  context.clearRect(0, 0, canvas.width, canvas.height);
  if(ball.burst == false) {
    collisionTest();
    if (ball.y <= 400 || ball.vy < 0) {
      ball.vy += ball.ay;
      ball.y += ball.vy;
    } else {
      ball.y = 400;
      ball.vy = 0;
    }

    //SCREEN AND BALL MOVEMENT_____________________
    if(ball.y < 300) {
        lag = 300-ball.y;
    }  
    if( lag > 1.25) {
      for(var i = 0; i < 4; i ++) {
        obs[i].yPosition += (1.25 + Math.pow((lag * 0.04),1.2));
      }
      ball.y += (1.25 + Math.pow((lag * 0.04),1.2));
      score += (1.25 + Math.pow((lag * 0.04),1.2));
      lag -= (1.25 + Math.pow((lag * 0.04),1.2));
    }
    else {
      for(var i =0; i < 4; i ++) {
        obs[i].yPosition += lag;
      }
      ball.y += lag;
      score += lag;
      lag = 0;
    }
    obstrucleReinitializer();
}
else{
  smallBallMovement();
}
}

function newColor () {
  var y = Math.floor(Math.random() * 4  + 0);
  var x = colors[y];
  return x;

}

function collisionTest() {
  if(collisonDetectionTop != 0 && collisonDetectionTop < 239) {
    if(collisonDetectionTop > (ball.colorCode+10) || collisonDetectionTop < (ball.colorCode-10)){
      console.log("%c               " , 'background : red;');
      console.log(collisonDetectionTop);
      if(!colorball) {
        ballBurst();
      }
    }
    else {
      console.log("%c               " , 'background : green;');
      console.log(collisonDetectionTop);
    }      
  }}

var ball = {
  x: 200,
  y: 500,
  vy: 0,
  ay: 0.4,
  radius: 10,
  burst: false,
  color : newColor(),
  colorCode : 0,
  rotator : 0,
  movement: function () {
      if(this.burst == false) {
      if(!colorball) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, rad * 360, true);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
        hit();
      }
      else {
        for(var i =0; i<360; i += 90, this.rotator += 0.85) {
          context.beginPath();
          context.moveTo(this.x, this.y);
          context.arc(this.x, this.y, this.radius, rad * (i+ this.rotator), rad * (i + 90 + this.rotator));
          context.closePath();
          context.fillStyle = colors[i / 90];
          context.fill();  
      }
      }
    }
  },

};

var littleBall  = {
  x : 200,
  y : 300,
  r : 4,
  vx : 0,
  vy : 0,
  color : 'black',
  movement: function () {
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, rad * 360, true);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();
},
};


var circle = {                        
    name : "circle",
    xPosition : 200,
    yPosition : -400,
    i : 0,
    rotator : 0,
    colorDependant : false,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colourChanger : colorBox,
    movement : function () {
        context.lineWidth = 20;
        context.lineCap='square';
        context.beginPath();
        context.strokeStyle = "#13d2fc";  //light blue  82, 222, 213
        context.arc(this.xPosition, this.yPosition, 90, rad * this.i, rad * (this.i + 90));
        context.stroke();
      
        context.beginPath();
        context.strokeStyle = "#ffb100";  //orange  255, 145, 0
        context.arc(this.xPosition, this.yPosition, 90, rad * (this.i + 90), rad * (this.i + 180));
        context.stroke();
      
        context.beginPath();
        context.strokeStyle = "#9254f4";  //purple  148, 81, 214
        context.arc(this.xPosition, this.yPosition, 90, rad * (this.i + 180), rad * (this.i + 270));
        context.stroke();
      
        context.beginPath();
        context.strokeStyle = "#ff3c85"; //pink  255, 0, 191
        context.arc(this.xPosition, this.yPosition, 90, rad * (this.i + 270), rad * (this.i + 360));
        context.stroke();
        this.i += 1.5 + difficulty;

        if(this.i >359) { this.i =0 };

        this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
        if(this.wheel) {
          this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
        }
        if(this.wheel) {
          this.wheel = colorChange(this);
        }
        // collisonDetectionBottom = context.getImageData(xPosition, yPosition+95, 1, 1).data[1];
        // collisonDetectionTop = context.getImageData(xPosition, yPosition-95, 1, 1).data[1];
     
    },  
};

var square = {
                          
  name : "square",  
  xPosition : 200,                                       
  yPosition : -400,
  i : 0,
  rotator : 0,
  colorDependant : false,
  wheel : true,
  starHit : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  movement : function () {
  
  context.lineWidth = 20;
  context.lineCap = "round";
  for(var j =0; j< 360; j += 90, this.i += (0.45 + (difficulty / 4)))  {
      context.strokeStyle = colors[j /90];
      context.beginPath();
      context.moveTo(
        this.xPosition + 100 * Math.cos(rad * (this.i + j)),
        this.yPosition + 100 * Math.sin(rad * (this.i + j))
      );
      context.lineTo(
        this.xPosition + 100 * Math.cos(rad * (this.i + 90 + j)),
        this.yPosition + 100 * Math.sin(rad * (this.i + 90 + j))
      );
      context.stroke();    
      
      if(this.i >359) { this.i =0};
  }

  this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
  if(this.wheel) {
    this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
  }
  if(this.wheel) {
    this.wheel = colorChange(this);
  }
  }    
};

var rotatingLines = {
                        
  name : "rotatingLines",
  xPosition : 200,
  yPosition : -400,
  i : 0,
  rotator : 0,
  colorDependant : false,
  wheel : true,
  starHit : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  movement : function () {
      
      context.lineWidth = 20;
      context.lineCap = "round";
      for(var j =0; j < 360; j += 90) {
          context.strokeStyle = colors[ j/ 90]; 
    
          context.beginPath();
          context.moveTo(this.xPosition + 50, this.yPosition);
          context.lineTo(
            this.xPosition + 50 + 90 * Math.cos(rad * (this.i + j)),
            this.yPosition + 90 * Math.sin(rad * (this.i + j))
          );
          context.stroke();
      }
      for(var j =0; j < 360; j += 90) {
          context.beginPath();
          context.moveTo(this.xPosition + 50, this.yPosition);
          context.arc(
            this.xPosition + 50,
            this.yPosition,
            14,
            rad * (this.i - 45 + j),
            rad * (this.i + 45 + j)
          );
          context.closePath();
          context.fillStyle= colors[ j / 90];
          context.fill();
      }
      this.i += 1.75 + difficulty;
      
      if(this.i >359) { this.i =0};

      this.starHit = this.obstrucleStar(this.xPosition,this.yPosition - 120,this.starHit);
      if(this.wheel) {
        this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      if(this.wheel) {
        this.wheel = colorChange(this);
      }
  }
};

var rotatingCircles = {
                          
  name : "rotatingcircles",
  xPosition : 200,
  yPosition : -400,
  i : 0,
  rotator : 0,
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  j : 0,
  colorDependant : false,
  wheel : true,
  starHit : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  movement : function () {
    context.fillStyle='red';
    // debugger;
    for(this.j=0; this.j < 24 ; this.i += (15.05 +(difficulty /20) ), this.j ++) {
        context.beginPath();
        context.arc(
        this.xPosition + 90 * Math.cos(rad * this.i),
        this.yPosition + 90 * Math.sin(rad * this.i) ,
        10,
        0, Math.PI * 2);
        context.fillStyle=this.colors[Math.floor(this.j/6)];        
        context.fill();
      }
      if(this.i >359) { this.i -= 360};
      this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
      if(this.wheel) {
        this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      if(this.wheel) {
        this.wheel = colorChange(this);
      }
    }
};

var diamond = {
                          
  name : "diamond",
  xPosition : 200,                                       
  yPosition : -400,
  i : 0,
  rotator : 0,
  colorDependant : false,
  wheel : true,
  starHit : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  movement : function () {

      context.lineWidth = 20;
      context.lineCap = "round";

     //context.clearRect( (xPosition - 120), (yPosition - 120), 240, 240);
     
     context.strokeStyle = "#13d2fc"; //light blue
      context.beginPath();
      context.moveTo(
        this.xPosition + 120 * Math.cos(rad * this.i),
        this.yPosition + 120 * Math.sin(rad * this.i)
      );
      context.lineTo(
        this.xPosition + 80 * Math.cos(rad * (this.i + 90)),
        this.yPosition + 80 * Math.sin(rad * (this.i + 90))
      );
      context.stroke();

      context.strokeStyle = "#ffb100"; //orange
      context.beginPath();
      context.moveTo(
        this.xPosition + 80 * Math.cos(rad * (this.i + 90)),
        this.yPosition + 80 * Math.sin(rad * (this.i + 90))
      );
      context.lineTo(
        this.xPosition + 120 * Math.cos(rad * (this.i + 180)),
        this.yPosition + 120 * Math.sin(rad * (this.i + 180))
      );
      context.stroke();

      context.strokeStyle = "#9254f4"; //purple
      context.beginPath();
      context.moveTo(
        this.xPosition + 120 * Math.cos(rad * (this.i + 180)),
        this.yPosition + 120 * Math.sin(rad * (this.i + 180))
      );
      context.lineTo(
        this.xPosition + 80 * Math.cos(rad * (this.i + 270)),
        this.yPosition + 80 * Math.sin(rad * (this.i + 270))
      );
      context.stroke();

      context.strokeStyle = "#ff3c85"; //pink
      context.beginPath();
      context.moveTo(
        this.xPosition + 80 * Math.cos(rad * (this.i + 270)),
        this.yPosition + 80 * Math.sin(rad * (this.i + 270))
      );
      context.lineTo(
        this.xPosition + 120 * Math.cos(rad * this.i),
        this.yPosition + 120 * Math.sin(rad * this.i)
      );
      context.stroke();
      this.i += 1.5 + difficulty;
      if(this.i >359) { this.i =0};
      this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
      if(this.wheel) {
        this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      if(this.wheel) {
        this.wheel = colorChange(this);
      } 
  }
  
};

var threeCircles = {                        
                          
  name : "three circles",
  xPosition : 200,
  yPosition : -400,
  i : 90,
  j : 0,
  k : 0,
  key : 0,
  rotator : 0,
  color : '#13d2fc',
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  colorDependant : true,
  wheel : true,
  starHit : true,
  obstrucleStar : star,
  colorChanger : colorBox,
  colorCreator : function () {
    this.color  = newColor();
    for(var z =0; z<4; z++) {
      if(this.colors[z] == this.color) { 
        this.colors[z] = this.colors[0];
        console.log(z);
      }
    }
    this.colors[0] = this.color;
    console.log(this.color + "      " + this.name);
  },
  
  colorChecker :function () {
    if(this.colors[0] != this.color){
      for(var z =0; z<4; z++) {
        if(this.colors[z] == this.color) { 
          this.colors[z] = this.colors[0];
        }
      }
      this.colors[0] = this.color;
    }
  },
  movement : function () {
      context.lineWidth = 14;
      context.lineCap='square';
      for(this.k = 0; this.k < 20; this.i += (0.065+(difficulty/20)), this.j -= (0.065 + (difficulty/20)), this.k ++) {
          for(this.key = 0; this.key < 271; this.key += 90) {
              
              context.strokeStyle = this.colors[this.key/90];  
              context.beginPath();
              context.arc(
                  this.xPosition,
                  this.yPosition,
                  110,
                  rad * (this.i + this.key),
                  rad * (this.i + this.key + 90));
              context.stroke();

              context.beginPath();
              context.arc(
                  this.xPosition,
                  this.yPosition,
                  92,
                  rad * (this.j + this.key),
                  rad * (this.j + this.key + 90));
              context.stroke();

              context.beginPath();
              context.arc(
                  this.xPosition,
                  this.yPosition,
                  74,
                  rad * (this.i + this.key),
                  rad * (this.i + this.key + 90));
              context.stroke();
          }
      }
      if(this.i >359) { this.i = 0};
      if(this.j < -359) { this.j = 0};
      this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
      // collisonDetectionBottom = context.getImageData(xPosition, yPosition+95, 1, 1).data[1];
      // collisonDetectionTop = context.getImageData(xPosition, yPosition-95, 1, 1).data[1];
      if(this.wheel) {
        this.rotator = this.colorChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      if(this.wheel) {
        this.wheel = colorChange(this);
      }
  },  
};

var twoCircles = {                        
  name : "two circles",
  xPosition : 200,                                       
  yPosition : -400,
  i : 0,
  j : -90,
  key : 0,
  rotator : 0,
  color : '#13d2fc',
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  colorDependant : true,
  wheel : true,
  starHit : true,
  obstrucleStar : star,
  colorChanger : colorBox,
  colorCreator : function () {
    this.color  = newColor();
    for(var z =0; z<4; z++) {
      if(this.colors[z] == this.color) {
        this.colors[z] = this.colors[1];
        console.log(z);
        }
    }
    this.colors[1] = this.color;
    console.log(this.color + "      " + this.name);
  },
  colorChecker :function () {
    if(this.colors[0] != this.color){
      for(var z =0; z<4; z++) {
        if(this.colors[z] == this.color) { 
          this.colors[z] = this.colors[1];
        }
      }
      this.colors[1] = this.color;
    }
  },
  movement : function() {
    context.lineWidth = 16;
    context.lineCap='square';
    
    for(this.k = 0; this.k < 20; this.i += (0.065+(difficulty/20)), this.j -= (0.065+(difficulty/20)), this.k ++) {
        for(this.key = 0; this.key < 271; this.key += 90) {
            
            context.strokeStyle = this.colors[this.key/90];  
            context.beginPath();
            context.arc(
                this.xPosition + 60,
                this.yPosition,
                52,
                rad * (this.i + this.key),
                rad * (this.i + this.key + 90));
            context.stroke();

            context.beginPath();
            context.arc(
                this.xPosition - 80,
                this.yPosition,
                72,
                rad * (this.j + this.key),
                rad * (this.j + this.key + 90));
            context.stroke();
          }    
      }
      if(this.i >359) { this.i =0};
      if(this.j < -359) { this.j =0};
      this.starHit = this.obstrucleStar(this.xPosition,this.yPosition - 150,this.starHit);
      if(this.wheel) {
        this.rotator = this.colorChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      if(this.wheel) {
        this.wheel = colorChange(this);
      }
  }
};

var triangles = {
  //delete the color element and push that to the start of colors
                          
  name : "triangles",
  xPosition : 200,
  yPosition : -400,
  i : 0,
  rotator : 0,
  colour : '#13d2fc',
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  colorDependant : true,
  wheel : true,
  starHit : true,
  obstrucleStar : star,
  colorChanger : colorBox,
  colorCreator : function () {
    this.color  = newColor();
    for(var z =0; z<4; z++) {
      if(this.colors[z] == this.color) { 
        this.colors[z] = this.colors[0];
        // console.log(z);
      }
    }
    this.colors[0] = this.color;
    console.log(this.color + "      " + this.name);
  },
  colorChecker :function () {
    if(this.colors[0] != this.color){
      for(var z =0; z<4; z++) {
        if(this.colors[z] == this.color) { 
          this.colors[z] = this.colors[0];
        }
      }
      this.colors[0] = this.color;
    }
  },
  movement : function () {
      context.lineWidth= 18;
      context.lineCap='round';
      
      for(var j = 0; j< 360; j+= 120, this.i += (0.65+(difficulty/3))) {
          context.beginPath();
          context.moveTo(
              this.xPosition + 120 * Math.cos(rad * (this.i + j)),
              this.yPosition + 120 * Math.sin(rad * (this.i + j))
          );
          context.lineTo(
              this.xPosition + 120 * Math.cos(rad * (this.i + j +120)),
              this.yPosition + 120 * Math.sin(rad * (this.i + j +120))
          );
          context.strokeStyle=this.colors[j/120];
          context.stroke();
      }
      if(this.i >359) { this.i =0};
      if(this.wheel) {
        this.rotator = this.colorChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
      if(this.wheel) {
        this.wheel = colorChange(this);
      }  
  }
};

function run() {
  if(resume && !dead) {
    ballDraw();
    ball.movement();
    pauseMenu();
    starCounter();
    highScore();
    for(var i =0; i< 4; i ++) {
      obs[i].movement();
    }
    collisonDetectionBottom = context.getImageData(ball.x, ball.y + 15, 1, 1).data[1];   //checking data at the bottom of the ball
    collisonDetectionTop = context.getImageData(ball.x, ball.y - 15, 1, 1).data[1];
  }
  else if (!dead && !resume){
    pauseMenu();
  }
  else {
    deadMenu();
  }

  if(colorball) {
    colorBall();
  }
  if(speedball) {
    speedBall();
  }
  window.requestAnimationFrame(run);
}

initialObstrucles();
run();

canvas.addEventListener("click", function (e) {
  if(resume || dead || click == 1)  {
    ball.vy = -7.5;
  }
  if(e.layerX < 32 && e.layerY < 40) {
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    resume? resume = false : resume = true;
  }
  clickX = e.layerX;
  clickY = e.layerY;
  click  = 1;
// console.log(ball.vy);
});

var bgmSound = new Audio("Darude-sandstorm.mp3");
bgmSound.loop = true;
addEventListener('click', function () {
  bgmSound.play();
})


function deadMenu() {
  var x = clickX;
  var y = clickY;
  var star = localStorage.getItem('star_count');
  star = Number(star);

  context.fillStyle= "rgba(176, 165, 176, 0.001)";
  context.fillRect(75, 180, canvas.width-150, canvas.height-400);
  
  context.lineCap='round';
  context.lineWidth=50;
  context.strokeStyle='black';
  
  context.beginPath();
  context.moveTo(125, 280);
  context.lineTo(275, 280);
  context.stroke();
  context.beginPath();
  context.moveTo(125, 345);
  context.lineTo(275, 345);
  context.stroke();

  context.strokeStyle='rgba(176, 165, 176, 0.05)';
  context.moveTo(120, 215);
  context.lineTo(280, 215);
  context.stroke();

  context.fillStyle='white';
  context.font='20px Major Mono Display, monospace';
  context.textBaseline='middle';
  context.textAlign='start';
  if(reviveToken == 0) {
    context.fillText("revive", 153, 278);
  }
  else if(reviveToken == 1) {
    context.fillText("100 stars", 130, 278);
  }
   else if(reviveToken == 2 && star > 100) {
    console.log("you can revive");
    reviveToken = 0;
    star -= 100;
    localStorage.setItem('star_count', (star).toString());
    ball.y = 500;
    dead = false;
    collisonDetectionTop = 0;
    smallBalls = [];
    ball.burst = false;
  } else {
    context.font='15px Major Mono Display, monospace';
    context.fillText("insufficient stars", 100, 278);
  }
  context.font='20px Major Mono Display, monospace'; 
  context.fillText("restart", 150, 343);
  context.font='30px Major Mono Display, monospace';
  context.fillText("you died", 100, 215);

  if(click == 1) {
    if(x > 100 && x < 300) {
      if(y > 255 && y < 305) {
        console.log("revive");
        if(reviveToken == 0) {
          reviveToken = 1;
          click = 0;
        }
        else if(reviveToken == 1) {
          reviveToken = 2;
          click = 0;
        }
        else {
          reviveToken = 0;
        }
        click =0;
      }
      if(y > 320 && y < 370) {
        console.log("restart");
        location.reload();
      }
    }
  }


  // context.strokeStyle='white';
  // context.lineWidth=2;
  // context.strokeRect(100, 255, 200, 50);
  // context.strokeRect(100, 320, 200, 50);

}


function pauseMenu() {
  if(resume) {
    context.lineCap='round';
    context.lineWidth=6;
    context.strokeStyle='white';
    context.beginPath();
    context.moveTo(15, 15);
    context.lineTo(15, 35);
    context.stroke();
    context.moveTo(27, 15);
    context.lineTo(27, 35);
    context.stroke();
  }    
  else {
    var x = clickX;
    var y = clickY;
    var star = localStorage.getItem('star_count');
    star = Number(star);
    players = localStorage.getItem("twoplayers");
    context.fillStyle= "rgba(176, 165, 176, 0.005)";
    context.fillRect(50, 50, canvas.width-100, canvas.height-100);
    
    context.beginPath();
    context.fillStyle='rgba(6,6,6,0.4)';
    context.arc(200, 150, 55, rad * 0, rad * 360);
    context.fill();
    context.beginPath();
    context.moveTo(235, 150);
    context.lineTo(200 + 35 * Math.cos(rad*120), 150 + 35 * Math.sin(rad*120));
    context.lineTo(200 + 35 * Math.cos(rad*240), 150 + 35 * Math.sin(rad*240));
    context.closePath();
    context.fillStyle='rgba(240,240,240,1)';    
    context.fill();

    context.lineCap='round';
    context.lineWidth=50;
    context.strokeStyle='black';
    
    context.beginPath();
    context.moveTo(120, 280);
    context.lineTo(270, 280);
    context.stroke();
    context.beginPath();
    context.moveTo(120, 355);
    context.lineTo(270, 355);
    context.stroke();
    context.beginPath();
    context.moveTo(120, 430);
    context.lineTo(270, 430);
    context.stroke();
    context.beginPath();
    context.moveTo(120, 505);
    context.lineTo(270, 505);
    context.stroke();
    
    context.fillStyle='white';
    context.font='20px Major Mono Display, monospace';
    context.textBaseline='middle';
    context.textAlign='start';
    
    context.fillText("restart", 142, 278);
    if(ballColorToken == 0) { context.fillText("colour Ball", 115, 353); }
    else if(ballColorToken == 1) { context.fillText("200 Tokens", 115, 353); }
    else if(ballColorToken == 2 && star > 200) { 
      star -= 200;
      localStorage.setItem('star_count', (star).toString());
      colorBallTimer = 20;
      colorball = true;
      ballColorToken = 0;
      colorBallTimeChanger();
      resume = true;
      console.log("you can color change");
    } else {
      context.font='13px Major Mono Display, monospace';
      context.fillText("insufficient stars", 108, 353);
      context.font='20px Major Mono Display, monospace';
    }
    if(ballSpeedToken == 0) { context.fillText("slow-down", 122, 428); }
    else if(ballSpeedToken == 1) { context.fillText("150 Tokens", 115, 428); }
    else if(ballSpeedToken == 2 && star > 150) { 
      star -= 150;
      localStorage.setItem('star_count', (star).toString());
      speedBallTimer = 45;
      speedball = true;
      ballSpeedToken = 0;
      speedballReset = difficulty;
      difficulty -= 2;
      speedBallTimeChanger();
      resume = true;
      console.log("you can color change");
    } else {
      context.font='13px Major Mono Display, monospace';
      context.fillText("insufficient stars", 108, 428);
      context.font='20px Major Mono Display, monospace';
    }
    if(players == '1') {
      context.fillText("two player", 118, 503);
    }
    if(players == '2') {
      context.fillText("one player", 118, 503);
    }
    
    context.strokeStyle='white';
    context.lineWidth=2;
    // context.strokeRect(90, 255, 210, 50);
    // context.strokeRect(90, 330, 210, 50);
    // context.strokeRect(90, 405, 210, 50);    
    // context.strokeRect(90, 480, 210, 50);    
    
    if(click == 1) {
      var resumeButton = (((x - 200) ** 2) + ((y - 150) ** 2) - 3025);
      if(resumeButton <= 0){
        console.log("reusme Button");
        resume = true;
      }
      if(x > 90 && x < 300) {
        if(y > 255 && y < 305) {
        console.log("restart");
        }
        if(y > 330 && y < 380) {
          console.log("color ball");
          if(ballColorToken == 0) {ballColorToken ++ }
          else if(ballColorToken == 1) {ballColorToken ++ }
          else { ballColorToken = 0 }
          
        } 
        if(y > 405 && y < 455) {
          console.log("slow_down");
          if(ballSpeedToken == 0) {ballSpeedToken ++ }
          else if(ballSpeedToken == 1) {ballSpeedToken ++ }
          else { ballSpeedToken = 0 }
        }
        if(y > 480 && y < 530) {
          console.log("2 player");
          if(players == '1') {
            localStorage.setItem("twoplayers", '2');
            location.reload();
          }
          if(players == '2') {
            localStorage.setItem("twoplayers", '1');
            location.reload();
          }
          resume = true;
        }
      }
    click = 0;
    }
  }
}

function starCounter() {
  //try to add gradient
  context.beginPath();
  context.moveTo(382 + 7 * Math.cos( rad * 18), 20 + 7 * Math.sin(rad * 18));
  for( var i = 54; i <  360; i += 72)  {
  context.lineTo(382 + 10 * Math.cos( rad * i), 20 + 10 * Math.sin(rad * i));
  context.lineTo(382 + 6.25 * Math.cos( rad * (i + 36)), 20 + 6.25 * Math.sin(rad * (i + 36)));
  }
  context.fillStyle='white';
  context.fill();
  
  var y = localStorage.getItem('star_count');
  context.textBaseline='hanging';
  context.font='20px Major Mono Display, monospace';
  context.textAlign='end';
  if(y != null){
  context.fillText(y, 370, 12);
  }
  else{
    context.fillText('0', 370, 12);
  }
}

function highScore() {
  var highscore = localStorage.getItem("highscore");
  context.fillStyle='white';
  context.textAlign='start';
  context.font='13px Major Mono Display, monospace';
  context.fillText('highscore', 5, 580);
  if(highscore == null){
    context.fillText('0', 30, 562);
    localStorage.setItem('highscore', '0');
  }
  else {
    context.fillText(highscore, 30, 562);
  }
  context.textAlign='end';
  var x = Math.round(score);
  x /= 10;
  context.fillText('score', 390, 580);
  context.textAlign='center';
  context.fillText(x.toString(), 365, 560);
  if(x > Number(highscore)){
    localStorage.setItem('highscore', x.toString());
  }
}

function colorBallTimeChanger() {
  colorBallTimerReset= setInterval(() => {
    colorBallTimer --;
  }, 1000);
}

function colorBall() {
  if(colorball) {
    context.fillStyle='white';
    context.font='40px Major Mono Display, monospace';
    context.textBaseline='middle';
    context.textAlign='center';
    context.fillText(colorBallTimer, 200, 450);
    if(colorBallTimer < 1) {
      clearTimeout(colorBallTimerReset);
      colorball = false;
    }
  }
}

function speedBallTimeChanger() {
  speedBallTimerReset= setInterval(() => {
    speedBallTimer --;
  }, 1000);
}

function speedBall() {
  if(speedball) {
    context.fillStyle='white';
    context.font='40px Major Mono Display, monospace';
    context.textBaseline='middle';
    context.textAlign='center';
    context.fillText(speedBallTimer, 200, 450);
    if(speedBallTimer < 1) {
      clearTimeout(speedBallTimerReset);
      speedball = false;
      difficulty = speedballReset;
    }
  }
}


if(localStorage.getItem('twoplayers') == "2") {
  playerTwo();
}

function playerTwo() {
  var players = localStorage.getItem("twoplayers");

  // setInterval(() => {
  //     players = localStorage.getItem("twoplayers");
  //     console.log(players);
  //     if(players == '2') {
  //       console.log("yes");
  //         run();
  //     }
  // }, 100);
  var canvas = document.getElementById("canvas2");
  canvas.width = 400;
  canvas.height = 600;
  canvas.style.background = "rgba(45, 41, 45, 0.7)";
  var context = canvas.getContext("2d");
  var ctx = canvas.getContext("2d");
  var difficulty = 0;  // increases every time an obstrucle is re initialized
  var point = new Audio("star.mp3");
  var rad = Math.PI / 180;
  var colors = ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'];
  var obs = [];
  var lag =0;
  var collisonDetectionBottom = 0, collisonDetectionTop = 0;
  var smallBalls =[];
  var score = 0;
  var resume = true;
  var dead = false;
  var clickX = 0, clickY =0;

  var colorball = false;
  var colorBallTimer = 0;
  var colorBallTimerReset;

  var speedball = false;
  var speedBallTimer = 0;
  var speedballReset = 0;
  var speedBallTimerReset;

  var click = 0;
  //TOKENS
  reviveToken = 0;
  ballColorToken = 0;
  ballSpeedToken = 0;

  function newObstrucle( ) {
    var obstrucleSelector =  {
      obs1 : circle,              //
      obs2 : rotatingLines,       //
      obs3 : square,              //
      obs4 : rotatingCircles,     //
      obs5 : diamond,             //
      obs6 : threeCircles,        //
      obs7 : twoCircles,          //
      obs8 : triangles            //
    }
    var x;
    var obstrucleValueTag = ['obs1', 'obs2', 'obs3', 'obs4', 'obs5', 'obs6', 'obs7', 'obs8'];
    var obstrucleTag = Math.floor(Math.random() * 8);   //generates a number from 0 to 7
    x = Object.assign( {} , obstrucleSelector[obstrucleValueTag[obstrucleTag]] );
    // if(x.colorDependant) {x.color = '#13d2fc';}
    return x;
  }

  function hit() {
    if(ball.color == '#13d2fc') {
      ball.colorCode = 210;
    }
    if(ball.color == '#ffb100') {
      ball.colorCode = 177;
    }
    if(ball.color == '#9254f4') {
      ball.colorCode = 84;
    }
    if(ball.color == '#ff3c85') {
      ball.colorCode = 60;
    }
  }

  function initialObstrucles() {
    for(var i =0; i< 4; i++)  {
      obs[i] = newObstrucle();
      obs[i].yPosition -= ((i-1) * 500);
      if(obs[i].colorDependant){
        // console.log(obs[i]);
        obs[i].colorCreator();
      }
    };  
    console.log(ball.color + "        " + "ball");
  }

  function obstrucleReinitializer() {
    
    for(var i =0; i < 4; i++) {
      if(obs[i].yPosition >= 1600) {
        difficulty += 0.1;
        obs[i] = newObstrucle();
        // console.log("%c obs " + (i + 1) + " has been reset", 'background: red; color: white');
        if(obs[i].colorDependant){
          obs[i].colorCreator();
        }
      }
    }
  };

  function star(xPosition, yPosition, x) {  
    if(x) {
      if(ball.y - yPosition < 10 ){
        point.play();
        var y = localStorage.getItem('star_count');
        y = Number(y);
        if( y == 'null') {
        localStorage.setItem('star_count', 1);
        }
        else {
          localStorage.setItem('star_count', (y+1).toString());
        }
      return false;
      }
      context.beginPath();
      context.moveTo(xPosition + 9 * Math.cos( rad * 18), yPosition + 9 * Math.sin(rad * 18));
      for( var i = 54; i <  360; i += 72)  {
      context.lineTo(xPosition + 15 * Math.cos( rad * i), yPosition + 15 * Math.sin(rad * i));
      context.lineTo(xPosition + 8.25 * Math.cos( rad * (i + 36)), yPosition + 8.25 * Math.sin(rad * (i + 36)));
      }
      context.fillStyle='rgb(244, 244, 244)';
      context.fill();
      return true;   
    }
  };

  function colorBox(xPosition, yPosition, rotator) {    //creates rotating color changing wheel
    for(var i =0; i<360; i += 90, rotator += 0.35) {
        context.beginPath();
        context.moveTo(xPosition, yPosition);
        context.arc(xPosition, yPosition, 15, rad * (i+ rotator), rad * (i + 90 + rotator));
        context.closePath();
        context.fillStyle = colors[i / 90];
        context.fill();  
    }
    return rotator;
  };

  function colorChange(obstrucle) {                     //change colour when you meet color wheel
    if(ball.y - (obstrucle.yPosition + 250) < 38 && obstrucle.wheel == true)   {
        if(obstrucle.colorDependant) {
            ball.color = obstrucle.color;
            return false;
        }   else    {
            ball.color = newColor();
            return false;
        } 
    }
    return true;
  };

  function ballBurst() {
    var x = ball.x;
    var y = ball.y;
    for(var i=0; i< 12; i ++){
      smallBalls[i] = Object.assign({ }, littleBall );
      smallBalls[i].color = newColor();
      if(i<2) {
        smallBalls[i].x =  Math.floor(Math.random() * 20) + (x+20);
        smallBalls[i].vx = 5.5 + (smallBalls[i].x / 50);
        smallBalls[i].y =  Math.floor(Math.random() * 20) + (y-20);
        smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
      }
      else if(i<4) {
        smallBalls[i].x =  Math.floor(Math.random() * 20) + (x+20);
        smallBalls[i].vx = 5.5 + (smallBalls[i].x / 50);
        smallBalls[i].y =  Math.floor(Math.random() * 20) + (y);
        smallBalls[i].vy = - (smallBalls[i].y / 50);
      }
      else if(i<6) {
        smallBalls[i].x =  Math.floor(Math.random() * 20) + (x+20);
        smallBalls[i].vx = 5.5 + (smallBalls[i].x / 50);
        smallBalls[i].y =  Math.floor(Math.random() * 20) + (y+20);
        smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
      }
      else if(i<8) {
        smallBalls[i].x =  Math.floor(Math.random() * 20) + (x-20);
        smallBalls[i].vx = -5.5 - (smallBalls[i].x / 50);
        smallBalls[i].y =  Math.floor(Math.random() * 20) + (y+20);
        smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
      }
      else if(i<10) {
        smallBalls[i].x =  Math.floor(Math.random() * 20) + (x-20);
        smallBalls[i].vx = -5.5 - (smallBalls[i].x / 50);
        smallBalls[i].y =  Math.floor(Math.random() * 20) + (y);
        smallBalls[i].vy = (smallBalls[i].y / 50);
      }
      else if(i<12) {
        smallBalls[i].x =  Math.floor(Math.random() * 20) + (x-20);
        smallBalls[i].vx = -5.5 - (smallBalls[i].x / 50);
        smallBalls[i].y =  Math.floor(Math.random() * 20) + (y-20);
        smallBalls[i].vy = -2.5 - (smallBalls[i].y / 50);
      }
    }
    ball.burst = true;
    // smallBallMovement();
  }

  function smallBallMovement() {
    for(var i =0; i<12; i++){
      smallBalls[i].movement();
      if(smallBalls[i].x > 400){
        smallBalls[i].vx = -smallBalls[i].vx;
      }
      if(smallBalls[i].x < 0){
        smallBalls[i].vx = -smallBalls[i].vx;
      }
      smallBalls[i].y += smallBalls[i].vy;
      smallBalls[i].vy += 0.35;
      smallBalls[i].x += smallBalls[i].vx;
    }
    var k = 0;
    for(i=0;i<12;i++){
      if(smallBalls[i].y < 700) {
        k =1;
      }
    }
    if(k == 0) {
      debugger;
      dead = true;
      //bring  end game bar
    }
  }

  function ballDraw() {  
    context.clearRect(0, 0, canvas.width, canvas.height);
    if(ball.burst == false) {
      collisionTest();
      if (ball.y <= 400 || ball.vy < 0) {
        ball.vy += ball.ay;
        ball.y += ball.vy;
      } else {
        ball.y = 400;
        ball.vy = 0;
      }

      //SCREEN AND BALL MOVEMENT_____________________
      if(ball.y < 300) {
          lag = 300-ball.y;
      }  
      if( lag > 1.25) {
        for(var i = 0; i < 4; i ++) {
          obs[i].yPosition += (1.25 + Math.pow((lag * 0.04),1.2));
        }
        ball.y += (1.25 + Math.pow((lag * 0.04),1.2));
        score += (1.25 + Math.pow((lag * 0.04),1.2));
        lag -= (1.25 + Math.pow((lag * 0.04),1.2));
      }
      else {
        for(var i =0; i < 4; i ++) {
          obs[i].yPosition += lag;
        }
        ball.y += lag;
        score += lag;
        lag = 0;
      }
      obstrucleReinitializer();
  }
  else{
    smallBallMovement();
  }
  }

  function newColor () {
    var y = Math.floor(Math.random() * 4  + 0);
    var x = colors[y];
    return x;

  }

  function collisionTest() {
    if(collisonDetectionTop != 0 && collisonDetectionTop < 239) {
      if(collisonDetectionTop > (ball.colorCode+10) || collisonDetectionTop < (ball.colorCode-10)){
        console.log("%c               " , 'background : red;');
        console.log(collisonDetectionTop);
        if(!colorball) {
          ballBurst();
        }
      }
      else {
        console.log("%c               " , 'background : green;');
        console.log(collisonDetectionTop);
      }      
    }}

  var ball = {
    x: 200,
    y: 500,
    vy: 0,
    ay: 0.4,
    radius: 10,
    burst: false,
    color : newColor(),
    colorCode : 0,
    rotator : 0,
    movement: function () {
        if(this.burst == false) {
        if(!colorball) {
          context.beginPath();
          context.arc(this.x, this.y, this.radius, 0, rad * 360, true);
          context.closePath();
          context.fillStyle = this.color;
          context.fill();
          hit();
        }
        else {
          for(var i =0; i<360; i += 90, this.rotator += 0.85) {
            context.beginPath();
            context.moveTo(this.x, this.y);
            context.arc(this.x, this.y, this.radius, rad * (i+ this.rotator), rad * (i + 90 + this.rotator));
            context.closePath();
            context.fillStyle = colors[i / 90];
            context.fill();  
        }
        }
      }
    },

  };

  var littleBall  = {
    x : 200,
    y : 300,
    r : 4,
    vx : 0,
    vy : 0,
    color : 'black',
    movement: function () {
      context.beginPath();
      context.arc(this.x, this.y, this.r, 0, rad * 360, true);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
  },
  };


  var circle = {                        
      name : "circle",
      xPosition : 200,
      yPosition : -400,
      i : 0,
      rotator : 0,
      colorDependant : false,
      wheel : true,
      starHit : true,
      obstrucleStar : star,
      colourChanger : colorBox,
      movement : function () {
          context.lineWidth = 20;
          context.lineCap='square';
          context.beginPath();
          context.strokeStyle = "#13d2fc";  //light blue  82, 222, 213
          context.arc(this.xPosition, this.yPosition, 90, rad * this.i, rad * (this.i + 90));
          context.stroke();
        
          context.beginPath();
          context.strokeStyle = "#ffb100";  //orange  255, 145, 0
          context.arc(this.xPosition, this.yPosition, 90, rad * (this.i + 90), rad * (this.i + 180));
          context.stroke();
        
          context.beginPath();
          context.strokeStyle = "#9254f4";  //purple  148, 81, 214
          context.arc(this.xPosition, this.yPosition, 90, rad * (this.i + 180), rad * (this.i + 270));
          context.stroke();
        
          context.beginPath();
          context.strokeStyle = "#ff3c85"; //pink  255, 0, 191
          context.arc(this.xPosition, this.yPosition, 90, rad * (this.i + 270), rad * (this.i + 360));
          context.stroke();
          this.i += 1.5 + difficulty;

          if(this.i >359) { this.i =0 };

          this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
          if(this.wheel) {
            this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
          }
          if(this.wheel) {
            this.wheel = colorChange(this);
          }
          // collisonDetectionBottom = context.getImageData(xPosition, yPosition+95, 1, 1).data[1];
          // collisonDetectionTop = context.getImageData(xPosition, yPosition-95, 1, 1).data[1];
      
      },  
  };

  var square = {
                            
    name : "square",  
    xPosition : 200,                                       
    yPosition : -400,
    i : 0,
    rotator : 0,
    colorDependant : false,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colourChanger : colorBox,
    movement : function () {
    
    context.lineWidth = 20;
    context.lineCap = "round";
    for(var j =0; j< 360; j += 90, this.i += (0.45 + (difficulty / 4)))  {
        context.strokeStyle = colors[j /90];
        context.beginPath();
        context.moveTo(
          this.xPosition + 100 * Math.cos(rad * (this.i + j)),
          this.yPosition + 100 * Math.sin(rad * (this.i + j))
        );
        context.lineTo(
          this.xPosition + 100 * Math.cos(rad * (this.i + 90 + j)),
          this.yPosition + 100 * Math.sin(rad * (this.i + 90 + j))
        );
        context.stroke();    
        
        if(this.i >359) { this.i =0};
    }

    this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
    if(this.wheel) {
      this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
    }
    if(this.wheel) {
      this.wheel = colorChange(this);
    }
    }    
  };

  var rotatingLines = {
                          
    name : "rotatingLines",
    xPosition : 200,
    yPosition : -400,
    i : 0,
    rotator : 0,
    colorDependant : false,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colourChanger : colorBox,
    movement : function () {
        
        context.lineWidth = 20;
        context.lineCap = "round";
        for(var j =0; j < 360; j += 90) {
            context.strokeStyle = colors[ j/ 90]; 
      
            context.beginPath();
            context.moveTo(this.xPosition + 50, this.yPosition);
            context.lineTo(
              this.xPosition + 50 + 90 * Math.cos(rad * (this.i + j)),
              this.yPosition + 90 * Math.sin(rad * (this.i + j))
            );
            context.stroke();
        }
        for(var j =0; j < 360; j += 90) {
            context.beginPath();
            context.moveTo(this.xPosition + 50, this.yPosition);
            context.arc(
              this.xPosition + 50,
              this.yPosition,
              14,
              rad * (this.i - 45 + j),
              rad * (this.i + 45 + j)
            );
            context.closePath();
            context.fillStyle= colors[ j / 90];
            context.fill();
        }
        this.i += 1.75 + difficulty;
        
        if(this.i >359) { this.i =0};

        this.starHit = this.obstrucleStar(this.xPosition,this.yPosition - 120,this.starHit);
        if(this.wheel) {
          this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
        }
        if(this.wheel) {
          this.wheel = colorChange(this);
        }
    }
  };

  var rotatingCircles = {
                            
    name : "rotatingcircles",
    xPosition : 200,
    yPosition : -400,
    i : 0,
    rotator : 0,
    colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
    j : 0,
    colorDependant : false,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colourChanger : colorBox,
    movement : function () {
      context.fillStyle='red';
      // debugger;
      for(this.j=0; this.j < 24 ; this.i += (15.05 +(difficulty /20) ), this.j ++) {
          context.beginPath();
          context.arc(
          this.xPosition + 90 * Math.cos(rad * this.i),
          this.yPosition + 90 * Math.sin(rad * this.i) ,
          10,
          0, Math.PI * 2);
          context.fillStyle=this.colors[Math.floor(this.j/6)];        
          context.fill();
        }
        if(this.i >359) { this.i -= 360};
        this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
        if(this.wheel) {
          this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
        }
        if(this.wheel) {
          this.wheel = colorChange(this);
        }
      }
  };

  var diamond = {
                            
    name : "diamond",
    xPosition : 200,                                       
    yPosition : -400,
    i : 0,
    rotator : 0,
    colorDependant : false,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colourChanger : colorBox,
    movement : function () {

        context.lineWidth = 20;
        context.lineCap = "round";

      //context.clearRect( (xPosition - 120), (yPosition - 120), 240, 240);
      
      context.strokeStyle = "#13d2fc"; //light blue
        context.beginPath();
        context.moveTo(
          this.xPosition + 120 * Math.cos(rad * this.i),
          this.yPosition + 120 * Math.sin(rad * this.i)
        );
        context.lineTo(
          this.xPosition + 80 * Math.cos(rad * (this.i + 90)),
          this.yPosition + 80 * Math.sin(rad * (this.i + 90))
        );
        context.stroke();

        context.strokeStyle = "#ffb100"; //orange
        context.beginPath();
        context.moveTo(
          this.xPosition + 80 * Math.cos(rad * (this.i + 90)),
          this.yPosition + 80 * Math.sin(rad * (this.i + 90))
        );
        context.lineTo(
          this.xPosition + 120 * Math.cos(rad * (this.i + 180)),
          this.yPosition + 120 * Math.sin(rad * (this.i + 180))
        );
        context.stroke();

        context.strokeStyle = "#9254f4"; //purple
        context.beginPath();
        context.moveTo(
          this.xPosition + 120 * Math.cos(rad * (this.i + 180)),
          this.yPosition + 120 * Math.sin(rad * (this.i + 180))
        );
        context.lineTo(
          this.xPosition + 80 * Math.cos(rad * (this.i + 270)),
          this.yPosition + 80 * Math.sin(rad * (this.i + 270))
        );
        context.stroke();

        context.strokeStyle = "#ff3c85"; //pink
        context.beginPath();
        context.moveTo(
          this.xPosition + 80 * Math.cos(rad * (this.i + 270)),
          this.yPosition + 80 * Math.sin(rad * (this.i + 270))
        );
        context.lineTo(
          this.xPosition + 120 * Math.cos(rad * this.i),
          this.yPosition + 120 * Math.sin(rad * this.i)
        );
        context.stroke();
        this.i += 1.5 + difficulty;
        if(this.i >359) { this.i =0};
        this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
        if(this.wheel) {
          this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
        }
        if(this.wheel) {
          this.wheel = colorChange(this);
        } 
    }
    
  };

  var threeCircles = {                        
                            
    name : "three circles",
    xPosition : 200,
    yPosition : -400,
    i : 90,
    j : 0,
    k : 0,
    key : 0,
    rotator : 0,
    color : '#13d2fc',
    colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
    colorDependant : true,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colorChanger : colorBox,
    colorCreator : function () {
      this.color  = newColor();
      for(var z =0; z<4; z++) {
        if(this.colors[z] == this.color) { 
          this.colors[z] = this.colors[0];
          console.log(z);
        }
      }
      this.colors[0] = this.color;
      console.log(this.color + "      " + this.name);
    },
    
    colorChecker :function () {
      if(this.colors[0] != this.color){
        for(var z =0; z<4; z++) {
          if(this.colors[z] == this.color) { 
            this.colors[z] = this.colors[0];
          }
        }
        this.colors[0] = this.color;
      }
    },
    movement : function () {
        context.lineWidth = 14;
        context.lineCap='square';
        for(this.k = 0; this.k < 20; this.i += (0.065+(difficulty/20)), this.j -= (0.065 + (difficulty/20)), this.k ++) {
            for(this.key = 0; this.key < 271; this.key += 90) {
                
                context.strokeStyle = this.colors[this.key/90];  
                context.beginPath();
                context.arc(
                    this.xPosition,
                    this.yPosition,
                    110,
                    rad * (this.i + this.key),
                    rad * (this.i + this.key + 90));
                context.stroke();

                context.beginPath();
                context.arc(
                    this.xPosition,
                    this.yPosition,
                    92,
                    rad * (this.j + this.key),
                    rad * (this.j + this.key + 90));
                context.stroke();

                context.beginPath();
                context.arc(
                    this.xPosition,
                    this.yPosition,
                    74,
                    rad * (this.i + this.key),
                    rad * (this.i + this.key + 90));
                context.stroke();
            }
        }
        if(this.i >359) { this.i = 0};
        if(this.j < -359) { this.j = 0};
        this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
        // collisonDetectionBottom = context.getImageData(xPosition, yPosition+95, 1, 1).data[1];
        // collisonDetectionTop = context.getImageData(xPosition, yPosition-95, 1, 1).data[1];
        if(this.wheel) {
          this.rotator = this.colorChanger(this.xPosition,this.yPosition + 250, this.rotator);
        }
        if(this.wheel) {
          this.wheel = colorChange(this);
        }
    },  
  };

  var twoCircles = {                        
    name : "two circles",
    xPosition : 200,                                       
    yPosition : -400,
    i : 0,
    j : -90,
    key : 0,
    rotator : 0,
    color : '#13d2fc',
    colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
    colorDependant : true,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colorChanger : colorBox,
    colorCreator : function () {
      this.color  = newColor();
      for(var z =0; z<4; z++) {
        if(this.colors[z] == this.color) {
          this.colors[z] = this.colors[1];
          console.log(z);
          }
      }
      this.colors[1] = this.color;
      console.log(this.color + "      " + this.name);
    },
    colorChecker :function () {
      if(this.colors[0] != this.color){
        for(var z =0; z<4; z++) {
          if(this.colors[z] == this.color) { 
            this.colors[z] = this.colors[1];
          }
        }
        this.colors[1] = this.color;
      }
    },
    movement : function() {
      context.lineWidth = 16;
      context.lineCap='square';
      
      for(this.k = 0; this.k < 20; this.i += (0.065+(difficulty/20)), this.j -= (0.065+(difficulty/20)), this.k ++) {
          for(this.key = 0; this.key < 271; this.key += 90) {
              
              context.strokeStyle = this.colors[this.key/90];  
              context.beginPath();
              context.arc(
                  this.xPosition + 60,
                  this.yPosition,
                  52,
                  rad * (this.i + this.key),
                  rad * (this.i + this.key + 90));
              context.stroke();

              context.beginPath();
              context.arc(
                  this.xPosition - 80,
                  this.yPosition,
                  72,
                  rad * (this.j + this.key),
                  rad * (this.j + this.key + 90));
              context.stroke();
            }    
        }
        if(this.i >359) { this.i =0};
        if(this.j < -359) { this.j =0};
        this.starHit = this.obstrucleStar(this.xPosition,this.yPosition - 150,this.starHit);
        if(this.wheel) {
          this.rotator = this.colorChanger(this.xPosition,this.yPosition + 250, this.rotator);
        }
        if(this.wheel) {
          this.wheel = colorChange(this);
        }
    }
  };

  var triangles = {
    //delete the color element and push that to the start of colors
                            
    name : "triangles",
    xPosition : 200,
    yPosition : -400,
    i : 0,
    rotator : 0,
    colour : '#13d2fc',
    colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
    colorDependant : true,
    wheel : true,
    starHit : true,
    obstrucleStar : star,
    colorChanger : colorBox,
    colorCreator : function () {
      this.color  = newColor();
      for(var z =0; z<4; z++) {
        if(this.colors[z] == this.color) { 
          this.colors[z] = this.colors[0];
          // console.log(z);
        }
      }
      this.colors[0] = this.color;
      console.log(this.color + "      " + this.name);
    },
    colorChecker :function () {
      if(this.colors[0] != this.color){
        for(var z =0; z<4; z++) {
          if(this.colors[z] == this.color) { 
            this.colors[z] = this.colors[0];
          }
        }
        this.colors[0] = this.color;
      }
    },
    movement : function () {
        context.lineWidth= 18;
        context.lineCap='round';
        
        for(var j = 0; j< 360; j+= 120, this.i += (0.65+(difficulty/3))) {
            context.beginPath();
            context.moveTo(
                this.xPosition + 120 * Math.cos(rad * (this.i + j)),
                this.yPosition + 120 * Math.sin(rad * (this.i + j))
            );
            context.lineTo(
                this.xPosition + 120 * Math.cos(rad * (this.i + j +120)),
                this.yPosition + 120 * Math.sin(rad * (this.i + j +120))
            );
            context.strokeStyle=this.colors[j/120];
            context.stroke();
        }
        if(this.i >359) { this.i =0};
        if(this.wheel) {
          this.rotator = this.colorChanger(this.xPosition,this.yPosition + 250, this.rotator);
        }
        this.starHit = this.obstrucleStar(this.xPosition,this.yPosition,this.starHit);
        if(this.wheel) {
          this.wheel = colorChange(this);
        }  
    }
  };

  function run() {
    var players = localStorage.getItem("twoplayers");
    if(players == '1'){
      canvas.width = 0;
      canvas.height = 0;
    }
    window.cancelAnimationFrame(run);
    if(resume && !dead) {
      ballDraw();
      ball.movement();
      pauseMenu();
      starCounter();
      highScore();
      for(var i =0; i< 4; i ++) {
        obs[i].movement();
      }
      collisonDetectionBottom = context.getImageData(ball.x, ball.y + 15, 1, 1).data[1];   //checking data at the bottom of the ball
      collisonDetectionTop = context.getImageData(ball.x, ball.y - 15, 1, 1).data[1];
    }
    else if (!dead && !resume){
      pauseMenu();
    }
    else {
      deadMenu();
    }

    if(colorball) {
      colorBall();
    }
    if(speedball) {
      speedBall();
    }
      window.requestAnimationFrame(run);


  }

  initialObstrucles();
  run();

  canvas.addEventListener("click", function (e) {
    if(resume || dead || click == 1)  {
      ball.vy = -7.5;
    }
    if(e.layerX < 32 && e.layerY < 40) {
      console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
      resume? resume = false : resume = true;
    }
    clickX = e.layerX;
    clickY = e.layerY;
    click  = 1;
  // console.log(ball.vy);
  });

  window.addEventListener('keydown',function(e) {
      if(e.key == ' ') {
          if(resume || dead )  {
              ball.vy = -7.5;
            }
      }
      if(e.key == 'Escape') {
          resume? resume = false : resume = true;
      }
  });

  var bgmSound = new Audio("Darude-sandstorm.mp3");
  bgmSound.loop = true;
  addEventListener('click', function () {
    bgmSound.play();
  })


  function deadMenu() {
    var x = clickX;
    var y = clickY;
    var star = localStorage.getItem('star_count');
    star = Number(star);

    context.fillStyle= "rgba(176, 165, 176, 0.001)";
    context.fillRect(75, 180, canvas.width-150, canvas.height-400);
    
    context.lineCap='round';
    context.lineWidth=50;
    context.strokeStyle='black';
    
    context.beginPath();
    context.moveTo(125, 280);
    context.lineTo(275, 280);
    context.stroke();
    context.beginPath();
    context.moveTo(125, 345);
    context.lineTo(275, 345);
    context.stroke();

    context.strokeStyle='rgba(176, 165, 176, 0.05)';
    context.moveTo(120, 215);
    context.lineTo(280, 215);
    context.stroke();

    context.fillStyle='white';
    context.font='20px Major Mono Display, monospace';
    context.textBaseline='middle';
    context.textAlign='start';
    if(reviveToken == 0) {
      context.fillText("revive", 153, 278);
    }
    else if(reviveToken == 1) {
      context.fillText("100 stars", 130, 278);
    }
    else if(reviveToken == 2 && star > 100) {
      console.log("you can revive");
      reviveToken = 0;
      star -= 100;
      localStorage.setItem('star_count', (star).toString());
      ball.y = 500;
      dead = false;
      collisonDetectionTop = 0;
      smallBalls = [];
      ball.burst = false;
    } else {
      context.font='15px Major Mono Display, monospace';
      context.fillText("insufficient stars", 100, 278);
    }
    context.font='20px Major Mono Display, monospace'; 
    context.fillText("restart", 150, 343);
    context.font='30px Major Mono Display, monospace';
    context.fillText("you died", 100, 215);

    if(click == 1) {
      if(x > 100 && x < 300) {
        if(y > 255 && y < 305) {
          console.log("revive");
          if(reviveToken == 0) {
            reviveToken = 1;
            click = 0;
          }
          else if(reviveToken == 1) {
            reviveToken = 2;
            click = 0;
          }
          else {
            reviveToken = 0;
          }
          click =0;
        }
        if(y > 320 && y < 370) {
          console.log("restart");
          location.reload();
        }
      }
    }


    // context.strokeStyle='white';
    // context.lineWidth=2;
    // context.strokeRect(100, 255, 200, 50);
    // context.strokeRect(100, 320, 200, 50);

  }


  function pauseMenu() {
    if(resume) {
      context.lineCap='round';
      context.lineWidth=6;
      context.strokeStyle='white';
      context.beginPath();
      context.moveTo(15, 15);
      context.lineTo(15, 35);
      context.stroke();
      context.moveTo(27, 15);
      context.lineTo(27, 35);
      context.stroke();
    }    
    else {
      var x = clickX;
      var y = clickY;
      var star = localStorage.getItem('star_count');
      star = Number(star);
      players = localStorage.getItem("twoplayers");
      context.fillStyle= "rgba(176, 165, 176, 0.005)";
      context.fillRect(50, 50, canvas.width-100, canvas.height-100);
      
      context.beginPath();
      context.fillStyle='rgba(6,6,6,0.4)';
      context.arc(200, 150, 55, rad * 0, rad * 360);
      context.fill();
      context.beginPath();
      context.moveTo(235, 150);
      context.lineTo(200 + 35 * Math.cos(rad*120), 150 + 35 * Math.sin(rad*120));
      context.lineTo(200 + 35 * Math.cos(rad*240), 150 + 35 * Math.sin(rad*240));
      context.closePath();
      context.fillStyle='rgba(240,240,240,1)';    
      context.fill();
  
      context.lineCap='round';
      context.lineWidth=50;
      context.strokeStyle='black';
      
      context.beginPath();
      context.moveTo(120, 280);
      context.lineTo(270, 280);
      context.stroke();
      context.beginPath();
      context.moveTo(120, 355);
      context.lineTo(270, 355);
      context.stroke();
      context.beginPath();
      context.moveTo(120, 430);
      context.lineTo(270, 430);
      context.stroke();
      context.beginPath();
      context.moveTo(120, 505);
      context.lineTo(270, 505);
      context.stroke();
      
      context.fillStyle='white';
      context.font='20px Major Mono Display, monospace';
      context.textBaseline='middle';
      context.textAlign='start';
      
      context.fillText("restart", 142, 278);
      if(ballColorToken == 0) { context.fillText("colour Ball", 115, 353); }
      else if(ballColorToken == 1) { context.fillText("200 Tokens", 115, 353); }
      else if(ballColorToken == 2 && star > 200) { 
        star -= 200;
        localStorage.setItem('star_count', (star).toString());
        colorBallTimer = 20;
        colorball = true;
        ballColorToken = 0;
        colorBallTimeChanger();
        resume = true;
        console.log("you can color change");
      } else {
        context.font='13px Major Mono Display, monospace';
        context.fillText("insufficient stars", 108, 353);
        context.font='20px Major Mono Display, monospace';
      }
      if(ballSpeedToken == 0) { context.fillText("slow-down", 122, 428); }
      else if(ballSpeedToken == 1) { context.fillText("150 Tokens", 115, 428); }
      else if(ballSpeedToken == 2 && star > 150) { 
        star -= 150;
        localStorage.setItem('star_count', (star).toString());
        speedBallTimer = 45;
        speedball = true;
        ballSpeedToken = 0;
        speedballReset = difficulty;
        difficulty -= 2;
        speedBallTimeChanger();
        resume = true;
        console.log("you can color change");
      } else {
        context.font='13px Major Mono Display, monospace';
        context.fillText("insufficient stars", 108, 428);
        context.font='20px Major Mono Display, monospace';
      }
      if(players == '1') {
        context.fillText("two player", 118, 503);
      }
      if(players == '2') {
        context.fillText("one player", 118, 503);
      }
      
      context.strokeStyle='white';
      context.lineWidth=2;
      // context.strokeRect(90, 255, 210, 50);
      // context.strokeRect(90, 330, 210, 50);
      // context.strokeRect(90, 405, 210, 50);    
      // context.strokeRect(90, 480, 210, 50);    
      
      if(click == 1) {
        var resumeButton = (((x - 200) ** 2) + ((y - 150) ** 2) - 3025);
        if(resumeButton <= 0){
          console.log("reusme Button");
          resume = true;
        }
        if(x > 90 && x < 300) {
          if(y > 255 && y < 305) {
          console.log("restart");
            location.reload();
          }
          if(y > 330 && y < 380) {
            console.log("color ball");
            if(ballColorToken == 0) {ballColorToken ++ }
            else if(ballColorToken == 1) {ballColorToken ++ }
            else { ballColorToken = 0 }
            
          } 
          if(y > 405 && y < 455) {
            console.log("slow_down");
            if(ballSpeedToken == 0) {ballSpeedToken ++ }
            else if(ballSpeedToken == 1) {ballSpeedToken ++ }
            else { ballSpeedToken = 0 }
          }
          if(y > 480 && y < 530) {
            console.log("2 player");
            if(players == '1') {
              localStorage.setItem("twoplayers", '2');
              playerTwo();
            }
            if(players == '2') {
              localStorage.setItem("twoplayers", '1');
            }
            resume = true;
          }
        }
      click = 0;
      }
    }
  }

  function starCounter() {
    //try to add gradient
    context.beginPath();
    context.moveTo(382 + 7 * Math.cos( rad * 18), 20 + 7 * Math.sin(rad * 18));
    for( var i = 54; i <  360; i += 72)  {
    context.lineTo(382 + 10 * Math.cos( rad * i), 20 + 10 * Math.sin(rad * i));
    context.lineTo(382 + 6.25 * Math.cos( rad * (i + 36)), 20 + 6.25 * Math.sin(rad * (i + 36)));
    }
    context.fillStyle='white';
    context.fill();
    
    var y = localStorage.getItem('star_count');
    context.textBaseline='hanging';
    context.font='20px Major Mono Display, monospace';
    context.textAlign='end';
    if(y != null){
    context.fillText(y, 370, 12);
    }
    else{
      context.fillText('0', 370, 12);
    }
  }

  function highScore() {
    var highscore = localStorage.getItem("highscore");
    context.fillStyle='white';
    context.textAlign='start';
    context.font='13px Major Mono Display, monospace';
    context.fillText('highscore', 5, 580);
    if(highscore == null){
      context.fillText('0', 30, 562);
      localStorage.setItem('highscore', '0');
    }
    else {
      context.fillText(highscore, 30, 562);
    }
    context.textAlign='end';
    var x = Math.round(score);
    x /= 10;
    context.fillText('score', 390, 580);
    context.textAlign='center';
    context.fillText(x.toString(), 365, 560);
    if(x > Number(highscore)){
      localStorage.setItem('highscore', x.toString());
    }
  }

  function colorBallTimeChanger() {
    colorBallTimerReset= setInterval(() => {
      colorBallTimer --;
    }, 1000);
  }

  function colorBall() {
    if(colorball) {
      context.fillStyle='white';
      context.font='40px Major Mono Display, monospace';
      context.textBaseline='middle';
      context.textAlign='center';
      context.fillText(colorBallTimer, 200, 450);
      if(colorBallTimer < 1) {
        clearTimeout(colorBallTimerReset);
        colorball = false;
      }
    }
  }

  function speedBallTimeChanger() {
    speedBallTimerReset= setInterval(() => {
      speedBallTimer --;
    }, 1000);
  }

  function speedBall() {
    if(speedball) {
      context.fillStyle='white';
      context.font='40px Major Mono Display, monospace';
      context.textBaseline='middle';
      context.textAlign='center';
      context.fillText(speedBallTimer, 200, 450);
      if(speedBallTimer < 1) {
        clearTimeout(speedBallTimerReset);
        speedball = false;
        difficulty = speedballReset;
      }
    }
  }
}

playerTwo();