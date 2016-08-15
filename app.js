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
      currentFlop : false,
      ignoreFlop : false,
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
          //console.log('Move!');
          char = this.Parent;
          if(world.currentFlop !== char.currentFlop || char.ignoreFlop)
          {
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
            if(moveValid(newLoc, world))
            {
              var hold = world.map[newLoc.x][newLoc.y].origin;
              world.toOrigin(char.location);
              world.map[newLoc.x][newLoc.y] = char;
              world.map[newLoc.x][newLoc.y].origin = hold;
              //console.log(world.map[newLoc.x]);
              char.location = newLoc;
            }
            //console.log(char.location);
            char.currentFlop = !char.currentFlop;
          }
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
    human.atr.health = 20;
    return human;
  };
  var boar = function(){
    boar = BuildEntity().Init();
    delete boar.Init;
    boar.atr.health = 4;
    boar.atr.strength = 2;
    boar.atr.agility = 1;
    boar.atr.intelligence = 1;
    boar.atr.charisma = 1;
    boar.atr.sight = 3;
    boar.atr.speed = 1;
    boar.content = 'b';
    return boar;
  };
  var hero = function(){
    hero = BuildEntity().Init();
    hero.atr.health = 20;
    hero.atr.strength = 8;
    hero.atr.agility = 8;
    hero.atr.intelligence = 8;
    hero.atr.charisma = 8;
    hero.content = 'x';
    hero.atr.sight = 0;
    hero.atr._sightOrigin = hero.atr.sight;
    return hero;
  };
  var charMap = {
    b:boar,
    h:human
  };
  var circleMap = ['x','3',3,'b','h'];

  var worldCreate = function(){
    var rowHold = [];
    return{
    map: [],
    worldTag: arguments[0],
    currentFlop: false,
    height: 1000,
    width: 1000,
    scope: 10,
    textureMap: {
      types:{
        0:'open',
        1:'wall',
        2:'grass',
        3:'tree'
      },
      wall:{
        isWalkable:false,
        size:4,
        0:20,
        1:40,
        2:25,
        3:2,
        'default':0
      },
      open: {
        isWalkable:true,
        size:4,
        0:75,
        1:1,
        2:12,
        3:2,
        'default':0
      },
      grass: {
        isWalkable:true,
        size:4,
        0:5,
        1:17,
        2:75,
        3:2,
        'default':0
      },
      tree: {
        isWalkable:false,
        size:4,
        0:50,
        1:5,
        2:35,
        3:0,
        'default':0
      },
      base: {
        isWalkable:true,
        size:4,
        0:40,
        1:35,
        2:15,
        3:2,
        'default':0
      }
    },
    init: function(){
      for(var i=0; i < this.width; i++)
      {
        this.map[i] = [];
        for(var j=0; j < this.height; j++)
        {
          this.map[i][j] = {};

          if((rowHold[j]) && (this.textureMap.types[rowHold[j].content] !== undefined || this.textureMap.types[this.map[i][j-1]] !== undefined)){
            this.map[i][j].content = this.randomItem(this.textureMap.types[rowHold[j].content]);
          }
          else {
            this.map[i][j].content = this.randomItem();
          }

          if(j <= this.scope || i <= this.scope || i >= this.width - this.scope || j >= this.height - this.scope)
          {
            this.map[i][j].content = 1;
          }

          this.map[i][j].origin = this.map[i][j].content;
          if(this.map[i][j].content !== 1)
            this.map[i][j] = this.randomEntity(this.map[i][j]);
        }
        rowHold = this.map[i];
      }
    },
    toOrigin: function(loc){
      var origin = this.map[loc.x][loc.y].origin;
      this.map[loc.x][loc.y] = {};
      this.map[loc.x][loc.y].content = origin;
      this.map[loc.x][loc.y].origin = origin;
    },
    randomItem: function(){
      var item = Math.floor(Math.random()*100);
      var char = 0;
      var mod = arguments[0];
      if(!mod){
        var chances = this.textureMap.base;
        var hold = 0;
        for(var i=0; i < chances.size && !char; i++)
        {
          if(item < chances[i] + hold)
            char = i;
          else
            hold = hold + chances[i];
        }
        if(!char)
          char = chances['default'];
      }else {
        var chances = this.textureMap[mod];
        var hold = 0;
        for(var i=0; i < chances.size && !char; i++)
        {
          if(item < chances[i] + hold)
            char = i;
          else
            hold = hold + chances[i];
        }
        if(!char)
          char = chances['default'];
      }
      return char;
    },
    randomEntity: function(currThings){
      var item = Math.floor(Math.random()*100);
      var char = {};
      if(item > 60)
      {
        char = currThings;
      } else if (item >58) {
        char = currThings;
        char.content = 'b';
      } else if (item >54) {
        char = currThings;
      } else if (item > 45) {
        char = currThings;
      } else {
        char = currThings;
      }
      if(currThings.content === '3' || currThings.content === 3)
      {
        char.origin = '0';
      }
      else{
        char.origin = currThings.origin;
      }
      return char;
    },
    getFadeLvl : function(i,j){
      var fadeLvl = 0;
      if((j-remi.location.x <= (this.scope*2) + remi.atr.sight)&&(i-remi.location.y <= (this.scope *2) + remi.atr.sight)){
        var ySet = i-remi.location.y;
        var xSet = j-remi.location.x;
        if(parseFloat(ySet) < 0)
          ySet = ySet *-1;
        if(parseFloat(xSet) < 0)
          xSet = xSet *-1;

        if(xSet > ySet)
          fadeLvl = xSet;
        else
          fadeLvl = ySet; //Set *2 for specular fade.

        fadeLvl = fadeLvl - remi.atr.sight;
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
      //console.log(points);
      return points;
    },
    display: function(){
      var dispStr = '';
      var specialWorldTag = this.worldTag;
      for(var i=remi.location.y-this.scope; i < remi.location.y+this.scope; i++)
      {
        var col = '<div class="row r'+i+'">';
        for(var j=remi.location.x- (this.scope * 2); j < remi.location.x+ (this.scope *2); j++)
        {
          var currLoc = {
            x: j,
            y: i
          };
          var fadeLvl = false;
          fadeLvl = this.getFadeLvl(i,j);

          var arrView = this.superCoverLine(remi.location, currLoc);

          var secLoc = {x:remi.location.x, y:remi.location.y};
          var secondaryView = [];

          // X & Y Directions
          secLoc.x ++;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));

          secLoc.x = secLoc.x-2;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));

          secLoc = {x:remi.location.x, y:remi.location.y};
          secLoc.y ++;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));

          secLoc.y = secLoc.y -2;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));

          /**************/

          // Diagonal Directions
          secLoc = {x:remi.location.x, y:remi.location.y};
          secLoc.y ++;
          secLoc.x ++;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));

          secLoc = {x:remi.location.x, y:remi.location.y};
          secLoc.y --;
          secLoc.x --;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));

          secLoc = {x:remi.location.x, y:remi.location.y};
          secLoc.y ++;
          secLoc.x --;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));

          secLoc = {x:remi.location.x, y:remi.location.y};
          secLoc.y --;
          secLoc.x ++;
          if(this.map[secLoc.x][secLoc.y].content !== 1)
            secondaryView.push(this.superCoverLine(secLoc, currLoc));


          /**************/

          var view = false;
          var directView = true;
          var sideView = false;
          for(var k = 1; k < arrView.length-1; k++)
          {
            if(this.map[arrView[k].x][arrView[k].y].content === 1)
            {
              directView =  false;
            }
          }
          for(var v=0; v < secondaryView.length; v++)
          {
            var chunkView = true;
            for(var k = 1; k < secondaryView[v].length-1; k++)
            {
              if(this.map[secondaryView[v][k].x][secondaryView[v][k].y].content === 1)
              {
                chunkView =  false;
              }
            }
            if(chunkView === true)
            {
                sideView = true;
            }
          }

          if(directView || sideView)
          {
            view = true;
          }

          var flag = false;


          if(!view)
          {
            col = col + '<div class="grid loc'+i+','+j +' con' + specialWorldTag + this.map[j][i].content +' fade'+fadeLvl+' vHide">'+'</div>';
          }
          else if(fadeLvl)
          {
            if(circleMap.indexOf(this.map[j][i].content) > -1)
            {
              flag = true;
              col=col+'<div class ="charWrapper con' + specialWorldTag +  this.map[j][i].origin +' fade'+fadeLvl+'">';
            }
            col = col + '<div class="grid loc'+i+','+j +' con' +  specialWorldTag+ this.map[j][i].content +' fade'+fadeLvl+' vShow">'+'</div>';
          }
          else
          {
            if(circleMap.indexOf(this.map[j][i].content) > -1)
            {
              flag = true;
              col=col+'<div class ="charWrapper con' + specialWorldTag +  this.map[j][i].origin +' fade'+fadeLvl+'">';
            }
            col = col + '<div class="grid loc'+i+','+j +' con' + specialWorldTag + this.map[j][i].content +' vShow">'+'</div>';
          }

          if(flag)
          {
            col=col+'</div>';
          }
        }
        col = col +'</div>';
        dispStr = dispStr + col;
      }
      worldPane.innerHTML = dispStr;
      this.statsDisplay();
    },
    statsDisplay: function(){
      var statsStr = '';
      for(var item in remi.atr)
      {
        if(item[0] !== '_')
        {
          statsStr = statsStr + '<div class="row statsItem atr:'+item+'">'+item+': '+remi.atr[item]+'</div>';
        }
      }
      statsPane.innerHTML = statsStr;
    }
  };
  };
  function runGame()
  {
    world.currentFlop = !world.currentFlop;
    moveWorld(world);
    world.display();
  }
  function moveValid(loc, currWorld)
  {
    var item = currWorld.map[loc.x][loc.y].content;
    var pass = false;
    if(loc !== undefined && loc.x >= currWorld.scope && loc.y >= currWorld.scope && loc.x <= currWorld.width - currWorld.scope && loc.y <= currWorld.height - currWorld.scope)
    {
      try{
      var walk = currWorld.textureMap[currWorld.textureMap.types[item]].isWalkable;

      if(walk)
        pass = true;
      }
      catch(err){
        console.log("Cannot walk on " + item);
      }
    }
    return pass;
  }

  function fillWorld(currWorld)
  {
    for(var i=0; i < currWorld.width; i++)
    {
      for(var j=0; j < currWorld.height; j++)
      {
        if(charMap[currWorld.map[i][j].content] !== undefined)
        {
          var hold = currWorld.map[i][j].origin;
          currWorld.map[i][j] = new charMap[currWorld.map[i][j].content]();
          currWorld.map[i][j].location = {x:i,y:j};
          currWorld.map[i][j].origin = hold;
        }
      }
    }
  }

  function moveWorld(currWorld)
  {
    for(var i=remi.location.y-(currWorld.scope *2); i < remi.location.y+(currWorld.scope *2); i++)
    {
      var col = '<div class="row r'+i+'">';
      for(var j=remi.location.x-(currWorld.scope *2); j < remi.location.x+(currWorld.scope *2); j++)
      {
        if(charMap[currWorld.map[j][i].content] !== undefined)
        {
          //var hold = currWorld.map[i][j].origin;
          currWorld.map[j][i].actions.move(randomDir());
        }
      }
    }
  }

  function randomDir()
  {
    var dir = '';
    var randDir = Math.floor(Math.random()*4);
    switch(randDir){
      case 0:
        dir = 'w';
        break;
      case 1:
        dir = 's';
        break;
      case 2:
        dir = 'a';
        break;
      case 3:
        dir = 'd';
        break;
      default:
        dir = 'w';
        break;
    }
    return dir;
  }

  window.addEventListener('keypress', function(event){
    var press = String.fromCharCode(event.charCode);
    var locString = '';
    var currLoc = {
      x : remi.location.x,
      y : remi.location.y
    };

    if (press ==='w' || press ==='s' || press ==='a' || press ==='d')
    {
      remi.actions.move(press);
      world.display();
    }
    if (press ==='v')
    {
      if(moveValid(remi.location, belowWorld))
      {
        world.toOrigin(remi.location);
        world = belowWorld;
        world.map[remi.location.x][remi.location.y].content = 'x';
        remi.atr.sight = Math.floor(remi.atr.sight / 5);
        world.display();
      }
    }
    if (press ==='f')
    {
      if(moveValid(remi.location, mainWorld))
      {
        world.toOrigin(remi.location);
        world = mainWorld;
        world.map[remi.location.x][remi.location.y].content = 'x';
        remi.atr.sight = remi.atr._sightOrigin;
        world.display();
      }
    }
  });
/**********************
Main game start functions:
Multiple World Creation
Initial Display

**********************/

  var mainWorld = new worldCreate('');
  var belowWorld = new worldCreate('U');

  var world = mainWorld;

  var remi = hero();
  remi.location.x = Math.round(world.width/2);
  remi.location.y = Math.round(world.height/2);
  remi.ignoreFlop = true;
  console.log(remi);
  console.log(world);

  mainWorld.init();
  belowWorld.init();
  fillWorld(mainWorld);
  fillWorld(belowWorld);
  world.map[remi.location.x][remi.location.y].content = 'x';

  document.querySelector('#loadingImg').style.display = 'none';
  world.display();


  btnInv.addEventListener('click', function(event){
    setInterval(function(){
    runGame();
  }, 1000);
  });

}
