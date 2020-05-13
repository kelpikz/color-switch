var canvas = document.getElementById("canvas");
canvas.style.background = "#2d292d";
var context = canvas.getContext("2d");
var ctx = canvas.getContext("2d");
var rad = Math.PI / 180;
var colors = ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'];
var obs = [];
var lag =0;
var collisonDetectionBottom = 0, collisonDetectionTop = 0;
var smallBalls =[];
var score = 0;

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

// myObstrucle = obsturcles.newObstrucle();
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
          obstrucle.colorChecker();
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
  for(i=0;i<12;i++){
    if(smallBalls[i].y < 600) {
      break;
    }
  }
  if(i=12) {
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
      // ballBurst();
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
  movement: function () {
      if(this.burst == false) {
      context.beginPath();
      context.arc(this.x, this.y, this.radius, 0, rad * 360, true);
      context.closePath();
      context.fillStyle = this.color;
      context.fill();
      hit();
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
        this.i += 1.5;

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
  for(var j =0; j< 360; j += 90, this.i += 0.45)  {
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
      this.i += 1.75;
      
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
    for(this.j=0; this.j < 24 ; this.i += 15.05 , this.j ++) {
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
      this.i += 1.5;
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
      for(this.k = 0; this.k < 20; this.i += 0.065, this.j -= 0.065, this.k ++) {
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
    
    for(this.k = 0; this.k < 20; this.i += 0.065, this.j -= 0.065, this.k ++) {
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
      
      for(var j = 0; j< 360; j+= 120, this.i += 0.65) {
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
  window.requestAnimationFrame(run);
}

initialObstrucles();
run();


canvas.addEventListener("click", function () {
  ball.vy = -7.5;
// console.log(ball.vy);
});


function pauseMenu() {
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
