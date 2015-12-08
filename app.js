window.onload = function(){
game();
};

function game(){
  var worldPane = document.getElementById('worldPane');
  var statusPane = document.getElementById('statusPane');
  var btnInv = document.getElementById('btnInv');
  //var statusPane = document.getElementById('statusPane');
  var statsPane = document.getElementById('stats');
  //Remi:
  /*******
  Properties:
    (Entity)
  ____
  Actions:

    Move
    Jump
    Dig
    Swim
    Fly
    Interact
  *******/

  //Entity
  /*******
  Properties

    Health
    Strength
    Agility
    Intelligence
    Charisma

  *******/
  var BuildEntity = function(){
    return {
      location: {
        x: -1,
        y: -1
      },
      atr:{
        health: 1,
        strength: 1,
        agility: 1,
        intelligence: 1,
        charisma: 1,
        sight: 1
      },
      get: function(getStr){
        return this.atr[getStr];
      },
      set: function(setStr, val){
        if(val >= 0 && val <= 50)
        {
          this.atr[setStr] = val;
        }
        return this.atr[setStr];
      },
      actions: {
        move: function(dir){
          console.log('Move!');
          char = this.Parent;
          var newLoc = {};
          if(dir === 'w')
          {
            newLoc = {
              x:char.location.x,
              y:char.location.y-1
            };
          }
          else if(dir === 's')
          {
            newLoc = {
              x:char.location.x,
              y:char.location.y+1
            };
          }
          else if(dir === 'a')
          {
            newLoc = {
              x:char.location.x-1,
              y:char.location.y
            };
          }
          else if(dir === 'd')
          {
            newLoc = {
              x:char.location.x+1,
              y:char.location.y
            };
          }
          if(moveValid(newLoc))
          {
            world.toOrigin(char.location);
            world.map[newLoc.x][newLoc.y].content = 'x';
            //console.log(world.map[newLoc.x]);
            char.location = newLoc;
          }
          console.log(char.location);
        },
        jump: function(){
          console.log('Jump!');
        },
        dig: function(){
          console.log('Dig!');
        },
        swim: function(){
          console.log('Swim!');
        },
        fly: function(){
          console.log('fly!');
        },
        interact: function(){
          console.log('Interact!');
        }
      },

      Init: function() {
        this.actions.Parent = this;
        delete this.Init;
        return this;
    }
    };
  };

  var human = function(){
    human = BuildEntity().Init();
    human.health = 20;
    return human;
  };
  var hero = function(){
    hero = BuildEntity().Init();
    hero.atr.health = 20;
    hero.atr.strength = 8;
    hero.atr.agility = 8;
    hero.atr.intelligence = 8;
    hero.atr.charisma = 8;
    hero.atr.sight = 4;
    hero.atr.sightOrigin = hero.atr.sight;
    return hero;
  };

  var worldCreate = function(){
    return{
    map: [],
    height: 500,
    width: 1000,
    scope: 10,
    init: function(){
      for(var i=0; i < this.width; i++)
      {
        this.map[i] = [];
        for(var j=0; j < this.height; j++)
        {
          this.map[i][j] = {};
          this.map[i][j].content = this.randomItem();
          this.map[i][j].origin = this.map[i][j].content;
        }
      }
    },
    toOrigin: function(loc){
      world.map[loc.x][loc.y].content = world.map[loc.x][loc.y].origin;
    },
    step: function(){
      /*
      for(var i=1; i < this.width; i++)
      {
        for(var j=0; j < this.height; j++)
        {
          this.map[i-1][j].content = this.map[i][j].content;
        }
        if(i == this.width-1){
          this.buildLine();
        }
      }
      */
    },
    buildLine: function(){
      for(var j = 0; j < this.height; j++)
      {
        this.map[this.width-1][j].content = this.randomItem();
      }
    },
    randomItem: function(){
      var item = Math.floor(Math.random()*100);
      var char = 0;
      if(item > 50)
      {
        char = 0;
      } else if (item >30) {
        char = 1;
      } else if (item >12) {
        char = 2;
      } else if (item > 10) {
        char = 3;
      } else {
        char = 0;
      }
      return char;
    },
    getFadeLvl : function(i,j){
      if((j-remi.location.x <= this.scope + remi.atr.sight)&&(i-remi.location.y <= this.scope + remi.atr.sight)){
        fadeLvl = 0;
        var ySet = i-remi.location.y;
        var xSet = j-remi.location.x;
        if(parseFloat(ySet) < 0)
          ySet = ySet *-1;
        if(parseFloat(xSet) < 0)
          xSet = xSet *-1;

        if(xSet > ySet)
          fadeLvl = xSet;
        else
          fadeLvl = ySet;

        fadeLvl = fadeLvl - remi.atr.sight;
        //fade = true;
      }
      return fadeLvl;
    },
    superCoverLine : function(p0, p1) {
    var Point = function(newX,newY){
      return{
        x:newX,
        y:newY
      };
    };
    var dx = p1.x-p0.x, dy = p1.y-p0.y;
    var nx = Math.abs(dx), ny = Math.abs(dy);
    var sign_x = dx > 0? 1 : -1, sign_y = dy > 0? 1 : -1;

    var p = new Point(p0.x, p0.y);
    var points = [new Point(p.x, p.y)];
      for (var ix = 0, iy = 0; ix < nx || iy < ny;) {
        if ((0.5+ix) / nx == (0.5+iy) / ny) {
            // next step is diagonal
            p.x += sign_x;
            p.y += sign_y;
            ix++;
            iy++;
          } else if ((0.5+ix) / nx < (0.5+iy) / ny) {
            // next step is horizontal
            p.x += sign_x;
            ix++;
          } else {
            // next step is vertical
            p.y += sign_y;
            iy++;
        }
        points.push(new Point(p.x, p.y));
      }
    return points;
    },
    display: function(){
      var dispStr = '';
      //var fullView = [];
      for(var i=remi.location.y-this.scope; i < remi.location.y+this.scope; i++)
      {
        var col = '<div class="row r'+i+'">';
        for(var j=remi.location.x-this.scope; j < remi.location.x+this.scope; j++)
        {
          var currLoc = {
            x: j,
            y: i
          };
          var fadeLvl = false;
          fadeLvl = this.getFadeLvl(i,j);

          var arrView = this.superCoverLine(remi.location, currLoc);
          var view = true;
          for(var k = 1; k < arrView.length-1; k++)
          {
            if(this.map[arrView[k].x][arrView[k].y].content === 1)
            {
              view =  false;
              console.log("view: false");
            }
          }
          if(!view)
          {
            col = col + '<div class="grid loc'+i+','+j +' con' + this.map[j][i].content +' fade'+fadeLvl+' vHide">'+'</div>';
          }

          else if(fadeLvl)
          {
            col = col + '<div class="grid loc'+i+','+j +' con' + this.map[j][i].content +' fade'+fadeLvl+' vShow">'+'</div>';
          }
          else {
            col = col + '<div class="grid loc'+i+','+j +' con' + this.map[j][i].content +' vShow">'+'</div>';
            }
        }
        col = col +'</div>';
        dispStr = dispStr + col;
      }
      worldPane.innerHTML = dispStr;
      var statsStr = '';
      for(var item in remi.atr)
      {
        statsStr = statsStr + '<div class="row statsItem atr:'+item+'">'+item+': '+remi.atr[item]+'</div>';
      }
      statsPane.innerHTML = statsStr;
    }
  };
  };
  function runGame()
  {
    world.step();
    world.display();
  }
  function moveValid(loc)
  {
    var pass = false;
    if(loc !== undefined && loc.x >= 0 && loc.y >=0 && loc.x <= world.width && loc.y <=world.height)
      if(world.map[loc.x][loc.y].content === 0 || world.map[loc.x][loc.y].content === 2)
        pass = true;

    return pass;
  }

  window.addEventListener('keypress', function(event){
    var press = String.fromCharCode(event.charCode);
    var locString = '';
    var currLoc = {
      x : remi.location.x,
      y : remi.location.y
    };
    console.log("Inside");

    if (press ==='w' || press ==='s' || press ==='a' || press ==='d')
    {
      remi.actions.move(press);
      world.display();
    }
    if (press ==='v')
    {
      world.toOrigin(remi.location);
      world = belowWorld;
      world.map[remi.location.x][remi.location.y].content = 'x';
      remi.atr.sight = Math.floor(remi.atr.sight / 5);
      world.display();

    }
    if (press ==='f')
    {
      world.toOrigin(remi.location);
      world = mainWorld;
      world.map[remi.location.x][remi.location.y].content = 'x';
      remi.atr.sight = remi.atr.sightOrigin;
      world.display();
    }
    console.log("ehh?");
  });
/**********************
Main game start functions:
Multiple World Creation
Initial Display

**********************/

  var mainWorld = new worldCreate();
  var belowWorld = new worldCreate();

  var world = mainWorld;

  var remi = hero();
  remi.location.x = Math.round(world.width/2);
  remi.location.y = Math.round(world.height/2);
  console.log(remi);
  console.log(world);

  mainWorld.init();
  belowWorld.init();
  world.map[remi.location.x][remi.location.y].content = 'x';
  world.display();

  belowWorld.display = function(){
      var dispStr = '';
      for(var i=remi.location.y-this.scope; i < remi.location.y+this.scope; i++)
      {
        var col = '<div class="row r'+i+'">';
        for(var j=remi.location.x-this.scope; j < remi.location.x+this.scope; j++)
        {
          var currLoc = {
            x: j,
            y: i
          };
          var fadeLvl = false;
          fadeLvl = this.getFadeLvl(i,j);

          var arrView = this.superCoverLine(remi.location, currLoc);
          var view = true;
          for(var k = 1; k < arrView.length-1; k++)
          {
            if(this.map[arrView[k].x][arrView[k].y].content === 1)
            {
              view =  false;
              console.log("view: false");
            }
          }
          if(!view)
          {
            col = col + '<div class="grid loc'+i+','+j +' conU' + this.map[j][i].content +' fade'+fadeLvl+' vHide">'+'</div>';
          }

          else if(fadeLvl)
          {
            col = col + '<div class="grid loc'+i+','+j +' conU' + this.map[j][i].content +' fade'+fadeLvl+' vShow">'+'</div>';
          }
          else {
            col = col + '<div class="grid loc'+i+','+j +' conU' + this.map[j][i].content +' vShow">'+'</div>';
            }
        }
        col = col +'</div>';
        dispStr = dispStr + col;
      }
      worldPane.innerHTML = dispStr;
      var statsStr = '';
      for(var item in remi.atr)
      {
        statsStr = statsStr + '<div class="row statsItem atr:'+item+'">'+item+': '+remi.atr[item]+'</div>';
      }
      statsPane.innerHTML = statsStr;
    };


  btnInv.addEventListener('click', function(event){
    /*setInterval(function(){
    runGame();
  }, 10);*/
  });

}
