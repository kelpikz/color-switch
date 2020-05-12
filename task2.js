var canvas = document.getElementById("canvas");
canvas.style.background = "#2d292d";
var context = canvas.getContext("2d");
var rad = Math.PI / 180;
var colors = ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'];
var obs = [];
var lag =0;

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
  var obstrucleTag = Math.floor(Math.random() * 8);   //generates a number from 0 to 8
  x = Object.assign( {} , obstrucleSelector[obstrucleValueTag[obstrucleTag]] );
  // if(x.colorDependant) {x.color = '#13d2fc';}
  return x;
}

// myObstrucle = obsturcles.newObstrucle();
function initialObstrucles() {
  for(var i =0; i< 4; i++)  {
    obs[i] = newObstrucle();
    obs[i].yPosition -= ((i-1) * 500);
    if(obs[i].colorDependant){
      obs[i].color = '#13d2fc';
      console.log(obs[i]);
      obs[i].colorCreator();
    }
  };  

  // for(var i = 0; i< 4; i++) {
  //   console.log("the yPosition of " + (i+1) + " is " + obs[i].yPosition);
  // }
}

function obstrucleReinitializer() {
  
  for(var i =0; i < 4; i++) {
    if(obs[i].yPosition >= 1600) {
      obs[i] = newObstrucle();
      console.log("%c obs " + (i + 1) + " has been reset", 'background: red; color: white');
      if(obs[i].colorDependant){
        obs[i].colorCreator();
      }
    }
  }
};

function star(xPosition, yPosition) {
  //try to add gradient
  context.beginPath();
  context.moveTo(xPosition + 9 * Math.cos( rad * 18), yPosition + 9 * Math.sin(rad * 18));
  for( var i = 54; i <  360; i += 72)  {
  context.lineTo(xPosition + 15 * Math.cos( rad * i), yPosition + 15 * Math.sin(rad * i));
  context.lineTo(xPosition + 8.25 * Math.cos( rad * (i + 36)), yPosition + 8.25 * Math.sin(rad * (i + 36)));
  }
  context.fillStyle='white';
  context.fill();    
};

function colorBox(xPosition, yPosition, rotator) {    //rotating color changing wheel
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
  if(ball.y - (obstrucle.yPosition + 250) < 25 && obstrucle.wheel == true)   {
      if(obstrucle.colorDependant) {
          ball.color = obstrucle.color;
          return false;
      }   else    {
          ball.color = colors[Math.floor(Math.random() * 4)];
          return false;
      } 
  }
  return true;
};

function ballDraw() {  
  context.clearRect(0, 0, canvas.width, canvas.height);
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
    lag -= (1.25 + Math.pow((lag * 0.04),1.2));
  }
  else {
    for(var i =0; i < 4; i ++) {
      obs[i].yPosition += lag;
    }
    ball.y += lag;
    lag = 0;
  }
  obstrucleReinitializer();
}

var ball = {
  x: 250,
  y: 500,
  vy: 0,
  ay: 0.4,
  radius: 10,
  color : colors[Math.floor(Math.random() * 4)],
  movement: function () {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 0, rad * 360, true);
    context.closePath();
    context.fillStyle = this.color;
    context.fill();

  },

};

var circle = {                        
    name : "circle",
    xPosition : 250,
    yPosition : -400,
    i : 0,
    rotator : 0,
    colorDependant : false,
    wheel : true,
    obstrucleStar : star,
    colourChanger : colorBox,
    movement : function () {
        context.lineWidth = 20;
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

        this.obstrucleStar(this.xPosition,this.yPosition);
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
  xPosition : 250,                                       
  yPosition : -400,
  i : 0,
  rotator : 0,
  colorDependant : false,
  wheel : true,
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
  }

  this.obstrucleStar(this.xPosition,this.yPosition);
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
  xPosition : 250,
  yPosition : -400,
  i : 0,
  rotator : 0,
  colorDependant : false,
  wheel : true,
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
          
      this.obstrucleStar(this.xPosition,this.yPosition - 120);
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
  xPosition : 250,
  yPosition : -400,
  i : 0,
  rotator : 0,
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  j : 0,
  colorDependant : false,
  wheel : true,
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
      this.obstrucleStar(this.xPosition,this.yPosition);
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
  xPosition : 250,                                       
  yPosition : -400,
  i : 0,
  rotator : 0,
  colorDependant : false,
  wheel : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  movement : function () {

      context.lineWidth = 20;
      context.lineCap = "round";

     //context.clearRect( (xPosition - 120), (yPosition - 120), 240, 240);
     
     context.strokeStyle = "#13d2fc"; //light blue
      context.beginPath();
      context.moveTo(
        this.xPosition + 100 * Math.cos(rad * this.i),
        this.yPosition + 100 * Math.sin(rad * this.i)
      );
      context.lineTo(
        this.xPosition + 60 * Math.cos(rad * (this.i + 90)),
        this.yPosition + 60 * Math.sin(rad * (this.i + 90))
      );
      context.stroke();

      context.strokeStyle = "#ffb100"; //orange
      context.beginPath();
      context.moveTo(
        this.xPosition + 60 * Math.cos(rad * (this.i + 90)),
        this.yPosition + 60 * Math.sin(rad * (this.i + 90))
      );
      context.lineTo(
        this.xPosition + 100 * Math.cos(rad * (this.i + 180)),
        this.yPosition + 100 * Math.sin(rad * (this.i + 180))
      );
      context.stroke();

      context.strokeStyle = "#9254f4"; //purple
      context.beginPath();
      context.moveTo(
        this.xPosition + 100 * Math.cos(rad * (this.i + 180)),
        this.yPosition + 100 * Math.sin(rad * (this.i + 180))
      );
      context.lineTo(
        this.xPosition + 60 * Math.cos(rad * (this.i + 270)),
        this.yPosition + 60 * Math.sin(rad * (this.i + 270))
      );
      context.stroke();

      context.strokeStyle = "#ff3c85"; //pink
      context.beginPath();
      context.moveTo(
        this.xPosition + 60 * Math.cos(rad * (this.i + 270)),
        this.yPosition + 60 * Math.sin(rad * (this.i + 270))
      );
      context.lineTo(
        this.xPosition + 100 * Math.cos(rad * this.i),
        this.yPosition + 100 * Math.sin(rad * this.i)
      );
      context.stroke();
      this.i += 1.5;
      this.obstrucleStar(this.xPosition,this.yPosition);
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
  xPosition : 250,
  yPosition : -400,
  i : 90,
  j : 0,
  k : 0,
  rotator : 0,
  color : '#13d2fc',
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  colorDependant : true,
  wheel : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  colorCreator : function () {
    var x = [Math.floor(Math.random() * 4)];
    // debugger;
    this.color = this.colors[x[0]];
    console.log(this.color);
  },
  movement : function () {
      context.lineWidth = 14;
      for(this.k = 0; this.k < 20; this.i += 0.065, this.j -= 0.065, this.k ++) {
          for(this.color = 0; this.color < 271; this.color += 90) {
              
              context.strokeStyle = this.colors[this.color/90];  
              context.beginPath();
              context.arc(
                  this.xPosition,
                  this.yPosition,
                  90,
                  rad * (this.i + this.color),
                  rad * (this.i + this.color + 90));
              context.stroke();

              context.beginPath();
              context.arc(
                  this.xPosition,
                  this.yPosition,
                  72,
                  rad * (this.j + this.color),
                  rad * (this.j + this.color + 90));
              context.stroke();

              context.beginPath();
              context.arc(
                  this.xPosition,
                  this.yPosition,
                  54,
                  rad * (this.i + this.color),
                  rad * (this.i + this.color + 90));
              context.stroke();
          }
      }
      this.obstrucleStar(this.xPosition,this.yPosition);
      // collisonDetectionBottom = context.getImageData(xPosition, yPosition+95, 1, 1).data[1];
      // collisonDetectionTop = context.getImageData(xPosition, yPosition-95, 1, 1).data[1];
      if(this.wheel) {
        this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      if(this.wheel) {
        this.wheel = colorChange(this);
      }
  },  
};

var twoCircles = {                        
  name : "two circles",
  xPosition : 250,                                       
  yPosition : -400,
  i : 0,
  j : -90,
  rotator : 0,
  color : '#13d2fc',
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  colorDependant : true,
  wheel : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  colorCreator : function () {
    var x = [Math.floor(Math.random() * 4)];
    this.color = this.colors[x[0]];
  },
  movement : function() {
    context.lineWidth = 16;
    for(this.k = 0; this.k < 20; this.i += 0.065, this.j -= 0.065, this.k ++) {
        for(this.color = 0; this.color < 271; this.color += 90) {
            
            context.strokeStyle = this.colors[this.color/90];  
            context.beginPath();
            context.arc(
                this.xPosition + 60,
                this.yPosition,
                52,
                rad * (this.i + this.color),
                rad * (this.i + this.color + 90));
            context.stroke();

            context.beginPath();
            context.arc(
                this.xPosition - 80,
                this.yPosition,
                72,
                rad * (this.j + this.color),
                rad * (this.j + this.color + 90));
            context.stroke();
          }    
      }
      this.obstrucleStar(this.xPosition,this.yPosition - 150);
      if(this.wheel) {
        this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      if(this.wheel) {
        this.wheel = colorChange(this);
      }
  }
};

var triangles = {
  //delete the color element and push that to the start of colors
                          
  name : "triangles",
  xPosition : 250,
  yPosition : -400,
  i : 0,
  rotator : 0,
  color : '#13d2fc',
  colors : ['#13d2fc', '#ffb100', '#9254f4', '#ff3c85'],
  colorDependant : true,
  wheel : true,
  obstrucleStar : star,
  colourChanger : colorBox,
  colorCreator : function () {
    var x = [Math.floor(Math.random() * 4)];
    this.color = this.colors[x[0]];
  },
  movement : function () {
      context.lineWidth= 18;
      context.lineCap='round';
      
      for(var j = 0; j< 360; j+= 120, this.i += 0.65) {
          context.beginPath();
          context.moveTo(
              this.xPosition + 100 * Math.cos(rad * (this.i + j)),
              this.yPosition + 100 * Math.sin(rad * (this.i + j))
          );
          context.lineTo(
              this.xPosition + 100 * Math.cos(rad * (this.i + j +120)),
              this.yPosition + 100 * Math.sin(rad * (this.i + j +120))
          );
          context.strokeStyle=this.colors[j/120];
          context.stroke();
      }
      if(this.wheel) {
        this.rotator = this.colourChanger(this.xPosition,this.yPosition + 250, this.rotator);
      }
      this.obstrucleStar(this.xPosition,this.yPosition);
      if(this.wheel) {
        this.wheel = colorChange(this);
      }  
  }
};

function run() {
  ballDraw();
  ball.movement();
  for(var i =0; i< 4; i ++) {
    obs[i].movement();
  }
  
  window.requestAnimationFrame(run);
}

initialObstrucles();
run();


canvas.addEventListener("click", function () {
  ball.vy = -7.5;
// console.log(ball.vy);
});



// setInterval(() => {
//   console.log("*************************************");
//   for(var i = 0; i< 4; i++) {
//     console.log("the yPosition of " + (i+1) + " is " + obs[i].yPosition);
//   }
// }, 1500);